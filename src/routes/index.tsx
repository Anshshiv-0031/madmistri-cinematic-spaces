import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Award, Hammer, MapPin, Sparkles, Truck, Clock, Compass } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Visual } from "@/components/Visual";
import { supabase } from "@/integrations/supabase/client";
import { projects as mockProjects } from "@/data/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mad Mistri — Crafting Luxury Spaces That Linger" },
      { name: "description", content: "Premium commercial furniture and turnkey interiors for cafés, restaurants, hotels and lounges across India." },
      { property: "og:title", content: "Mad Mistri — Luxury Commercial Furniture" },
      { property: "og:description", content: "Premium commercial furniture and turnkey interiors across India." },
    ],
  }),
  component: Home,
});

const stats = [
  { k: "12+", v: "Years of Craft" },
  { k: "180+", v: "Spaces Delivered" },
  { k: "24", v: "Cities Across India" },
  { k: "60+", v: "Hospitality Brands" },
];

const SERVICE_IMAGES: Record<string, string> = {
  "Café Furniture": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
  "Restaurant Furniture": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  "Hotel Furniture": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80",
  "Lounge Seating": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
  "Premium Commercial Interiors": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  "Custom Furniture": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80",
};

const services = [
  { t: "Café Furniture", d: "Bar counters, banquettes and bespoke seating designed for the slow-coffee era." },
  { t: "Restaurant Furniture", d: "Dining systems engineered for daily service without compromising on craft." },
  { t: "Hotel Furniture", d: "Lobby, suite and F&B casegoods built to hospitality-grade tolerances." },
  { t: "Lounge Seating", d: "Modular sofas, low chairs and bar stools tailored to the room's mood." },
  { t: "Premium Commercial Interiors", d: "Turnkey interior solutions — joinery, lighting, finishes and styling." },
  { t: "Custom Furniture", d: "One-of-one pieces conceived with you and built in our Nagpur workshop." },
];

const why = [
  { i: Sparkles, t: "Premium Materials", d: "FSC walnut, full-grain leather, solid brass." },
  { i: Hammer, t: "Custom Craftsmanship", d: "Every joint, every stitch — made by hand." },
  { i: Award, t: "Commercial Expertise", d: "Built for the wear of full-service hospitality." },
  { i: Truck, t: "Pan India Delivery", d: "Logistics & install across 24 cities." },
  { i: Clock, t: "Timely Execution", d: "Predictable timelines, transparent updates." },
  { i: Compass, t: "Modern Design Eye", d: "Editorial, restrained, unmistakably premium." },
];

const processSteps = [
  { n: "01", t: "Consultation", d: "We listen — to the brand, the brief, the room." },
  { n: "02", t: "Design Planning", d: "Mood, materials, drawings and prototypes." },
  { n: "03", t: "Manufacturing", d: "Hand-built in our 18,000 sq ft Nagpur workshop." },
  { n: "04", t: "Delivery & Install", d: "White-glove logistics, site finishing, handover." },
];

const VARIANTS = ["walnut","cafe","lounge","hotel","dining","ink","warm"] as const;

