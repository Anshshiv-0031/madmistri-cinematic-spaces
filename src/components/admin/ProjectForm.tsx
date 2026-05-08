import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { MediaUpload } from "./MediaUpload";
import { X } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

export function ProjectForm({ existing }: { existing?: any }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    summary: existing?.summary ?? "",
    description: existing?.description ?? "",
    category_id: existing?.category_id ?? "",
    cover_image: existing?.cover_image ?? "",
    images: (existing?.images ?? []) as string[],
    videos: (existing?.videos ?? []) as string[],
    client_name: existing?.client_name ?? "",
    location: existing?.location ?? "",
    completion_date: existing?.completion_date ?? "",
    featured: existing?.featured ?? false,
    published: existing?.published ?? true,
    tags: (existing?.tags ?? []) as string[],
    seo_title: existing?.seo_title ?? "",
    seo_description: existing?.seo_description ?? "",
  });
  const [tagInput, setTagInput] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const cats = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title) throw new Error("Title required");
      const payload: any = {
        ...form,
        slug: form.slug || slugify(form.title),
        category_id: form.category_id || null,
        completion_date: form.completion_date || null,
        created_by: user?.id ?? null,
      };
      if (existing?.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      navigate({ to: "/dashboard/projects" });
    },
    onError: (e: any) => setErr(e.message),
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-8 max-w-4xl">
      <Section title="Basics">
        <Field label="Title">
          <input required value={form.title} onChange={(e) => { set("title", e.target.value); if (!existing) set("slug", slugify(e.target.value)); }} className={inp} />
        </Field>
        <Field label="Slug">
          <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={inp} placeholder="auto-generated" />
        </Field>
        <Field label="Short Summary">
          <input value={form.summary} onChange={(e) => set("summary", e.target.value)} className={inp} />
        </Field>
        <Field label="Description">
          <textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inp} resize-none`} />
        </Field>
      </Section>

      <Section title="Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Client Name"><input value={form.client_name} onChange={(e) => set("client_name", e.target.value)} className={inp} /></Field>
          <Field label="Location / City"><input value={form.location} onChange={(e) => set("location", e.target.value)} className={inp} /></Field>
          <Field label="Completion Date"><input type="date" value={form.completion_date} onChange={(e) => set("completion_date", e.target.value)} className={inp} /></Field>
          <Field label="Category">
            <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={inp}>
              <option value="" className="bg-ink">— none —</option>
              {cats.data?.map((c: any) => <option key={c.id} value={c.id} className="bg-ink">{c.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Tags (press Enter)">
          <div className="flex flex-wrap gap-2 items-center border border-bone/15 px-3 py-2">
            {form.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 bg-bone/10 px-2 py-1 text-xs">
                {t}<button type="button" onClick={() => set("tags", form.tags.filter((x) => x !== t))}><X size={10}/></button>
              </span>
            ))}
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { e.preventDefault(); set("tags", [...form.tags, tagInput.trim()]); setTagInput(""); } }}
              className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none" placeholder="tag…" />
          </div>
        </Field>
      </Section>

      <Section title="Media">
        <Field label="Cover Image">
          <MediaUpload bucket="project-images" value={form.cover_image} onChange={(url) => set("cover_image", url)} />
        </Field>
        <Field label="Gallery Images">
          <MediaUpload bucket="project-images" multiple value={form.images} onChange={(urls) => set("images", urls)} />
        </Field>
        <Field label="Videos">
          <MediaUpload bucket="project-videos" multiple accept="video/*" value={form.videos} onChange={(urls) => set("videos", urls)} />
        </Field>
      </Section>

      <Section title="SEO">
        <Field label="SEO Title"><input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={inp} /></Field>
        <Field label="SEO Description"><textarea rows={2} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} className={`${inp} resize-none`} /></Field>
      </Section>

      <Section title="Visibility">
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
        </div>
      </Section>

      {err && <p className="text-sm text-gold">{err}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={save.isPending} className="bg-gold text-ink px-7 py-3 text-xs uppercase tracking-[0.25em] hover:bg-bone disabled:opacity-50">
          {save.isPending ? "Saving…" : existing ? "Update Project" : "Create Project"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/dashboard/projects" })} className="border border-bone/20 px-7 py-3 text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold">Cancel</button>
      </div>
    </form>
  );
}

const inp = "w-full bg-transparent border border-bone/15 px-3 py-2.5 text-sm focus:outline-none focus:border-gold";
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold border-b border-bone/10 pb-2">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">{label}</span>
      {children}
    </label>
  );
}
