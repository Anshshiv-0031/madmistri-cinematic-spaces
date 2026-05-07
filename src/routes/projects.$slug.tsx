import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Visual } from "@/components/Visual";
import { projects } from "@/data/projects";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    return {
      meta: p ? [
        { title: `${p.title} — Mad Mistri` },
        { name: "description", content: p.overview },
        { property: "og:title", content: `${p.title} — Mad Mistri` },
        { property: "og:description", content: p.overview },
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
  const { project } = Route.useLoaderData();
  const related = projects.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 3);
  const fallback = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const recommendations = related.length ? related : fallback;

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] bg-ink text-bone overflow-hidden">
        <Visual variant={project.variant} className="absolute inset-0 animate-slow-zoom"/>
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative z-10 h-full mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col justify-end pb-20">
          <Link to="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-bone/60 hover:text-gold mb-8">
            <ArrowLeft size={14}/> All Projects
          </Link>
          <p className="animate-fade-up text-[11px] uppercase tracking-[0.4em] text-gold mb-5">{project.category} · {project.city}</p>
          <h1 className="animate-fade-up delay-100 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-5xl">{project.title}</h1>
        </div>
      </section>

      {/* META */}
      <section className="bg-bone text-ink border-t border-walnut/15">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { l: "Client", v: project.client },
            { l: "Location", v: project.city },
            { l: "Completed", v: project.year },
            { l: "Category", v: project.category },
          ].map((m) => (
            <div key={m.l}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-walnut mb-2">{m.l}</p>
              <p className="font-display text-xl md:text-2xl">{m.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">Overview</p>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-balance">{project.overview.split(" ").slice(0, 6).join(" ")}<span className="italic text-walnut">.</span></h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-6 text-charcoal/80 text-base md:text-lg leading-[1.7]">
            <p>{project.overview}</p>
            <div className="pt-6 border-t border-walnut/15">
              <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-3">Scope of Work</p>
              <ul className="flex flex-wrap gap-2">
                {project.scope.map((s: string) => (
                  <li key={s} className="px-3 py-1.5 border border-walnut/25 text-xs uppercase tracking-[0.18em]">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-bone py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
          <Visual variant={project.variant} className="md:col-span-6 aspect-[16/9]"/>
          <Visual variant="walnut" className="md:col-span-2 aspect-[4/5]"/>
          <Visual variant="cafe" className="md:col-span-4 aspect-[16/10]"/>
          <Visual variant="dining" className="md:col-span-3 aspect-[4/3]"/>
          <Visual variant="lounge" className="md:col-span-3 aspect-[4/3]"/>
        </div>
      </section>

      {/* CHALLENGE & SOLUTION */}
      <section className="bg-ink text-bone py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-2 gap-px bg-bone/10">
          <div className="bg-ink p-10 md:p-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-6">The Challenge</p>
            <p className="font-display text-2xl md:text-3xl leading-[1.25] text-balance">{project.challenge}</p>
          </div>
          <div className="bg-ink p-10 md:p-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-6">Our Solution</p>
            <p className="font-display text-2xl md:text-3xl leading-[1.25] text-balance">{project.solution}</p>
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section className="bg-bone text-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-balance">More like <span className="italic text-walnut">this.</span></h2>
            <Link to="/projects" className="link-underline text-xs uppercase tracking-[0.25em]">All Projects →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.map((p) => (
              <Link key={p.slug} to="/projects/$slug" params={{ slug: p.slug }} className="group relative overflow-hidden aspect-[4/5]">
                <Visual variant={p.variant} className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-[1.06]"/>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"/>
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-bone">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{p.category} · {p.city}</p>
                  <h3 className="font-display text-2xl">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
