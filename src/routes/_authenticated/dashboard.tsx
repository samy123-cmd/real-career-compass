import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import {
  addSalaryEntry,
  deleteSalaryEntry,
  getMyProfile,
  listMySalaries,
  saveMyProfile,
} from "@/lib/salary.functions";
import { deletePost, listMyPosts } from "@/lib/posts.functions";
import { formatDate } from "@/lib/slug";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your career ledger — Career Reality" },
      {
        name: "description",
        content:
          "Your private record of offers, salary history and published analysis on Career Reality.",
      },
      { property: "og:title", content: "Your career ledger — Career Reality" },
      { property: "og:description", content: "Private salary history and your published analysis." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const field =
  "w-full border border-border bg-card px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-foreground";
const tiers = ["Product", "GCC", "Services", "Consumer"] as const;

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const fetchEntries = useServerFn(listMySalaries);
  const fetchProfile = useServerFn(getMyProfile);
  const fetchPosts = useServerFn(listMyPosts);
  const addEntry = useServerFn(addSalaryEntry);
  const removeEntry = useServerFn(deleteSalaryEntry);
  const saveProfile = useServerFn(saveMyProfile);
  const removePost = useServerFn(deletePost);

  const entries = useQuery({ queryKey: ["my-salaries"], queryFn: () => fetchEntries() });
  const profile = useQuery({ queryKey: ["my-profile"], queryFn: () => fetchProfile() });
  const posts = useQuery({ queryKey: ["my-posts"], queryFn: () => fetchPosts() });

  const [form, setForm] = useState({
    roleTitle: "",
    level: "",
    company: "",
    city: "Bengaluru",
    employerTier: "Product" as (typeof tiers)[number],
    experienceYears: "3",
    fixedLpa: "",
    variableLpa: "0",
    noticeDays: "60",
    isPublic: true,
    note: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const createEntry = useMutation({
    mutationFn: async () =>
      addEntry({
        data: {
          roleTitle: form.roleTitle,
          level: form.level || undefined,
          company: form.company || undefined,
          city: form.city,
          employerTier: form.employerTier,
          experienceYears: Number(form.experienceYears),
          fixedLpa: Number(form.fixedLpa),
          variableLpa: Number(form.variableLpa || 0),
          noticeDays: Number(form.noticeDays),
          isPublic: form.isPublic,
          note: form.note || undefined,
        },
      }),
    onSuccess: () => {
      setForm({ ...form, roleTitle: "", company: "", fixedLpa: "", note: "" });
      setFormError(null);
      qc.invalidateQueries({ queryKey: ["my-salaries"] });
    },
    onError: (e) => setFormError(e instanceof Error ? e.message : "Could not save that entry."),
  });

  const profileMutation = useMutation({
    mutationFn: async (values: { displayName: string; headline: string; city: string }) =>
      saveProfile({
        data: {
          displayName: values.displayName,
          headline: values.headline || undefined,
          city: values.city || undefined,
        },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-profile"] }),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const rows = entries.data ?? [];
  const totalTracked = rows.reduce((a, r) => a + Number(r.total_lpa), 0);
  const best = rows.reduce((a, r) => Math.max(a, Number(r.total_lpa)), 0);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-8 md:px-8 md:py-12">
        <header className="flex flex-col gap-4 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
              Member ledger
            </div>
            <h1 className="mt-2 text-[30px] leading-tight tracking-tight md:text-[40px]">
              {profile.data?.display_name ?? "Your career record"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/submit"
              className="num border border-foreground px-4 py-2 text-[11px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-primary-foreground"
            >
              Write analysis
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="num border border-border px-4 py-2 text-[11px] tracking-[0.14em] text-muted-foreground uppercase hover:border-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-6 border-b border-rule pb-8 md:grid-cols-4">
          {[
            ["Entries saved", String(rows.length)],
            ["Highest total", best ? `${best.toFixed(1)}L` : "—"],
            [
              "Average total",
              rows.length ? `${(totalTracked / rows.length).toFixed(1)}L` : "—",
            ],
            ["Published pieces", String(posts.data?.length ?? 0)],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="label-xs">{label}</div>
              <div className="num mt-2 text-[28px] leading-none">{value}</div>
            </div>
          ))}
        </section>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <SectionHeading>Add a compensation entry</SectionHeading>
            <form
              className="mt-5 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                createEntry.mutate();
              }}
            >
              <label className="flex flex-col gap-1.5">
                <span className="label-xs">Role title</span>
                <input
                  className={field}
                  required
                  value={form.roleTitle}
                  onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                  placeholder="Senior Software Engineer"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Level</span>
                  <input
                    className={field}
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    placeholder="L5"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Company</span>
                  <input
                    className={field}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Optional"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">City</span>
                  <input
                    className={field}
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Employer tier</span>
                  <select
                    className={field}
                    value={form.employerTier}
                    onChange={(e) =>
                      setForm({ ...form, employerTier: e.target.value as (typeof tiers)[number] })
                    }
                  >
                    {tiers.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Years</span>
                  <input
                    className={field}
                    type="number"
                    step="0.5"
                    min="0"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Fixed LPA</span>
                  <input
                    className={field}
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={form.fixedLpa}
                    onChange={(e) => setForm({ ...form, fixedLpa: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Variable</span>
                  <input
                    className={field}
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.variableLpa}
                    onChange={(e) => setForm({ ...form, variableLpa: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Notice (d)</span>
                  <input
                    className={field}
                    type="number"
                    min="0"
                    max="180"
                    value={form.noticeDays}
                    onChange={(e) => setForm({ ...form, noticeDays: e.target.value })}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="label-xs">Note</span>
                <textarea
                  className={`${field} min-h-20`}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Context you want to remember: clawback, joining bonus, band."
                />
              </label>
              <label className="flex items-start gap-3 border-y border-rule py-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.isPublic}
                  onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                />
                <span className="text-[13px] leading-relaxed text-muted-foreground">
                  Include in the public benchmark. Your name and email are never shown —
                  only role, level, city, tier and the numbers.
                </span>
              </label>
              {formError && <p className="text-[13px] text-accent">{formError}</p>}
              <button
                type="submit"
                disabled={createEntry.isPending}
                className="num border border-foreground bg-foreground px-5 py-3 text-[12px] tracking-[0.14em] text-primary-foreground uppercase hover:border-accent hover:bg-accent disabled:opacity-50"
              >
                {createEntry.isPending ? "Saving…" : "Save entry"}
              </button>
            </form>

            <div className="mt-12">
              <SectionHeading>Profile</SectionHeading>
              <form
                className="mt-5 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget as HTMLFormElement);
                  profileMutation.mutate({
                    displayName: String(data.get("displayName") ?? ""),
                    headline: String(data.get("headline") ?? ""),
                    city: String(data.get("city") ?? ""),
                  });
                }}
              >
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Display name</span>
                  <input
                    name="displayName"
                    className={field}
                    required
                    defaultValue={profile.data?.display_name ?? ""}
                    key={profile.data?.display_name ?? "name"}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">Headline</span>
                  <input
                    name="headline"
                    className={field}
                    defaultValue={profile.data?.headline ?? ""}
                    key={profile.data?.headline ?? "headline"}
                    placeholder="Staff engineer, payments"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="label-xs">City</span>
                  <input
                    name="city"
                    className={field}
                    defaultValue={profile.data?.city ?? ""}
                    key={profile.data?.city ?? "city"}
                  />
                </label>
                <button
                  type="submit"
                  disabled={profileMutation.isPending}
                  className="num self-start border border-foreground px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-primary-foreground disabled:opacity-50"
                >
                  {profileMutation.isPending ? "Saving…" : "Save profile"}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-7">
            <SectionHeading>Your entries</SectionHeading>
            {entries.isLoading ? (
              <p className="mt-6 text-[13px] text-muted-foreground">Loading your ledger…</p>
            ) : rows.length === 0 ? (
              <p className="mt-6 max-w-[52ch] text-[13px] leading-relaxed text-muted-foreground">
                Nothing saved yet. Add your current package first, then each past offer —
                the ledger becomes a negotiating record rather than a memory test.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col divide-y divide-border border-y border-rule">
                {rows.map((r) => (
                  <li key={r.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-[15px] font-medium">
                        {r.role_title}
                        {r.level ? ` · ${r.level}` : ""}
                      </div>
                      <div className="num mt-1 text-[11px] text-muted-foreground uppercase">
                        {[r.company, r.city, r.employer_tier, `${r.experience_years}y`, `${r.notice_days}d notice`]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                      {r.note && (
                        <p className="mt-2 max-w-[54ch] text-[13px] leading-relaxed text-muted-foreground">
                          {r.note}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <div className="num text-[18px]">{Number(r.total_lpa).toFixed(1)}L</div>
                      <div className="num text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                        {r.is_public ? "Public" : "Private"}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await removeEntry({ data: { id: r.id } });
                          qc.invalidateQueries({ queryKey: ["my-salaries"] });
                        }}
                        className="num text-[10px] tracking-[0.14em] text-muted-foreground uppercase hover:text-accent"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-12">
              <SectionHeading>Your analysis</SectionHeading>
              {(posts.data?.length ?? 0) === 0 ? (
                <p className="mt-6 max-w-[52ch] text-[13px] leading-relaxed text-muted-foreground">
                  You haven't published anything yet.{" "}
                  <Link to="/submit" className="underline hover:text-accent">
                    Write your first piece
                  </Link>
                  .
                </p>
              ) : (
                <ul className="mt-4 flex flex-col divide-y divide-border border-y border-rule">
                  {posts.data!.map((p) => (
                    <li key={p.id} className="flex items-start justify-between gap-4 py-4">
                      <div>
                        <Link
                          to="/analysis/$slug"
                          params={{ slug: p.slug }}
                          className="text-[15px] leading-snug hover:text-accent"
                        >
                          {p.title}
                        </Link>
                        <div className="num mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                          {p.category} · {formatDate(p.published_at)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await removePost({ data: { id: p.id } });
                          qc.invalidateQueries({ queryKey: ["my-posts"] });
                        }}
                        className="num shrink-0 text-[10px] tracking-[0.14em] text-muted-foreground uppercase hover:text-accent"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
