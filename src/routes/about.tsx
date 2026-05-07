import { createFileRoute, Link } from "@tanstack/react-router";
import { Visual } from "@/components/Visual";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mad Mistri" },
      { name: "description", content: "Mad Mistri is a Nagpur-based studio crafting premium commercial furniture and interiors for India's hospitality leaders." },
      { property: "og:title", content: "About Mad Mistri" },
      { property: "og:description", content: "A Nagpur studio crafting premium commercial furniture for India." },
    ],
  }),
  component: AboutPage,
});

const principles = [
  { t: "Honesty of material", d: "Solid wood, real metal, genuine leather. Nothing is veneered to deceive." },
  { t: "Restraint as luxury", d: "We subtract until the room can breathe — and the craft can speak." },
  { t: "Built for the trade", d: "Every joint, every finish is engineered for the life of a working hospitality space." },
  { t: "One studio, one signature", d: "Design and manufacturing live under one roof — so the vision survives the build." },
];

function AboutPage() {
  return (
    <>
      <section className="relative h-[80svh] min-h-[560px] bg-ink text-bone overflow-hidden">
        <Visual variant="walnut" className="absolute inset-0 animate-slow-zoom"/>
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative z-10 h-full mx-auto max-w-[1400px] px-6 md:px-10 flex items-end pb-20">
          <div className="max-w-4xl">
            <p className="animate-fade-up text-[11px] uppercase tracking-[0.4em] text-gold mb-6">Studio · Nagpur, India</p>
            <h1 className="animate-fade-up delay-100 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
              A studio devoted to<br/><span className="italic text-gold">slow craft, fast delivery.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-bone text-ink py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-balance">Twelve years. One obsession — <span className="italic text-walnut">the room.</span></h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-6 text-charcoal/80 text-base md:text-lg leading-[1.7]">
            <p>Mad Mistri began in 2012 inside an 800 sq ft workshop in Nagpur — a single bench, a circular saw, and a stubborn belief that India's hospitality interiors deserved better than catalogue furniture.</p>
            <p>Today, we operate an 18,000 sq ft facility, ship to twenty-four cities, and partner with hospitality groups who understand that the chair is not an accessory — it is the welcome.</p>
            <p>We remain a studio first, a manufacturer second. Our designers sit beside our craftsmen. Our craftsmen sit beside the client.</p>
          </div>
        </div>
      </section>

      <section className="bg-ink text-bone py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="max-w-3xl mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Principles</p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1] text-balance">Four ideas we never <span className="italic text-gold">compromise.</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-bone/10">
            {principles.map((p, i) => (
              <div key={p.t} className="bg-ink p-10 md:p-14">
                <p className="font-display text-5xl text-gold/40 mb-8">0{i+1}</p>
                <h3 className="font-display text-2xl md:text-3xl mb-4">{p.t}</h3>
                <p className="text-bone/60 leading-relaxed max-w-md">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-bone text-ink py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-2 gap-10">
          <Visual variant="cafe" className="aspect-[4/5] md:aspect-auto md:min-h-[520px]"/>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">The Workshop</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mb-6 text-balance">Where the work <span className="italic text-walnut">actually happens.</span></h2>
            <p className="text-charcoal/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Eighty-four craftsmen. CNC alongside the carving bench. Dust extraction, climate-controlled finishing, and a quality desk that signs off on every leg, every drawer, every weld.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.25em] link-underline">
              Visit the studio <ArrowUpRight size={14}/>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
