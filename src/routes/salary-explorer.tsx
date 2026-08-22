import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import {
  bands,
  bandsForRole,
  distributionFor,
  roleOptions,
  sectorMedians,
  sources,
} from "@/data/salary-bands";
import { listPublicSalaries } from "@/lib/salary.functions";

const salariesQuery = queryOptions({
  queryKey: ["public-salaries"],
  queryFn: () => listPublicSalaries(),
});

export const Route = createFileRoute("/salary-explorer")({
  loader: ({ context }) => context.queryClient.ensureQueryData(salariesQuery),
  head: () => ({
    meta: [
      { title: "Salary explorer — real Indian tech pay bands by role, level and city" },
      {
        name: "description",
        content:
          "Published p25/p50/p90 compensation bands for Indian tech roles, sourced from levels.fyi, AmbitionBox and recruiter surveys, plus live member submissions.",
      },
      { property: "og:title", content: "Salary explorer — real Indian tech pay bands" },
      {
        property: "og:description",
        content:
          "Percentile pay bands by role, level, city and employer tier — each with its source and confidence flag.",
      },
    ],
  }),
  errorComponent: () => (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[68ch] px-4 py-20 md:px-8">
        <h1 className="text-[30px]">The explorer didn't load</h1>
        <p className="mt-3 text-[14px] text-muted-foreground">Refresh in a moment.</p>
      </main>
      <SiteFooter />
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[68ch] px-4 py-20 md:px-8">
        <h1 className="text-[30px]">Nothing here</h1>
      </main>
      <SiteFooter />
    </div>
  ),
  component: SalaryExplorer,
});

