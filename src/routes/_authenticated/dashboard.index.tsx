import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FolderKanban, Inbox, Eye, FileText, MessageSquareQuote, Tags, Star, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Overview,
});

const SERVICES_COUNT = 6; // Café, Restaurant, Hotel, Lounge, Commercial Interiors, Custom

function Overview() {
  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [projects, leads, blogs, testimonials, categories, featured, recentLeads, topProjects] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("featured", true),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("projects").select("id,title,slug,view_count").order("view_count", { ascending: false }).limit(5),
      ]);
      return {
        projects: projects.count ?? 0,
        leads: leads.count ?? 0,
        blogs: blogs.count ?? 0,
        testimonials: testimonials.count ?? 0,
        categories: categories.count ?? 0,
        featured: featured.count ?? 0,
        recentLeads: recentLeads.data ?? [],
        topProjects: topProjects.data ?? [],
      };
    },
  });

  const cards = [
    { label: "Projects", value: stats.data?.projects ?? "–", icon: FolderKanban },
    { label: "Featured", value: stats.data?.featured ?? "–", icon: Star },
    { label: "Categories", value: stats.data?.categories ?? "–", icon: Tags },
    { label: "Services", value: SERVICES_COUNT, icon: Sparkles },
    { label: "Blogs", value: stats.data?.blogs ?? "–", icon: FileText },
    { label: "Testimonials", value: stats.data?.testimonials ?? "–", icon: MessageSquareQuote },
    { label: "Total Leads", value: stats.data?.leads ?? "–", icon: Inbox },
    { label: "Top Views", value: stats.data?.topProjects[0]?.view_count ?? 0, icon: Eye },
  ];

  return (
    <div className="space-y-10 max-w-7xl">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Dashboard</p>
        <h1 className="font-display text-4xl mt-2">Overview</h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="border border-bone/10 p-6 bg-bone/[0.02]">
              <Icon size={18} className="text-gold mb-4" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-bone/50">{c.label}</p>
              <p className="font-display text-3xl mt-2">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="border border-bone/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Recent Inquiries</h2>
            <Link to="/dashboard/leads" className="text-[10px] uppercase tracking-[0.25em] text-gold">View all →</Link>
          </div>
          <div className="space-y-3">
            {stats.data?.recentLeads.length === 0 && <p className="text-bone/40 text-sm">No leads yet.</p>}
            {stats.data?.recentLeads.map((l: any) => (
              <div key={l.id} className="flex justify-between border-b border-bone/5 pb-2">
                <div>
                  <p className="text-sm">{l.name}</p>
                  <p className="text-xs text-bone/40">{l.email || l.phone}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{l.status}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="border border-bone/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">Most Viewed Projects</h2>
            <Link to="/dashboard/projects" className="text-[10px] uppercase tracking-[0.25em] text-gold">Manage →</Link>
          </div>
          <div className="space-y-3">
            {stats.data?.topProjects.length === 0 && <p className="text-bone/40 text-sm">No projects yet.</p>}
            {stats.data?.topProjects.map((p: any) => (
              <div key={p.id} className="flex justify-between border-b border-bone/5 pb-2">
                <p className="text-sm">{p.title}</p>
                <span className="text-xs text-bone/50">{p.view_count} views</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
