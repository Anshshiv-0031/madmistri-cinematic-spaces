import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { Trash2, Copy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/media")({
  component: MediaLibrary,
});

function MediaLibrary() {
  const qc = useQueryClient();
  const [bucket, setBucket] = useState("general-uploads");
  const [pending, setPending] = useState<string[]>([]);

  const { data } = useQuery({
    queryKey: ["media"],
    queryFn: async () => (await supabase.from("media").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [],
  });

  const del = useMutation({
    mutationFn: async (m: any) => {
      await supabase.storage.from(m.bucket).remove([m.path]);
      await supabase.from("media").delete().eq("id", m.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });

  return (
    <div className="space-y-8 max-w-7xl">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Library</p>
        <h1 className="font-display text-4xl mt-2">Media</h1>
      </header>

      <div className="border border-bone/10 p-6 space-y-4">
        <div className="flex gap-3 items-center flex-wrap">
          <label className="text-[10px] uppercase tracking-[0.3em] text-bone/50">Bucket</label>
          <select value={bucket} onChange={(e) => setBucket(e.target.value)} className="bg-transparent border border-bone/15 px-3 py-2 text-sm">
            {["general-uploads", "project-images", "project-videos", "blog-media"].map(b => <option key={b} value={b} className="bg-ink">{b}</option>)}
          </select>
        </div>
        <MediaUpload bucket={bucket} multiple value={pending} onChange={(urls) => { setPending(urls); qc.invalidateQueries({ queryKey: ["media"] }); }} accept={bucket === "project-videos" ? "video/*" : "image/*,video/*"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {(data ?? []).map((m: any) => (
          <div key={m.id} className="group relative aspect-square bg-bone/5 overflow-hidden">
            {m.mime_type?.startsWith("video") ? (
              <video src={m.url} className="w-full h-full object-cover" />
            ) : (
              <img src={m.url} alt={m.alt_text ?? ""} loading="lazy" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(m.url)} className="p-2 bg-bone/10 hover:bg-gold hover:text-ink" title="Copy URL"><Copy size={14} /></button>
              <button onClick={() => { if (confirm("Delete file?")) del.mutate(m); }} className="p-2 bg-bone/10 hover:bg-gold hover:text-ink"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
