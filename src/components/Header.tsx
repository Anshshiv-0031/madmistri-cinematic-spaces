import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/blogs", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-700",
        scrolled
          ? "glass-dark py-3"
          : "bg-transparent py-6",
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-center justify-between text-bone">
        <Link to="/" className="group flex items-center gap-2">
          <span className="font-display text-xl md:text-2xl tracking-tight">
            Mad <span className="text-gold">Mistri</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[13px] uppercase tracking-[0.18em]">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-underline text-bone/80 hover:text-bone transition-colors"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 border border-bone/30 hover:border-gold hover:text-gold text-bone px-5 py-2.5 text-[12px] uppercase tracking-[0.2em] transition-all duration-500"
          >
            Book Consultation
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden text-bone p-2"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-500",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="glass-dark mt-3 mx-4 rounded-md p-6 flex flex-col gap-5 text-bone">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="text-lg font-display"
              activeProps={{ className: "text-gold" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/consultation"
            onClick={() => setOpen(false)}
            className="mt-2 border border-gold text-gold px-5 py-3 text-center text-xs uppercase tracking-[0.2em]"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </header>
  );
}
