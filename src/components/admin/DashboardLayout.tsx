import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, FolderKanban, FileText, Tag, MessageSquareQuote, Inbox, Image as ImageIcon, LogOut, Home } from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { to: "/dashboard/blogs", label: "Blogs", icon: FileText },
  { to: "/dashboard/categories", label: "Categories", icon: Tag },
  { to: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/dashboard/leads", label: "Leads", icon: Inbox },
  { to: "/dashboard/media", label: "Media", icon: ImageIcon },
];

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="min-h-screen flex bg-ink text-bone">
      <aside className="w-64 shrink-0 border-r border-bone/10 p-6 flex flex-col gap-2 sticky top-0 h-screen">
        <Link to="/" className="block mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Mad Mistri</p>
          <p className="font-display text-2xl mt-1">Studio CMS</p>
        </Link>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path === n.to || path.startsWith(n.to + "/");
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to as any} className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${active ? "bg-gold text-ink" : "text-bone/70 hover:text-gold hover:bg-bone/5"}`}>
                <Icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-bone/10 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.2em] text-bone/50 hover:text-gold">
            <Home size={14} /> View Site
          </Link>
          <p className="px-3 text-[10px] text-bone/40 truncate">{user?.email}</p>
          <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="flex w-full items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.2em] text-bone/60 hover:text-gold">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
