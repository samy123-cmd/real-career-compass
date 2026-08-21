import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Create your Career Reality account — save your salary data" },
      {
        name: "description",
        content:
          "Create a free member account to save your own compensation history, track offers privately and publish career analysis.",
      },
      { property: "og:title", content: "Join Career Reality" },
      {
        property: "og:description",
        content: "Save your salary and career data, and publish your own analysis.",
      },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full border border-border bg-card px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-foreground";

function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [loading, isAuthenticated, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName || "Member" },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setNotice("Check your inbox and confirm your email to finish creating the account.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!email) {
      setError("Enter your email first, then request the reset link.");
      return;
    }
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setError(err ? err.message : null);
    if (!err) setNotice("Password reset link sent.");
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-2 lg:gap-20">
        <section>
          <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
            Member account
          </div>
          <h1 className="mt-3 text-[32px] leading-[1.08] tracking-tight text-balance md:text-[44px]">
            {mode === "signup" ? "Keep your own compensation record." : "Welcome back."}
          </h1>
          <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
            A free account lets you store every offer, hike and payslip in one private
            ledger, decide entry by entry what becomes part of the public benchmark, and
            publish your own analysis under your name.
          </p>
          <ul className="mt-8 flex flex-col divide-y divide-border border-y border-rule">
            {[
              ["Private by default", "Each entry is yours until you mark it public."],
              ["Real bands", "Public entries feed the salary explorer benchmarks."],
              ["Your byline", "Publish career analysis with a methodology note."],
            ].map(([title, note]) => (
              <li key={title} className="py-4">
                <div className="text-[14px] font-medium">{title}</div>
                <div className="mt-1 text-[13px] text-muted-foreground">{note}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-rule bg-card p-5 md:p-8">
          <div className="flex border-b border-rule">
            {(["signup", "signin"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  m === mode
                    ? "num -mb-px border-b-2 border-accent px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase"
                    : "num -mb-px px-4 py-2.5 text-[11px] tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground"
                }
              >
                {m === "signup" ? "Create account" : "Sign in"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="label-xs">Display name</span>
                <input
                  className={field}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How your byline reads"
                  autoComplete="name"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Email</span>
              <input
                className={field}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Password</span>
              <input
                className={field}
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </label>

            {error && <p className="text-[13px] text-accent">{error}</p>}
            {notice && <p className="text-[13px] text-positive">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="num mt-2 border border-foreground bg-foreground px-5 py-3 text-[12px] tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:border-accent hover:bg-accent disabled:opacity-50"
            >
              {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>

            {mode === "signin" && (
              <button
                type="button"
                onClick={reset}
                className="self-start text-[12px] text-muted-foreground underline hover:text-foreground"
              >
                Forgot password?
              </button>
            )}
          </form>

          <p className="mt-6 border-t border-rule pt-4 text-[12px] leading-relaxed text-muted-foreground">
            We store your email and whatever you choose to submit. Nothing is sold, and
            public entries never carry your name. Read the{" "}
            <Link to="/" className="underline hover:text-foreground">
              methodology
            </Link>{" "}
            for how submissions are handled.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
