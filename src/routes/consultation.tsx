import { createFileRoute } from "@tanstack/react-router";
import { Visual } from "@/components/Visual";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { whatsappUrl } from "@/components/WhatsAppFab";
import { toast } from "sonner";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Book Consultation — Mad Mistri" },
      { name: "description", content: "Book a complimentary consultation with the Mad Mistri studio for your café, restaurant, hotel or commercial space." },
      { property: "og:title", content: "Book Consultation — Mad Mistri" },
      { property: "og:description", content: "Schedule a complimentary studio consultation." },
    ],
  }),
  component: ConsultationPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(20),
  business: z.string().trim().min(1).max(120),
  type: z.string(),
  date: z.string().min(1),
  message: z.string().trim().max(1000).optional(),
});

const includes = [
  "60-minute discovery call or studio visit",
  "Material & moodboard direction",
  "Indicative timeline & investment range",
  "Walkthrough of comparable past projects",
];

function ConsultationPage() {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message ?? "Required"; });
      setErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      business_type: parsed.data.type,
      message: `Business: ${parsed.data.business}\nPreferred date: ${parsed.data.date}\n${parsed.data.message ?? ""}`,
      source: "consultation-form",
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Inquiry received — opening WhatsApp…");
    setDone(true);

    const waMessage = `Hello Mad Mistri, I would like to discuss a commercial furniture project.

Name: ${parsed.data.name}
Phone: ${parsed.data.phone}
Email: ${parsed.data.email}
Business: ${parsed.data.business} (${parsed.data.type})
Preferred date: ${parsed.data.date}
${parsed.data.message ? `\nBrief: ${parsed.data.message}` : ""}`;
    setTimeout(() => {
      window.open(whatsappUrl(waMessage), "_blank", "noopener,noreferrer");
    }, 800);
  };

  return (
    <>
      <section className="relative pt-40 md:pt-52 pb-16 md:pb-20 bg-ink text-bone overflow-hidden">
        <Visual variant="dining" className="absolute inset-0 opacity-70"/>
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold mb-6">Consultation</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-5xl">
            Begin with a <span className="italic text-gold">conversation.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-bone/60 text-base md:text-lg leading-relaxed">
            Share your brief — we'll respond within one working day with a date that suits you.
          </p>
        </div>
      </section>

      <section className="bg-bone text-ink py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-12">
          <aside className="md:col-span-4 space-y-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-4">What's included</p>
              <ul className="space-y-3">
                {includes.map((i) => (
                  <li key={i} className="flex gap-3 text-charcoal/80">
                    <Check size={18} className="text-walnut mt-1 shrink-0"/>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 border border-walnut/20">
              <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-2">Studio hours</p>
              <p className="font-display text-xl">Mon — Sat · 10am — 7pm</p>
              <p className="text-sm text-charcoal/70 mt-2">Visits by appointment. We host you with coffee.</p>
            </div>
          </aside>

          <div className="md:col-span-8">
            {done ? (
              <div className="bg-ink text-bone p-10 sm:p-12 md:p-16 text-center animate-fade-up">
                <div className="mx-auto w-16 h-16 rounded-full border border-gold/40 grid place-items-center mb-6 animate-glow-pulse">
                  <Check size={28} className="text-gold" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Inquiry Received</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">Thank you.</h2>
                <p className="text-bone/70 max-w-md mx-auto mb-8">We've opened a WhatsApp chat with the studio so we can confirm details right away. Our team will respond within one working day.</p>
                <a
                  href={whatsappUrl("Hello Mad Mistri, I would like to discuss a commercial furniture project.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gold text-ink px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-bone transition-all"
                >
                  Open WhatsApp Chat →
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-ink text-bone p-8 md:p-12">
                <div className="flex items-center gap-2 mb-8">
                  {[0, 1].map((s) => (
                    <div key={s} className={`h-px flex-1 ${s <= step ? "bg-gold" : "bg-bone/20"}`}/>
                  ))}
                </div>
                {step === 0 ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-2">Step 01</p>
                      <h2 className="font-display text-3xl md:text-4xl">About you</h2>
                    </div>
                    {[
                      { name: "name", label: "Full Name", type: "text" },
                      { name: "email", label: "Email", type: "email" },
                      { name: "phone", label: "Phone / WhatsApp", type: "tel" },
                      { name: "business", label: "Business / Brand Name", type: "text" },
                    ].map((f) => (
                      <Field key={f.name} {...f} error={errors[f.name]}/>
                    ))}
                    <button type="button" onClick={() => setStep(1)} className="mt-4 bg-gold text-ink px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-bone transition-all">
                      Continue →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-2">Step 02</p>
                      <h2 className="font-display text-3xl md:text-4xl">About the project</h2>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">Project Type</label>
                      <select name="type" defaultValue="Café" className="w-full bg-transparent border-b border-bone/20 py-3 text-base text-bone focus:outline-none focus:border-gold transition-colors">
                        {["Café", "Restaurant", "Hotel", "Lounge", "Office", "Other"].map((o) => (
                          <option key={o} value={o} className="bg-ink">{o}</option>
                        ))}
                      </select>
                    </div>
                    <Field name="date" label="Preferred Consultation Date" type="date" error={errors.date}/>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">Project Brief (optional)</label>
                      <textarea name="message" rows={4} maxLength={1000} className="w-full bg-transparent border-b border-bone/20 py-3 text-base text-bone focus:outline-none focus:border-gold transition-colors resize-none"/>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" disabled={loading} onClick={() => setStep(0)} className="border border-bone/30 text-bone px-7 py-4 text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-all disabled:opacity-50">← Back</button>
                      <button type="submit" disabled={loading} className="inline-flex items-center gap-3 bg-gold text-ink px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-bone transition-all disabled:opacity-70">
                        {loading ? (<><Loader2 size={14} className="animate-spin" /> Sending…</>) : "Book Consultation"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ name, label, type, error }: { name: string; label: string; type: string; error?: string }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">{label}</label>
      <input name={name} type={type} maxLength={255} className="w-full bg-transparent border-b border-bone/20 py-3 text-base text-bone focus:outline-none focus:border-gold transition-colors"/>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
