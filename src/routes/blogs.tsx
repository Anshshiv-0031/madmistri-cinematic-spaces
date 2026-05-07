import { createFileRoute, Link } from "@tanstack/react-router";
import { Visual } from "@/components/Visual";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Journal — Mad Mistri" },
      { name: "description", content: "Notes on craft, materials and modern hospitality design from the Mad Mistri studio." },
      { property: "og:title", content: "Journal — Mad Mistri" },
      { property: "og:description", content: "Field notes on craft and commercial interiors." },
    ],
  }),
  component: BlogsPage,
});

const posts = [
  { t: "The case for solid walnut in commercial spaces", c: "Materials", date: "March 2025", read: "6 min", v: "walnut" as const },
  { t: "Designing acoustics into the dining room", c: "Design Notes", date: "February 2025", read: "8 min", v: "dining" as const },
  { t: "Why your bar stool is your hardest-working chair", c: "Furniture", date: "January 2025", read: "5 min", v: "lounge" as const },
  { t: "Lighting moods for the all-day café", c: "Design Notes", date: "December 2024", read: "7 min", v: "cafe" as const },
  { t: "Coastal hotels: surviving salt air with grace", c: "Hospitality", date: "November 2024", read: "9 min", v: "hotel" as const },
];

function BlogsPage() {
  return (
    <>
      <section className="relative pt-40 md:pt-52 pb-20 md:pb-28 bg-ink text-bone overflow-hidden">
        <Visual variant="ink" className="absolute inset-0 opacity-70"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold mb-6">Journal</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-4xl">
            Notes from the <span className="italic text-gold">workshop floor.</span>
          </h1>
        </div>
      </section>

      <section className="bg-bone text-ink py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Link to="/blogs" className="group block relative overflow-hidden mb-10 aspect-[16/9] md:aspect-[16/7]">
            <Visual variant={posts[0].v} className="absolute inset-0 transition-transform duration-[1400ms] group-hover:scale-[1.04]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"/>
            <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end text-bone">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">Featured · {posts[0].c}</p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl max-w-3xl text-balance">{posts[0].t}</h2>
              <p className="mt-4 text-bone/60 text-xs uppercase tracking-[0.2em]">{posts[0].date} · {posts[0].read} read</p>
            </div>
          </Link>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
            {posts.slice(1).map((p) => (
              <Link key={p.t} to="/blogs" className="group block">
                <div className="relative overflow-hidden aspect-[16/10] mb-5">
                  <Visual variant={p.v} className="absolute inset-0 transition-transform duration-[1400ms] group-hover:scale-[1.06]"/>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-walnut mb-2">{p.c} · {p.date}</p>
                <h3 className="font-display text-2xl md:text-3xl group-hover:text-walnut transition-colors text-balance">{p.t}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-charcoal/60 group-hover:text-walnut">
                  Read · {p.read} <ArrowUpRight size={12}/>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