function Home() {
  const { data: dbProjects } = useQuery({
    queryKey: ["home-featured-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("slug,title,cover_image,location,categories(name)")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const { data: dbTestimonials } = useQuery({
    queryKey: ["home-testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const featured = (dbProjects && dbProjects.length > 0)
    ? dbProjects.map((p: any, i: number) => ({
        slug: p.slug, title: p.title, category: p.categories?.name ?? "Project",
        city: p.location ?? "", cover_image: p.cover_image as string | null,
        variant: VARIANTS[i % VARIANTS.length],
      }))
    : mockProjects.slice(0, 6).map((p) => ({
        slug: p.slug, title: p.title, category: p.category, city: p.city,
        cover_image: null as string | null, variant: p.variant,
      }));

  const testimonials = (dbTestimonials && dbTestimonials.length > 0)
    ? dbTestimonials.map((t: any) => ({ q: t.quote, a: t.name, r: [t.role, t.company].filter(Boolean).join(", ") }))
    : [
        { q: "Mad Mistri delivered a dining room that our guests photograph before they sit down. The craft is remarkable.", a: "Aarav Mehta", r: "Founder, Atelier Group" },
        { q: "From the first sketch to install day, the team operated with the precision of a luxury brand.", a: "Ishita Rao", r: "GM, Casa Mira" },
        { q: "We've worked with three furniture houses. None come close to the level of finish and reliability of Mad Mistri.", a: "Rohan Kapoor", r: "Director, Ember Group" },
      ];

  return (
    <>
      {/* HERO — cinematic luxury */}
      <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-ink text-bone">
        {/* Layered crossfading background images with ken-burns */}
        <div className="absolute inset-0">
          {[
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2000&q=85",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=85",
            "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=2000&q=85",
          ].map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden={i > 0}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              style={{
                animation: `hero-img-cycle 18s ease-in-out ${i * 6}s infinite, ken-burns 22s ease-in-out ${i * 2}s infinite alternate`,
                opacity: i === 0 ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* Cinematic vignette + grain */}
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 grain pointer-events-none" />

        {/* Floating ambient gold orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full blur-3xl animate-glow-pulse"
             style={{ background: "radial-gradient(circle, rgba(199,166,106,0.3), transparent 60%)" }} />
        <div aria-hidden className="pointer-events-none absolute bottom-[-12rem] right-[-12rem] w-[38rem] h-[38rem] rounded-full blur-3xl animate-float-soft"
             style={{ background: "radial-gradient(circle, rgba(199,166,106,0.18), transparent 65%)", animationDelay: "1.5s" }} />

        {/* Light sweep */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-25 mix-blend-screen blur-2xl animate-light-sweep"
             style={{ background: "linear-gradient(90deg, transparent, rgba(246,242,236,0.7), transparent)" }} />

        {/* Top hairline */}
        <div aria-hidden className="absolute top-0 left-0 right-0 h-px gold-line opacity-60" />

        {/* Content */}
        <div className="relative z-10 h-full mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col justify-end pb-28 md:pb-36">
          <div className="max-w-5xl">
            <p className="animate-fade-up text-[11px] uppercase tracking-[0.45em] text-gold mb-8 flex items-center gap-3">
              <span className="inline-block w-12 h-px bg-gold" />
              Luxury Commercial Interiors · Est. India
            </p>
            <h1 className="font-display leading-[0.9] text-balance text-shadow-cinema text-[46px] sm:text-6xl md:text-7xl lg:text-[104px]">
              <span className="block animate-fade-up delay-100">Crafting luxury spaces</span>
              <span className="block animate-fade-up delay-300">
                that leave{" "}
                <span className="italic text-gold relative inline-block">
                  lasting impressions.
                  <span aria-hidden className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                </span>
              </span>
            </h1>
            <p className="animate-fade-up delay-500 mt-10 max-w-xl text-bone/85 text-base md:text-lg leading-relaxed text-shadow-cinema">
              From intimate cafés to landmark hotels — Mad Mistri designs and manufactures bespoke commercial furniture and turnkey interiors for India's most considered hospitality brands.
            </p>
            <div className="animate-fade-up delay-700 mt-12 flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="group relative inline-flex items-center gap-3 bg-gold text-ink px-8 py-4 text-xs uppercase tracking-[0.3em] font-medium overflow-hidden transition-all duration-500 hover:gold-glow hover:-translate-y-0.5"
              >
                <span className="relative z-10">View Projects</span>
                <ArrowUpRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
              </Link>
              <Link
                to="/consultation"
                className="group relative inline-flex items-center gap-3 glass-dark text-bone px-8 py-4 text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:border-gold hover:text-gold hover:-translate-y-0.5"
              >
                Book Consultation
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-gold transition-transform duration-500 group-hover:scale-150" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-3 animate-fade-in delay-700">
          <span className="absolute inset-x-[-1px] top-0 h-4 bg-gold animate-scroll-hint mb-0 mt-[40px] my-0"> </span>
          <span className="relative block w-px h-10 bg-bone/20 overflow-hidden">
            <span className="absolute inset-x-[-1px] top-0 h-4 bg-gold animate-scroll-hint" />
          </span>
        </div>

        {/* Bottom feature ribbon */}
        <div className="absolute bottom-0 inset-x-0 z-10 hidden md:block border-t border-bone/10 glass-dark">
          <div className="mx-auto max-w-[1400px] px-10 py-5 grid grid-cols-3 gap-8">
            {[
              { k: "Premium", v: "Furniture" },
              { k: "Bespoke", v: "Interiors" },
              { k: "End-to-End", v: "Turnkey Solutions" },
            ].map((f) => (
              <div key={f.v} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-glow-pulse" />
                <p className="text-[11px] uppercase tracking-[0.3em]">
                  <span className="text-gold">{f.k}</span>
                  <span className="text-bone/60"> — {f.v}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-ink text-bone border-t border-bone/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.v}>
              <p className="font-display text-4xl md:text-6xl text-gold">{s.k}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bone/60">{s.v}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-bone/10 overflow-hidden">
          <div className="flex gap-16 py-8 animate-marquee whitespace-nowrap text-bone/40">
            {[...Array(2)].flatMap((_, i) =>
              ["Atelier Group", "Casa Mira", "Ember", "House of Luna", "Noir Coffee", "Ostara", "Velvet", "North Yard"].map((b) => (
                <span key={`${i}-${b}`} className="font-display text-2xl tracking-wide">{b} <span className="text-gold mx-8">◆</span></span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-bone text-ink py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">Selected Work</p>
              <h2 className="font-display text-4xl md:text-6xl leading-[1] text-balance max-w-2xl">
                Spaces shaped by intention,<br/>
                <span className="italic text-walnut">not trend.</span>
              </h2>
            </div>
            <Link to="/projects" className="link-underline self-start text-xs uppercase tracking-[0.25em]">All Projects →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
            {featured.map((p, i) => {
              const span =
                i === 0 ? "md:col-span-4 md:row-span-2 aspect-[5/6] md:aspect-auto md:min-h-[640px]"
                : i === 1 ? "md:col-span-2 aspect-[4/5]"
                : i === 2 ? "md:col-span-2 aspect-[4/3]"
                : i === 3 ? "md:col-span-3 aspect-[5/4]"
                : i === 4 ? "md:col-span-3 aspect-[5/4]"
                : "md:col-span-6 aspect-[16/7]";
              return (
                <Link key={p.slug} to="/projects/$slug" params={{ slug: p.slug }} className={`group relative overflow-hidden ${span}`}>
                  {p.cover_image ? (
                    <img src={p.cover_image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"/>
                  ) : (
                    <Visual variant={p.variant as any} className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-bone">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">{p.category}{p.city && ` · ${p.city}`}</p>
                    <h3 className="font-display text-2xl md:text-3xl">{p.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-bone/70 group-hover:text-gold transition-colors">
                      View Project <ArrowUpRight size={14}/>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-ink text-bone py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">What We Make</p>
              <h2 className="font-display text-4xl md:text-6xl leading-[1] text-balance">
                Six disciplines.<br/>
                <span className="italic text-gold">One studio.</span>
              </h2>
            </div>
            <p className="md:col-span-6 md:col-start-7 text-bone/60 text-base md:text-lg leading-relaxed self-end">
              Whether you're opening a 14-seat café or a 200-key hotel, we work end-to-end — from the first material moodboard to the final install.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-bone/10">
            {services.map((s, i) => (
              <Link key={s.t} to="/services" className="group relative overflow-hidden bg-ink aspect-[4/5] hover-lift">
                <img src={SERVICE_IMAGES[s.t]} alt={s.t} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
                <div className="relative h-full p-8 md:p-10 flex flex-col justify-end">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-gold/70 mb-4">0{i+1}</p>
                  <h3 className="font-display text-2xl md:text-3xl mb-3 group-hover:text-gold transition-colors">{s.t}</h3>
                  <p className="text-bone/70 leading-relaxed text-sm">{s.d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-bone text-ink py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="max-w-3xl mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">Why Mad Mistri</p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1] text-balance">
              The difference is in the <span className="italic text-walnut">millimetre.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {why.map(({ i: Icon, t, d }) => (
              <div key={t} className="group relative p-8 bg-bone border border-walnut/15 hover-lift hover:border-walnut/40">
                <Icon size={22} className="text-walnut mb-6 transition-transform group-hover:-rotate-6"/>
                <h3 className="font-display text-2xl mb-2">{t}</h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative bg-ink text-bone py-24 md:py-36 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25"/>
        <div className="absolute inset-0 bg-ink/70"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">The Process</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1] mb-16 max-w-2xl">
            Four chapters,<br/>
            <span className="italic text-gold">measured to the day.</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-px bg-bone/10">
            {processSteps.map((s) => (
              <div key={s.n} className="bg-ink p-8 md:p-10 hover:bg-charcoal transition-colors duration-500">
                <p className="font-display text-5xl text-gold/60 mb-8">{s.n}</p>
                <h3 className="font-display text-2xl mb-3">{s.t}</h3>
                <p className="text-sm text-bone/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-bone text-ink py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">Spoken Of</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1] mb-16 max-w-2xl">
            Trusted by India's<br/><span className="italic text-walnut">finest hospitality brands.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure key={t.a} className="relative p-10 bg-ink text-bone hover-lift">
                <span className="absolute top-6 right-8 font-display text-7xl text-gold/30 leading-none">"</span>
                <blockquote className="font-display text-xl md:text-2xl leading-[1.3] text-balance">
                  {t.q}
                </blockquote>
                <figcaption className="mt-8 pt-6 border-t border-bone/10">
                  <p className="font-display text-base">{t.a}</p>
                  {t.r && <p className="text-xs text-bone/60 uppercase tracking-[0.2em] mt-1">{t.r}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative bg-ink text-bone overflow-hidden">
        <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40"/>
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-32 md:py-48 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold mb-8">
            <MapPin size={12} className="inline mr-2"/> Designing across India
          </p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-5xl mx-auto">
            Let's build something<br/><span className="italic text-gold">unforgettable.</span>
          </h2>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/consultation" className="group inline-flex items-center gap-3 bg-gold text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-bone transition-all duration-500">
              Book a Consultation <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-3 border border-bone/40 text-bone px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-all duration-500">
              Speak to Studio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
