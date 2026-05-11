import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-ink text-bone overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px gold-line" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <h3 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance">
            Crafting interiors<br/>
            <span className="text-gold italic">that linger.</span>
          </h3>
          <p className="mt-6 text-bone/60 max-w-md leading-relaxed">
            Mad Mistri designs and manufactures premium commercial furniture for
            cafés, restaurants, hotels and lounges across India.
          </p>
          <Link
            to="/consultation"
            className="inline-block mt-8 border border-gold text-gold px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-ink transition-all duration-500"
          >
            Begin a Project
          </Link>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold/80 mb-5">Studio</p>
          <ul className="space-y-3 text-bone/70">
            <li className="flex gap-3"><MapPin size={16} className="mt-1 text-gold shrink-0"/> <span>Shop No 1, Near Lakadganj Garden,<br/>Queta Colony Telephone Exchange,<br/>Nagpur, India – 440008</span></li>
            <li className="flex gap-3 items-center"><Phone size={16} className="text-gold"/> <a href="tel:+919370476464" className="hover:text-gold">+91 93704 76464</a></li>
            <li className="flex gap-3 items-center"><Mail size={16} className="text-gold"/> <a href="mailto:mail@madmistri.com" className="hover:text-gold">mail@madmistri.com</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold/80 mb-5">Navigate</p>
          <ul className="space-y-3 text-bone/70 text-sm">
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/projects" className="hover:text-gold">Projects</Link></li>
            <li><Link to="/blogs" className="hover:text-gold">Journal</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-bone/50">
          <p>© {new Date().getFullYear()} Mad Mistri. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com/madmistri" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-gold"><Instagram size={16}/></a>
            <a href="https://facebook.com/madmistri" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-gold"><Facebook size={16}/></a>
            <span className="hidden md:inline text-bone/40 tracking-[0.15em] uppercase text-[10px]">Designed by <a href="#" className="text-gold/80 hover:text-gold transition-colors">Renovae Agency — Ansh Shiv</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
