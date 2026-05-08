import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Visual } from "@/components/Visual";
import { projects as mockProjects, categories as mockCategories } from "@/data/projects";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Search } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Mad Mistri" },
      { name: "description", content: "Selected works by Mad Mistri — cafés, restaurants, hotels, lounges and commercial interiors across India." },
      { property: "og:title", content: "Projects — Mad Mistri" },
      { property: "og:description", content: "A portfolio of luxury hospitality interiors across India." },
    ],
  }),
  component: ProjectsPage,
});

const VARIANTS = ["walnut", "cafe", "lounge", "hotel", "dining", "ink", "warm"] as const;

function ProjectsPage() {
  const [active, setActive] = useState<string>("All");
  const [q, setQ] = useState("");

  const { data: dbProjects } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id,title,slug,summary,cover_image,location,completion_date,featured,categories(name)")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const items = useMemo(() => {
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p: any, i: number) => ({
        slug: p.slug,
        title: p.title,
        category: p.categories?.name ?? "Project",
        city: p.location ?? "",
        year: p.completion_date ? new Date(p.completion_date).getFullYear().toString() : "",
        cover_image: p.cover_image as string | null,
        variant: VARIANTS[i % VARIANTS.length],
        size: i % 5 === 0 ? "tall" : undefined,
      }));
    }
    return mockProjects.map((p) => ({
      slug: p.slug, title: p.title, category: p.category, city: p.city, year: p.year,
      cover_image: null, variant: p.variant, size: p.size,
    }));
  }, [dbProjects]);

  const allCats = useMemo(() => {
    const set = new Set<string>(["All"]);
    items.forEach((p) => set.add(p.category));
    return Array.from(set).length > 1 ? Array.from(set) : [...mockCategories];
  }, [items]);

  const filtered = items.filter((p) => {
    const matchCat = active === "All" || p.category === active;
    const matchQ = !q || `${p.title} ${p.city} ${p.category}`.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <>
      <section className="relative pt-40 md:pt-52 pb-16 md:pb-24 bg-ink text-bone overflow-hidden">
        <Visual variant="lounge" className="absolute inset-0 opacity-70"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold mb-6">Portfolio</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-4xl">
            Rooms we've made <span className="italic text-gold">linger.</span>
          </h1>
        </div>
      </section>

      <section className="bg-bone text-ink py-12 md:py-16 sticky top-0 z-30">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {allCats.map((c) => (
                <button key={c} onClick={() => setActive(c)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] border transition-all duration-300 ${
                    active === c ? "bg-ink text-bone border-ink" : "border-walnut/25 text-charcoal hover:border-walnut hover:text-walnut"
                  }`}>{c}</button>
              ))}
            </div>
            <div className="relative max-w-sm w-full">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"/>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, cities…"
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-walnut/25 text-sm placeholder:text-charcoal/50 focus:outline-none focus:border-walnut transition-colors"/>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone text-ink pb-24 md:pb-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          {filtered.length === 0 ? (
            <p className="text-center text-charcoal/60 py-24 font-display text-2xl">No projects match. Try another category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
              {filtered.map((p, i) => {
                const span = p.size === "tall" ? "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-[3/5]"
                  : p.size === "wide" ? "md:col-span-4 aspect-[16/9]"
                  : "md:col-span-3 aspect-[5/4]";
                return (
                  <Link key={p.slug + i} to="/projects/$slug" params={{ slug: p.slug }} className={`group relative overflow-hidden ${span}`}>
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"/>
                    ) : (
                      <Visual variant={p.variant as any} className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"/>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent"/>
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-bone">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{p.category}{p.city && ` · ${p.city}`}{p.year && ` · ${p.year}`}</p>
                      <h3 className="font-display text-2xl md:text-3xl">{p.title}</h3>
                      <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-bone/70 group-hover:text-gold transition-colors">
                        Open Project <ArrowUpRight size={14}/>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
