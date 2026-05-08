import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/leads")({
  component: Leads,
});

const STATUSES = ["new", "contacted", "meeting_scheduled", "closed"] as const;
const STATUS_LABEL: Record<string, string> = { new: "New", contacted: "Contacted", meeting_scheduled: "Meeting Scheduled", closed: "Closed" };

function Leads() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const { data } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => (await supabase.from("leads").select("*, projects(title)").order("created_at", { ascending: false })).data ?? [],
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status: status as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("leads").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const filtered = (data ?? []).filter((l: any) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (q && !`${l.name} ${l.email} ${l.phone} ${l.message}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">CRM</p>
        <h1 className="font-display text-4xl mt-2">Leads</h1>
      </header>

      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="bg-transparent border border-bone/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-transparent border border-bone/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold">
          <option value="all" className="bg-ink">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s} className="bg-ink">{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      <div className="border border-bone/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-bone/5 text-[10px] uppercase tracking-[0.2em] text-bone/50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Business</th>
              <th className="text-left p-4">Message</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-bone/40">No leads.</td></tr>}
            {filtered.map((l: any) => (
              <tr key={l.id} className="border-t border-bone/5 align-top">
                <td className="p-4">{l.name}</td>
                <td className="p-4 text-bone/70">
                  {l.email && <div>{l.email}</div>}
                  {l.phone && <div className="text-xs">{l.phone}</div>}
                </td>
                <td className="p-4 text-bone/70">{l.business_type ?? "—"}</td>
                <td className="p-4 text-bone/70 max-w-xs truncate" title={l.message}>{l.message ?? "—"}</td>
                <td className="p-4">
                  <select value={l.status} onChange={(e) => update.mutate({ id: l.id, status: e.target.value })} className="bg-transparent border border-bone/15 px-2 py-1 text-xs">
                    {STATUSES.map(s => <option key={s} value={s} className="bg-ink">{STATUS_LABEL[s]}</option>)}
                  </select>
                </td>
                <td className="p-4 text-xs text-bone/50">{new Date(l.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { if (confirm("Delete lead?")) del.mutate(l.id); }} className="p-2 hover:text-gold"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
