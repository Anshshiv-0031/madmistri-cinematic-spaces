import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/projects")({
  component: ProjectsList,
});

function ProjectsList() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*, categories(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const filtered = (data ?? []).filter((p: any) => !q || p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-8 max-w-7xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Content</p>
          <h1 className="font-display text-4xl mt-2">Projects</h1>
        </div>
        <Link to="/dashboard/projects/new" className="inline-flex items-center gap-2 bg-gold text-ink px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-bone">
          <Plus size={14} /> New Project
        </Link>
      </header>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="w-full max-w-sm bg-transparent border border-bone/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold" />

      <div className="border border-bone/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bone/5 text-[10px] uppercase tracking-[0.2em] text-bone/50">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-8 text-center text-bone/40">Loading…</td></tr>}
            {!isLoading && filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-bone/40">No projects yet. Create your first one.</td></tr>}
            {filtered.map((p: any) => (
              <tr key={p.id} className="border-t border-bone/5">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {p.featured && <Star size={12} className="text-gold fill-gold" />}
                    <span>{p.title}</span>
                  </div>
                  <p className="text-xs text-bone/40 mt-0.5">/{p.slug}</p>
                </td>
                <td className="p-4 text-bone/70">{p.categories?.name ?? "—"}</td>
                <td className="p-4 text-bone/70">{p.location ?? "—"}</td>
                <td className="p-4"><span className={`text-[10px] uppercase tracking-[0.2em] ${p.published ? "text-gold" : "text-bone/40"}`}>{p.published ? "Live" : "Draft"}</span></td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-1">
                    <Link to="/dashboard/projects/$id" params={{ id: p.id }} className="p-2 hover:text-gold" aria-label="Edit"><Pencil size={14} /></Link>
                    <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) del.mutate(p.id); }} className="p-2 hover:text-gold" aria-label="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
