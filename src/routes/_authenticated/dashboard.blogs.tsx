import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Trash2, Pencil, Plus, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/blogs")({
  component: Blogs,
});

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
const inp = "w-full bg-transparent border border-bone/15 px-3 py-2.5 text-sm focus:outline-none focus:border-gold";

function Blogs() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [editing, setEditing] = useState<any | null>(null);

  const { data } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await supabase.from("blogs").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("blogs").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Editorial</p>
          <h1 className="font-display text-4xl mt-2">Blogs</h1>
        </div>
        <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 bg-gold text-ink px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-bone">
          <Plus size={14} /> New Post
        </button>
      </header>

      <div className="border border-bone/10">
        {(data ?? []).length === 0 && <p className="p-8 text-center text-bone/40">No posts yet.</p>}
        {(data ?? []).map((b: any) => (
          <div key={b.id} className="flex items-center justify-between p-4 border-b border-bone/5 last:border-0">
            <div>
              <p className="text-sm">{b.title}</p>
              <p className="text-xs text-bone/40">/{b.slug} · {b.published ? "Live" : "Draft"}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditing(b)} className="p-2 hover:text-gold"><Pencil size={14} /></button>
              <button onClick={() => { if (confirm(`Delete "${b.title}"?`)) del.mutate(b.id); }} className="p-2 hover:text-gold"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && <BlogModal existing={editing.id ? editing : null} onClose={() => { setEditing(null); qc.invalidateQueries({ queryKey: ["blogs"] }); }} userId={user?.id} />}
    </div>
  );
}

function BlogModal({ existing, onClose, userId }: { existing: any; onClose: () => void; userId?: string }) {
  const [form, setForm] = useState({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    excerpt: existing?.excerpt ?? "",
    content: existing?.content ?? "",
    featured_image: existing?.featured_image ?? "",
    published: existing?.published ?? false,
    seo_title: existing?.seo_title ?? "",
    seo_description: existing?.seo_description ?? "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload: any = { ...form, slug: form.slug || slugify(form.title), author_id: userId, published_at: form.published ? new Date().toISOString() : null };
    const { error } = existing
      ? await supabase.from("blogs").update(payload).eq("id", existing.id)
      : await supabase.from("blogs").insert(payload);
    setBusy(false);
    if (error) return alert(error.message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/90 backdrop-blur-sm z-50 grid place-items-center p-4 overflow-auto">
      <div className="bg-ink border border-bone/15 max-w-3xl w-full p-8 my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">{existing ? "Edit Post" : "New Post"}</h2>
          <button onClick={onClose} className="p-2 hover:text-gold"><X size={18} /></button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => { set("title", e.target.value); if (!existing) set("slug", slugify(e.target.value)); }} className={inp} />
          <input placeholder="slug" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={inp} />
          <input placeholder="Excerpt" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inp} />
          <MediaUpload bucket="blog-media" value={form.featured_image} onChange={(url) => set("featured_image", url)} />
          <textarea rows={12} required placeholder="Content (markdown or HTML)" value={form.content} onChange={(e) => set("content", e.target.value)} className={`${inp} resize-y font-mono text-xs`} />
          <input placeholder="SEO Title" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={inp} />
          <textarea rows={2} placeholder="SEO Description" value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} className={`${inp} resize-none`} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Publish now</label>
          <div className="flex gap-3 pt-2">
            <button disabled={busy} className="bg-gold text-ink px-7 py-3 text-xs uppercase tracking-[0.25em] hover:bg-bone disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
            <button type="button" onClick={onClose} className="border border-bone/20 px-7 py-3 text-xs uppercase tracking-[0.25em] hover:border-gold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
