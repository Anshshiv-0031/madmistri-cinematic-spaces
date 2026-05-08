
-- =========================
-- ROLES
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'content_manager');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bootstrap: first signed-up user becomes admin automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- updated_at helper
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Staff manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- PROJECTS
-- =========================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  client_name TEXT,
  location TEXT,
  completion_date DATE,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects public read" ON public.projects FOR SELECT USING (published = true OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_projects_category ON public.projects(category_id);
CREATE INDEX idx_projects_featured ON public.projects(featured);

-- =========================
-- BLOGS
-- =========================
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blogs public read" ON public.blogs FOR SELECT USING (published = true OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage blogs" ON public.blogs FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER set_blogs_updated_at BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- TESTIMONIALS
-- =========================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating SMALLINT DEFAULT 5,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published testimonials public read" ON public.testimonials FOR SELECT USING (published = true OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER set_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- MEDIA
-- =========================
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  alt_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media public read" ON public.media FOR SELECT USING (true);
CREATE POLICY "Staff manage media" ON public.media FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =========================
-- LEADS
-- =========================
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'meeting_scheduled', 'closed');

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  business_type TEXT,
  message TEXT,
  interested_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  source TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read leads" ON public.leads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update leads" ON public.leads FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete leads" ON public.leads FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER set_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- STORAGE BUCKETS
-- =========================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('project-images', 'project-images', true),
  ('project-videos', 'project-videos', true),
  ('blog-media', 'blog-media', true),
  ('general-uploads', 'general-uploads', true);

CREATE POLICY "Public read project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Staff write project-images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff update project-images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete project-images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND public.is_staff(auth.uid()));

CREATE POLICY "Public read project-videos" ON storage.objects FOR SELECT USING (bucket_id = 'project-videos');
CREATE POLICY "Staff write project-videos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-videos' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff update project-videos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-videos' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete project-videos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-videos' AND public.is_staff(auth.uid()));

CREATE POLICY "Public read blog-media" ON storage.objects FOR SELECT USING (bucket_id = 'blog-media');
CREATE POLICY "Staff write blog-media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff update blog-media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete blog-media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-media' AND public.is_staff(auth.uid()));

CREATE POLICY "Public read general-uploads" ON storage.objects FOR SELECT USING (bucket_id = 'general-uploads');
CREATE POLICY "Staff write general-uploads" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'general-uploads' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff update general-uploads" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'general-uploads' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete general-uploads" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'general-uploads' AND public.is_staff(auth.uid()));
