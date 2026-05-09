import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Journal — Mad Mistri" },
      { name: "description", content: "Notes on craft, materials and modern hospitality design from the Mad Mistri studio." },
      { property: "og:title", content: "Journal — Mad Mistri" },
      { property: "og:description", content: "Field notes on craft and commercial interiors." },
    ],
  }),
  component: BlogsPage,
});

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=80",
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1600&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1600&q=80",
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1600&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80",
];

const FALLBACK_POSTS = [
  { title: "The case for solid walnut in commercial spaces", slug: "case-for-solid-walnut", tags: ["Materials"], published_at: "2025-03-01", featured_image: FALLBACK_IMAGES[0], excerpt: "Why we keep returning to walnut for high-traffic hospitality interiors." },
  { title: "Designing acoustics into the dining room", slug: "designing-acoustics-dining", tags: ["Design Notes"], published_at: "2025-02-01", featured_image: FALLBACK_IMAGES[1], excerpt: "How upholstery, ceilings and layout tame the modern restaurant." },
  { title: "Why your bar stool is your hardest-working chair", slug: "bar-stool-hardest-working", tags: ["Furniture"], published_at: "2025-01-01", featured_image: FALLBACK_IMAGES[2], excerpt: "Engineering for the chair that takes the most punishment." },
  { title: "Lighting moods for the all-day café", slug: "lighting-moods-cafe", tags: ["Design Notes"], published_at: "2024-12-01", featured_image: FALLBACK_IMAGES[3], excerpt: "One room, three lighting personalities." },
  { title: "Coastal hotels: surviving salt air with grace", slug: "coastal-hotels-salt-air", tags: ["Hospitality"], published_at: "2024-11-01", featured_image: FALLBACK_IMAGES[4], excerpt: "Material choices that weather beautifully without losing luxury." },
];

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function BlogsPage() {
  const { data } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blogs")
        .select("title,slug,excerpt,featured_image,published_at,tags")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  const posts = (data && data.length > 0 ? data : FALLBACK_POSTS).map((p: any, i: number) => ({
    ...p,
    featured_image: p.featured_image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
    category: (p.tags && p.tags[0]) || "Journal",
  }));

  if (posts.length === 0) return null;

  const [hero, ...rest] = posts;

  return (
    <>
      <section className="relative pt-40 md:pt-52 pb-20 md:pb-28 bg-ink text-bone overflow-hidden">
        <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30"/>
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold mb-6">Journal</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-4xl">
            Notes from the <span className="italic text-gold">workshop floor.</span>
          </h1>
        </div>
      </section>

      <section className="bg-bone text-ink py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Link to="/blogs" className="group block relative overflow-hidden mb-10 aspect-[16/9] md:aspect-[16/7]">
            <img src={hero.featured_image} alt={hero.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"/>
            <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end text-bone">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">Featured · {hero.category}</p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl max-w-3xl text-balance">{hero.title}</h2>
              <p className="mt-4 text-bone/60 text-xs uppercase tracking-[0.2em]">{fmtDate(hero.published_at)}</p>
            </div>
          </Link>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
            {rest.map((p: any) => (
              <Link key={p.slug} to="/blogs" className="group block">
                <div className="relative overflow-hidden aspect-[16/10] mb-5">
                  <img src={p.featured_image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"/>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-walnut mb-2">{p.category} · {fmtDate(p.published_at)}</p>
                <h3 className="font-display text-2xl md:text-3xl group-hover:text-walnut transition-colors text-balance">{p.title}</h3>
                {p.excerpt && <p className="mt-3 text-sm text-charcoal/70 leading-relaxed line-clamp-2">{p.excerpt}</p>}
                <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-charcoal/60 group-hover:text-walnut">
                  Read article <ArrowUpRight size={12}/>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
