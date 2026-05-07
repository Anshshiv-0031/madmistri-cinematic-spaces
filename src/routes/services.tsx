import { createFileRoute, Link } from "@tanstack/react-router";
import { Visual } from "@/components/Visual";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Mad Mistri" },
      { name: "description", content: "Café, restaurant, hotel, lounge furniture and turnkey commercial interiors — designed and built by Mad Mistri." },
      { property: "og:title", content: "Services — Mad Mistri" },
      { property: "og:description", content: "Furniture and turnkey interiors for India's hospitality industry." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { t: "Café Furniture", d: "Bar counters, banquettes, communal tables and bespoke seating designed for the slow-coffee era. Built to handle a hundred cups a day and still photograph beautifully on day 1,000.", variant: "cafe" as const, items: ["Counters & Back-bars", "Banquettes & Booths", "Communal Tables", "Bar Stools"] },
  { t: "Restaurant Furniture", d: "Dining systems engineered for the choreography of full service — durable joinery, replaceable upholstery, predictable spacing.", variant: "dining" as const, items: ["Dining Chairs", "Tables & Tops", "Private Booths", "Service Stations"] },
  { t: "Hotel Furniture", d: "Lobby, suite and F&B casegoods built to hospitality-grade tolerances. Marine-finished where the climate demands it. PVD-coated metals for coastal properties.", variant: "hotel" as const, items: ["Lobby Seating", "Suite Casegoods", "Wardrobes & Vanities", "Outdoor Lounges"] },
  { t: "Lounge Seating", d: "Modular sofas, low chairs and bar stools that sculpt the mood of the room — velvet, bouclé, full-grain leather.", variant: "lounge" as const, items: ["Modular Sofas", "Lounge Chairs", "Cocktail Tables", "Bar Stools"] },
  { t: "Premium Commercial Interiors", d: "Turnkey interior solutions — joinery, lighting, finishes and styling. One contract, one accountable studio.", variant: "ink" as const, items: ["Joinery & Cabinetry", "Lighting Curation", "Wall & Ceiling Finishes", "Styling & Handover"] },
  { t: "Custom Furniture", d: "One-of-one pieces conceived with you and built in our Nagpur workshop. From hero chairs to chef's tables, every prototype is offered for sit-test before production.", variant: "walnut" as const, items: ["Hero Chairs", "Chef's Tables", "Statement Lighting", "Sculptural Joinery"] },
];

function ServicesPage() {
  return (
    <>
      <section className="relative pt-40 md:pt-52 pb-20 md:pb-28 bg-ink text-bone overflow-hidden">
        <Visual variant="ink" className="absolute inset-0 opacity-70"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="animate-fade-up text-[11px] uppercase tracking-[0.4em] text-gold mb-6">Services</p>
          <h1 className="animate-fade-up delay-100 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-5xl">
            From the first sketch to the <span className="italic text-gold">final install.</span>
          </h1>
          <p className="animate-fade-up delay-300 mt-8 max-w-2xl text-bone/60 text-base md:text-lg leading-relaxed">
            We design, manufacture and install — so the vision you sign off in the studio is the room you open to guests.
          </p>
        </div>
      </section>

      <section className="bg-bone text-ink">
        {services.map((s, i) => (
          <article key={s.t} className={`relative border-t border-walnut/15 py-20 md:py-32`}>
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
              <div className={`md:col-span-6 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <Visual variant={s.variant} className="aspect-[4/5] md:aspect-[5/6]"/>
              </div>
              <div className="md:col-span-6">
                <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">0{i+1} · Service</p>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1] text-balance">{s.t}</h2>
                <p className="mt-6 text-charcoal/80 text-base md:text-lg leading-relaxed max-w-lg">{s.d}</p>
                <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-sm">
                      <span className="w-1 h-1 rounded-full bg-walnut" /> {it}
                    </li>
                  ))}
                </ul>
                <Link to="/consultation" className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] link-underline">
                  Discuss this service <ArrowUpRight size={14}/>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
