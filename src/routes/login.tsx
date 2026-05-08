import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login — Mad Mistri" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) setErr(error);
    else if (mode === "signup") setErr("Account created. You may be signed in automatically.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink text-bone px-6 py-24">
      <div className="w-full max-w-md">
        <Link to="/" className="text-[10px] uppercase tracking-[0.4em] text-gold">Mad Mistri</Link>
        <h1 className="font-display text-4xl mt-6 mb-2">{mode === "signin" ? "Sign in" : "Create admin"}</h1>
        <p className="text-bone/50 text-sm mb-10">
          {mode === "signin" ? "Access the studio dashboard." : "First account becomes the admin."}
        </p>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-bone/20 py-3 text-base focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-bone/50 mb-2">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-bone/20 py-3 text-base focus:outline-none focus:border-gold" />
          </div>
          {err && <p className="text-xs text-gold">{err}</p>}
          <button disabled={busy} type="submit" className="w-full bg-gold text-ink px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-bone transition disabled:opacity-50">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-6 text-xs uppercase tracking-[0.25em] text-bone/60 hover:text-gold">
          {mode === "signin" ? "Need to create the first admin? →" : "← Back to sign in"}
        </button>
      </div>
    </div>
  );
}
