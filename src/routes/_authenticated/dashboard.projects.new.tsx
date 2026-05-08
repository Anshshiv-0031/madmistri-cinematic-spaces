import { createFileRoute } from "@tanstack/react-router";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const Route = createFileRoute("/_authenticated/dashboard/projects/new")({
  component: () => (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">New</p>
        <h1 className="font-display text-4xl mt-2">Create Project</h1>
      </header>
      <ProjectForm />
    </div>
  ),
});
