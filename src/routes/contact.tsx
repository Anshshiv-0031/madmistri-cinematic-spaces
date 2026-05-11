import { createFileRoute } from "@tanstack/react-router";
import { Visual } from "@/components/Visual";
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { whatsappUrl } from "@/components/WhatsAppFab";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mad Mistri" },
      { name: "description", content: "Speak with the Mad Mistri studio in Nagpur. Phone, email, WhatsApp and visiting hours." },
      { property: "og:title", content: "Contact Mad Mistri" },
      { property: "og:description", content: "Get in touch with our Nagpur studio." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(8, "Valid phone required").max(20),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      setStatus("err");
      return;
    }
    setErrors({});
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      source: "contact-form",
    });
    if (error) { setStatus("err"); return; }
    setStatus("ok");
    formEl.reset();
  };

  return (
    <>
      <section className="relative pt-40 md:pt-52 pb-16 md:pb-24 bg-ink text-bone overflow-hidden">
        <Visual variant="walnut" className="absolute inset-0 opacity-60"/>
        <div className="absolute inset-0 cinematic-overlay"/>
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold mb-6">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-4xl">
            Begin the <span className="italic text-gold">conversation.</span>
          </h1>
        </div>
      </section>

      <section className="bg-bone text-ink py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-5 space-y-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-walnut mb-3">Studio</p>
              <p className="font-display text-2xl leading-snug">
                Shop No 1, Near Lakadganj Garden,<br/>
                Queta Colony Telephone Exchange,<br/>
                Nagpur, India – 440008
              </p>
            </div>
            <ul className="space-y-5 text-charcoal/80">
              <li className="flex items-center gap-4"><span className="w-10 h-10 grid place-items-center bg-ink text-gold rounded-full"><Phone size={16}/></span><a href="tel:+919370476464" className="hover:text-walnut">+91 93704 76464</a></li>
              <li className="flex items-center gap-4"><span className="w-10 h-10 grid place-items-center bg-ink text-gold rounded-full"><Mail size={16}/></span><a href="mailto:mail@madmistri.com" className="hover:text-walnut">mail@madmistri.com</a></li>
              <li className="flex items-center gap-4"><span className="w-10 h-10 grid place-items-center bg-ink text-gold rounded-full"><MessageCircle size={16}/></span><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-walnut">WhatsApp Studio</a></li>
              <li className="flex items-center gap-4"><span className="w-10 h-10 grid place-items-center bg-ink text-gold rounded-full"><MapPin size={16}/></span><span>Mon — Sat · 10am — 7pm</span></li>
            </ul>
            <div className="flex gap-4">
              <a href="https://instagram.com/madmistri" target="_blank" rel="noreferrer" className="w-10 h-10 grid place-items-center border border-walnut/30 hover:bg-ink hover:text-gold hover:border-ink transition-all" aria-label="Instagram"><Instagram size={16}/></a>
              <a href="https://facebook.com/madmistri" target="_blank" rel="noreferrer" className="w-10 h-10 grid place-items-center border border-walnut/30 hover:bg-ink hover:text-gold hover:border-ink transition-all" aria-label="Facebook"><Facebook size={16}/></a>
            </div>
          </div>

          <form onSubmit={onSubmit} className="md:col-span-7 bg-ink text-bone p-8 md:p-12 space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-2">Inquiry</p>
              <h2 className="font-display text-3xl md:text-4xl">Tell us about your space.</h2>
            </div>
            {[
              { name: "name", label: "Full Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone / WhatsApp", type: "tel" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">{f.label}</label>
                <input name={f.name} type={f.type} maxLength={255} className="w-full bg-transparent border-b border-bone/20 py-3 text-base text-bone focus:outline-none focus:border-gold transition-colors"/>
                {errors[f.name] && <p className="text-xs text-destructive mt-1">{errors[f.name]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">Project Brief</label>
              <textarea name="message" rows={4} maxLength={1000} className="w-full bg-transparent border-b border-bone/20 py-3 text-base text-bone focus:outline-none focus:border-gold transition-colors resize-none"/>
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>
            <button type="submit" className="mt-4 inline-flex items-center gap-3 bg-gold text-ink px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-bone transition-all duration-500">
              Send Inquiry
            </button>
            {status === "ok" && <p className="text-sm text-gold">Thank you — we'll be in touch within one working day.</p>}
          </form>
        </div>
      </section>

      <section className="bg-bone pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="relative overflow-hidden border border-walnut/15">
            <iframe
              title="Mad Mistri Studio Location"
              src="https://www.google.com/maps?q=Lakadganj+Garden+Nagpur&output=embed"
              loading="lazy"
              className="w-full h-[420px] md:h-[520px] grayscale contrast-110"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
