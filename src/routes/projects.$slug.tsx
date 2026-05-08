import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Visual } from "@/components/Visual";
import { projects as mockProjects } from "@/data/projects";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    // Try DB first
    const { data } = await supabase
      .from("projects")
      .select("*, categories(name)")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();

    if (data) {
      return {
        project: {
          id: data.id,
          slug: data.slug,
          title: data.title,
          category: data.categories?.name ?? "Project",
          client: data.client_name ?? "",
          city: data.location ?? "",
          year: data.completion_date ? new Date(data.completion_date).getFullYear().toString() : "",
          scope: (data.tags ?? []) as string[],
          overview: data.description || data.summary || "",
          challenge: "",
          solution: "",
          variant: "walnut" as const,
          cover_image: data.cover_image as string | null,
          images: (data.images ?? []) as string[],
        },
        fromDb: true,
      };
    }
    const mock = mockProjects.find((p) => p.slug === params.slug);
    if (!mock) throw notFound();
    return { project: { ...mock, id: null as string | null, cover_image: null, images: [] as string[] }, fromDb: false };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    return {
      meta: p ? [
        { title: `${p.title} — Mad Mistri` },
        { name: "description", content: p.overview },
        { property: "og:title", content: `${p.title} — Mad Mistri` },
        { property: "og:description", content: p.overview },
        ...(p.cover_image ? [{ property: "og:image", content: p.cover_image }] : []),
      ] : [],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-ink text-bone">
      <div className="text-center">
        <h1 className="font-display text-4xl">Project not found</h1>
        <Link to="/projects" className="inline-block mt-6 text-gold link-underline text-xs uppercase tracking-[0.25em]">All Projects</Link>
      </div>
    </div>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { project, fromDb } = Route.useLoaderData();

  // increment view count (best-effort)
  useEffect(() => {
    if (fromDb && project.id) {
      supabase.rpc("noop").then(() => {}).catch(() => {});
      supabase.from("projects").select("view_count").eq("id", project.id).single().then(({ data }) => {
        if (data) supabase.from("projects").update({ view_count: (data.view_count ?? 0) + 1 }).eq("id", project.id!);
      });
    }
  }, [fromDb, project.id]);

  const { data: related } = useQuery({
    queryKey: ["related", project.slug, project.category],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("slug,title,location,cover_image,categories(name)")
        .neq("slug", project.slug)
        .eq("published", true)
        .limit(3);
      return data ?? [];
    },
  });

  const recommendations = (related && related.length > 0)
    ? related.map((p: any, i: number) => ({
        slug: p.slug, title: p.title, city: p.location ?? "",
        category: p.categories?.name ?? "Project",
        cover_image: p.cover_image, variant: ["walnut","cafe","lounge","dining"][i % 4] as any,
      }))
    : mockProjects.filter((p) => p.slug !== project.slug).slice(0, 3).map((p) => ({
        slug: p.slug, title: p.title, city: p.city, category: p.category, cover_image: null, variant: p.variant,
      }));

  const heroImg = project.cover_image || project.images[0];

  return (
    <>
      <section className="relative h-[100svh] min-h-[640px] bg-ink text-bone overflow-hidden">
        {heroImg ? (
          <img src={heroImg} alt={project.title} className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"/>
        ) : (
          <Visual variant={project.variant as any} className="absolute inset-0 animate-slow-zoom"/>
        )}
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative z-10 h-full mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col justify-end pb-20">
          <Link to="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-bone/60 hover:text-gold mb-8">
            <ArrowLeft size={14}/> All Projects
          </Link>
          <p className="animate-fade-up text-[11px] uppercase tracking-[0.4em] text-gold mb-5">{project.category}{project.city && ` · ${project.city}`}</p>
          <h1 className="animate-fade-up delay-100 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-5xl">{project.title}</h1>
        </div>
      </section>

      <section className="bg-bone text-ink border-t border-walnut/15">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { l: "Client", v: project.client || "—" },
            { l: "Location", v: project.city || "—" },
            { l: "Completed", v: project.year || "—" },
            { l: "Category", v: project.category },
          ].map((m) => (
            <div key={m.l}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-walnut mb-2">{m.l}</p>
              <p className="font-display text-xl md:text-2xl">{m.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">Overview</p>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-balance">{project.title}<span className="italic text-walnut">.</span></h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-6 text-charcoal/80 text-base md:text-lg leading-[1.7]">
            <p>{project.overview}</p>
            {project.scope.length > 0 && (
              <div className="pt-6 border-t border-walnut/15">
                <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-3">Scope of Work</p>
                <ul className="flex flex-wrap gap-2">
                  {project.scope.map((s: string) => (
                    <li key={s} className="px-3 py-1.5 border border-walnut/25 text-xs uppercase tracking-[0.18em]">{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {project.images.length > 0 && (
        <section className="bg-bone py-12 md:py-20">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
            {project.images.map((url: string, i: number) => (
              <img key={url} src={url} alt={`${project.title} ${i+1}`} loading="lazy"
                className={`w-full h-full object-cover ${i === 0 ? "md:col-span-6 aspect-[16/9]" : i % 3 === 0 ? "md:col-span-2 aspect-[4/5]" : "md:col-span-4 aspect-[16/10]"}`}/>
            ))}
          </div>
        </section>
      )}

      {(("challenge" in project && project.challenge) || ("solution" in project && project.solution)) && (
        <section className="bg-ink text-bone py-24 md:py-36">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-2 gap-px bg-bone/10">
            <div className="bg-ink p-10 md:p-14">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-6">The Challenge</p>
              <p className="font-display text-2xl md:text-3xl leading-[1.25] text-balance">{(project as any).challenge}</p>
            </div>
            <div className="bg-ink p-10 md:p-14">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-6">Our Solution</p>
              <p className="font-display text-2xl md:text-3xl leading-[1.25] text-balance">{(project as any).solution}</p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-balance">More like <span className="italic text-walnut">this.</span></h2>
            <Link to="/projects" className="link-underline text-xs uppercase tracking-[0.25em]">All Projects →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.map((p) => (
              <Link key={p.slug} to="/projects/$slug" params={{ slug: p.slug }} className="group relative overflow-hidden aspect-[4/5]">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"/>
                ) : (
                  <Visual variant={p.variant as any} className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-[1.06]"/>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"/>
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-bone">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{p.category}{p.city && ` · ${p.city}`}</p>
                  <h3 className="font-display text-2xl">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-ink text-bone overflow-hidden">
        <Visual variant="walnut" className="absolute inset-0 opacity-60"/>
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-36 text-center">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1] text-balance max-w-4xl mx-auto">
            Inspired? Let's design <span className="italic text-gold">your space.</span>
          </h2>
          <Link to="/consultation" className="group inline-flex items-center gap-3 mt-10 bg-gold text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-bone transition-all duration-500">
            Begin a Project <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
          </Link>
        </div>
      </section>
    </>
  );
}
