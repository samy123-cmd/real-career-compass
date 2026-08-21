import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Career Reality" },
      { name: "description", content: "Choose a new password for your Career Reality account." },
      { property: "og:title", content: "Set a new password — Career Reality" },
      { property: "og:description", content: "Choose a new password for your account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(err.message);
    else navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[52ch] px-4 py-16 md:px-8">
        <h1 className="text-[30px] leading-tight tracking-tight">Set a new password</h1>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="label-xs">New password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-card px-3 py-2.5 text-[14px] outline-none focus:border-foreground"
              autoComplete="new-password"
            />
          </label>
          {error && <p className="text-[13px] text-accent">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="num border border-foreground bg-foreground px-5 py-3 text-[12px] tracking-[0.14em] text-primary-foreground uppercase hover:bg-accent hover:border-accent disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save password"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
