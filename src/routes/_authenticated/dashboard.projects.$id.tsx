import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const Route = createFileRoute("/_authenticated/dashboard/projects/$id")({
  component: EditProject,
});

function EditProject() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Edit</p>
        <h1 className="font-display text-4xl mt-2">{data?.title ?? "…"}</h1>
      </header>
      {isLoading ? <p className="text-bone/40">Loading…</p> : <ProjectForm existing={data} />}
    </div>
  );
}
