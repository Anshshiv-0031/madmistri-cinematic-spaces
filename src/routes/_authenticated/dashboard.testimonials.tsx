import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Trash2, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/testimonials")({
  component: Testimonials,
});

function Testimonials() {
  const qc = useQueryClient();
  const empty = { name: "", role: "", company: "", quote: "", rating: 5, featured: false, published: true };
  const [form, setForm] = useState(empty);

  const { data } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const add = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("testimonials").insert(form); if (error) throw error; },
    onSuccess: () => { setForm(empty); qc.invalidateQueries({ queryKey: ["testimonials"] }); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("testimonials").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });

  const inp = "w-full bg-transparent border border-bone/15 px-3 py-2.5 text-sm focus:outline-none focus:border-gold";
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Voices</p>
        <h1 className="font-display text-4xl mt-2">Testimonials</h1>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="border border-bone/10 p-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} />
          <input placeholder="Role" value={form.role} onChange={(e) => set("role", e.target.value)} className={inp} />
          <input placeholder="Company" value={form.company} onChange={(e) => set("company", e.target.value)} className={inp} />
        </div>
        <textarea required rows={3} placeholder="Quote" value={form.quote} onChange={(e) => set("quote", e.target.value)} className={`${inp} resize-none`} />
        <div className="flex items-center gap-6 flex-wrap">
          <label className="text-sm flex items-center gap-2">Rating
            <select value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} className="bg-transparent border border-bone/15 px-2 py-1">
              {[5,4,3,2,1].map(n => <option key={n} value={n} className="bg-ink">{n}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published</label>
        </div>
        <button className="bg-gold text-ink px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-bone">Add Testimonial</button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {(data ?? []).map((t: any) => (
          <div key={t.id} className="border border-bone/10 p-5 relative">
            <button onClick={() => { if (confirm("Delete?")) del.mutate(t.id); }} className="absolute top-3 right-3 p-1 hover:text-gold"><Trash2 size={14} /></button>
            <div className="flex items-center gap-1 text-gold mb-3">
              {Array.from({ length: t.rating ?? 5 }).map((_, i) => <Star key={i} size={12} className="fill-gold" />)}
            </div>
            <p className="text-sm italic text-bone/80 mb-4">"{t.quote}"</p>
            <p className="text-sm">{t.name}{t.role && ` · ${t.role}`}</p>
            {t.company && <p className="text-xs text-bone/40">{t.company}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
