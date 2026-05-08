import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/categories")({
  component: Categories,
});

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

function Categories() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("name")).data ?? [],
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("categories").insert({ name, slug: slugify(name), description: desc || null });
      if (error) throw error;
    },
    onSuccess: () => { setName(""); setDesc(""); qc.invalidateQueries({ queryKey: ["categories"] }); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("categories").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Taxonomy</p>
        <h1 className="font-display text-4xl mt-2">Categories</h1>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); if (name) add.mutate(); }} className="border border-bone/10 p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="bg-transparent border border-bone/15 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" className="bg-transparent border border-bone/15 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
        <button className="bg-gold text-ink px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:bg-bone">Add Category</button>
      </form>

      <div className="border border-bone/10">
        {(data ?? []).length === 0 && <p className="p-6 text-bone/40 text-sm">No categories yet.</p>}
        {(data ?? []).map((c: any) => (
          <div key={c.id} className="flex items-center justify-between p-4 border-b border-bone/5 last:border-0">
            <div>
              <p className="text-sm">{c.name}</p>
              <p className="text-xs text-bone/40">/{c.slug}</p>
            </div>
            <button onClick={() => { if (confirm(`Delete "${c.name}"?`)) del.mutate(c.id); }} className="p-2 hover:text-gold"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
