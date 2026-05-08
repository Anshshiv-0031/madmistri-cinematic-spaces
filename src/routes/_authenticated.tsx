import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink text-bone">
        <p className="text-xs uppercase tracking-[0.4em] text-gold animate-pulse">Loading…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}