function SalaryExplorer() {
  const { data } = useSuspenseQuery(salariesQuery);
  const [role, setRole] = useState(roleOptions[0]!);

  const rows = useMemo(() => bandsForRole(role), [role]);
  const distribution = useMemo(() => distributionFor(role), [role]);
  const max = Math.max(...distribution.map((d) => d.count), 1);
  const widest = Math.max(...rows.map((r) => r.p90), 1);

  const headline = rows[0]!;
  const totalSample = bands.reduce((a, b) => a + b.sample, 0);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-8 md:px-8 md:py-10">
        <header className="border-b border-rule pb-6">
          <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
            Data explorer · {totalSample.toLocaleString("en-IN")} sourced data points
          </div>
          <h1 className="mt-3 text-[32px] leading-[1.06] tracking-tight md:text-[52px]">
            Salary explorer
          </h1>
          <p className="mt-4 max-w-[64ch] text-[14px] leading-relaxed text-muted-foreground">
            Bands below are compiled from levels.fyi India, AmbitionBox title pages and
            recruiter-survey commentary, then flagged <em>sourced</em> or{" "}
            <em>estimated</em> so you know which numbers we interpolated. Member
            submissions appear separately at the bottom, unaggregated.
          </p>
        </header>

        <section className="mt-6">
          <div className="label-xs">Role</div>
          <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
            {roleOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={
                  r === role
                    ? "num shrink-0 border border-foreground bg-foreground px-3 py-2 text-[11px] whitespace-nowrap text-primary-foreground"
                    : "num shrink-0 border border-border bg-card px-3 py-2 text-[11px] whitespace-nowrap transition-colors hover:border-foreground"
                }
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {[
            { label: "25th percentile", value: headline.p25, emphasis: false },
            { label: "Median", value: headline.p50, emphasis: true },
            { label: "90th percentile", value: headline.p90, emphasis: false },
          ].map((p) => (
            <div
              key={p.label}
              className={p.emphasis ? "border-l-2 border-accent pl-4 md:pl-5" : "border-l-2 border-border pl-4 md:pl-5"}
            >
              <div className={p.emphasis ? "num text-[10px] tracking-[0.14em] text-accent uppercase" : "label-xs"}>
                {p.label}
              </div>
              <div className="num mt-2 text-[30px] leading-none md:text-[34px]">
                {p.value.toFixed(1)}
                <span className="ml-1.5 text-[13px] text-muted-foreground">LPA</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground md:text-[13px]">
                {headline.level} · {headline.experience} · {headline.city} · {headline.tier}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <SectionHeading>Bands for {role}</SectionHeading>
          <ul className="mt-5 flex flex-col divide-y divide-border border-y border-rule md:hidden">
            {rows.map((r) => (
              <li key={r.id} className="py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-medium">{r.level}</span>
                  <span className="num text-[15px]">{r.p50.toFixed(1)}L</span>
                </div>
                <div className="num mt-1 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {r.city} · {r.tier} · {r.experience} · n={r.sample}
                </div>
                <div className="mt-3 h-[6px] w-full bg-secondary">
                  <div
                    className="h-full bg-foreground/80"
                    style={{
                      marginLeft: `${(r.p25 / widest) * 100}%`,
                      width: `${((r.p90 - r.p25) / widest) * 100}%`,
                    }}
                  />
                </div>
                <div className="num mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                  <span>p25 {r.p25.toFixed(1)}</span>
                  <span>p90 {r.p90.toFixed(1)}</span>
                </div>
                <div className="num mt-2 text-[10px] text-muted-foreground">
                  {r.confidence === "sourced" ? "Sourced" : "Estimated"} · {r.source}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-foreground">
                  <th className="label-xs py-2.5 pr-4 font-normal">Level</th>
                  <th className="label-xs px-3 py-2.5 font-normal">City · tier</th>
                  <th className="label-xs px-3 py-2.5 font-normal">Exp</th>
                  <th className="label-xs px-3 py-2.5 text-right font-normal">p25</th>
                  <th className="label-xs px-3 py-2.5 text-right font-normal">Median</th>
                  <th className="label-xs px-3 py-2.5 text-right font-normal">p90</th>
                  <th className="label-xs px-3 py-2.5 text-right font-normal">At risk</th>
                  <th className="label-xs px-3 py-2.5 text-right font-normal">n</th>
                  <th className="label-xs py-2.5 pl-3 font-normal">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border align-top transition-colors hover:bg-secondary">
                    <td className="py-4 pr-4 text-[14px] font-medium">{r.level}</td>
                    <td className="px-3 py-4 text-[13px] text-muted-foreground">
                      {r.city} · {r.tier}
                    </td>
                    <td className="num px-3 py-4 text-[13px]">{r.experience}</td>
                    <td className="num px-3 py-4 text-right text-[13px]">{r.p25.toFixed(1)}</td>
                    <td className="num px-3 py-4 text-right text-[14px] font-medium">{r.p50.toFixed(1)}</td>
                    <td className="num px-3 py-4 text-right text-[13px]">{r.p90.toFixed(1)}</td>
                    <td className="num px-3 py-4 text-right text-[13px] text-muted-foreground">
                      {r.variableShare}%
                    </td>
                    <td className="num px-3 py-4 text-right text-[12px] text-muted-foreground">{r.sample}</td>
                    <td className="py-4 pl-3 text-[12px]">
                      <span className={r.confidence === "sourced" ? "text-positive" : "text-accent"}>
                        {r.confidence === "sourced" ? "Sourced" : "Estimated"}
                      </span>
                      <div className="mt-1 max-w-[26ch] text-[11px] leading-snug text-muted-foreground">
                        {r.source}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="num mt-3 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            ₹ lakh per annum, total compensation · "At risk" = bonus + stock share
          </p>
        </section>

        <section className="mt-14">
          <SectionHeading>Implied distribution · {role}</SectionHeading>
          <div className="mt-6 flex h-44 items-end gap-1.5 border-b border-foreground md:h-56 md:gap-2">
            {distribution.map((d) => (
              <div key={d.bucket} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
                <span className="num text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {d.count}
                </span>
                <div
                  className="w-full bg-foreground/85 transition-colors group-hover:bg-accent"
                  style={{ height: `${Math.max((d.count / max) * 100, 1)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5 md:gap-2">
            {distribution.map((d) => (
              <span key={d.bucket} className="num flex-1 text-center text-[9px] text-muted-foreground md:text-[10px]">
                {d.bucket}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading>Sector medians</SectionHeading>
          <ul className="mt-5 flex flex-col divide-y divide-border border-y border-rule">
            {sectorMedians.map((s) => (
              <li key={s.sector} className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6">
                <div className="num w-24 shrink-0 text-[17px]">{s.median.toFixed(1)}L</div>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium">
                    {s.sector}
                    <span
                      className={
                        s.confidence === "sourced"
                          ? "num ml-3 text-[10px] tracking-[0.12em] text-positive uppercase"
                          : "num ml-3 text-[10px] tracking-[0.12em] text-accent uppercase"
                      }
                    >
                      {s.confidence}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-muted-foreground">
                    {s.note} Variable: {s.variable}.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <SectionHeading>Live member submissions</SectionHeading>
          {data.error ? (
            <p className="mt-5 text-[13px] text-accent">{data.error}</p>
          ) : data.entries.length === 0 ? (
            <div className="mt-5 border border-rule bg-card p-5 md:p-6">
              <p className="max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">
                No public member submissions yet. Yours would be the first — role, city,
                tier and numbers only, never your name.
              </p>
              <Link
                to="/auth"
                className="num mt-5 inline-block border border-foreground bg-foreground px-5 py-2.5 text-[11px] tracking-[0.14em] text-primary-foreground uppercase hover:border-accent hover:bg-accent"
              >
                Contribute a data point
              </Link>
            </div>
          ) : (
            <ul className="mt-5 flex flex-col divide-y divide-border border-y border-rule">
              {data.entries.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium">
                      {e.role_title}
                      {e.level ? ` · ${e.level}` : ""}
                    </div>
                    <div className="num mt-1 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                      {[e.company, e.city, e.employer_tier, `${e.experience_years}y`, `${e.notice_days}d notice`]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="num text-[16px]">{Number(e.total_lpa).toFixed(1)}L</div>
                    <div className="num text-[10px] text-muted-foreground">
                      fixed {Number(e.fixed_lpa).toFixed(1)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-14 border-t border-rule pt-6">
          <SectionHeading>Sources</SectionHeading>
          <ul className="mt-4 flex flex-col gap-3">
            {sources.map((s) => (
              <li key={s.name} className="flex flex-col gap-0.5 md:flex-row md:gap-4">
                <span className="num w-64 shrink-0 text-[12px]">{s.name}</span>
                <span className="text-[13px] leading-relaxed text-muted-foreground">{s.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[70ch] text-[12px] leading-relaxed text-muted-foreground">
            Crowdsourced averages skew toward services and junior employees; self-reported
            product-company data skews high. Where the two disagree we publish both rather
            than blending them into a single false number.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
