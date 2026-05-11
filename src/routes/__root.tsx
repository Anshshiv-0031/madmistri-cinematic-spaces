import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink text-bone px-4">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-4 font-display text-5xl">Page not found</h1>
        <p className="mt-3 text-sm text-bone/60">
          The page you're looking for has moved or no longer exists.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 border border-gold text-gold px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-ink transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink text-bone px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-bone/60">Please try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 border border-gold text-gold px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-ink"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mad Mistri — Luxury Commercial Furniture & Interiors" },
      { name: "description", content: "Mad Mistri crafts luxurious commercial furniture and interiors for cafés, restaurants, hotels and lounges across India." },
      { name: "author", content: "Mad Mistri" },
      { property: "og:title", content: "Mad Mistri — Luxury Commercial Furniture & Interiors" },
      { property: "og:description", content: "Mad Mistri crafts luxurious commercial furniture and interiors for cafés, restaurants, hotels and lounges across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Mad Mistri — Luxury Commercial Furniture & Interiors" },
      { name: "twitter:description", content: "Mad Mistri crafts luxurious commercial furniture and interiors for cafés, restaurants, hotels and lounges across India." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/20bafd99-f455-429c-9864-17d2868737a3/id-preview-91da3ad5--39bad11e-2e23-42d8-bc7b-69c491c98a0d.lovable.app-1778179364363.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/20bafd99-f455-429c-9864-17d2868737a3/id-preview-91da3ad5--39bad11e-2e23-42d8-bc7b-69c491c98a0d.lovable.app-1778179364363.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/dashboard") || path.startsWith("/admin") || path === "/login";
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {!isAdmin && <Header />}
        <main className="min-h-screen">
          <Outlet />
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppFab />}
        <Toaster theme="dark" position="bottom-right" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}
