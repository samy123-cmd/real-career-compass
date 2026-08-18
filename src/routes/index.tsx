import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import {
  realityIndex,
  benchmarkRows,
  articles,
  tools,
  severityLabel,
} from "@/data/career-reality";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career Reality — honest salary and career-risk data for Indian tech" },
      {
        name: "description",
        content:
          "Verified compensation benchmarks, the Career Reality Index, layoff signals and in-hand CTC math for Indian technology professionals.",
      },
      { property: "og:title", content: "Career Reality — the honest career terminal for Indian tech" },
      {
        property: "og:description",
        content:
          "The Career Reality Index, salary benchmarks by role and city, and layoff signals — published with sample sizes.",
      },
    ],
  }),
  component: Terminal,
});

function Bar({ value }: { value: number }) {
  return (
    <div className="h-[3px] w-full bg-secondary">
      <div className="h-full bg-foreground" style={{ width: `${value}%` }} />
    </div>
  );
}

function Terminal() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <div className="grid grid-cols-12 gap-10">
          {/* Left rail */}
          <aside className="col-span-12 flex flex-col gap-10 lg:col-span-4">
            <section>
              <SectionHeading>Career Reality Index · {realityIndex.month}</SectionHeading>
              <div className="mt-5 flex items-end gap-4">
                <span className="num text-[64px] leading-none">{realityIndex.score}</span>
                <div className="pb-2">
                  <div className="num text-[11px] tracking-[0.14em] text-accent uppercase">
                    {realityIndex.verdict}
                  </div>
                  <div className="num text-[11px] text-muted-foreground">of 100</div>
                </div>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                {realityIndex.note}
              </p>
              <div className="mt-6 flex flex-col gap-5">
                {realityIndex.components.map((c) => (
                  <div key={c.label}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-[13px] font-medium">{c.label}</span>
                      <span className="num text-[12px]">
                        {c.value} · {severityLabel[c.severity]}
                      </span>
                    </div>
                    <Bar value={c.value} />
                    <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{c.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading>Instruments</SectionHeading>
              <nav className="mt-3 flex flex-col">
                {tools.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="group flex items-center justify-between border-b border-border py-3 text-[14px] transition-colors hover:text-accent"
                  >
                    <span>{t.label}</span>
                    <span className="num text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                      {t.meta}
                    </span>
                  </Link>
                ))}
              </nav>
            </section>
          </aside>

          {/* Main column */}
          <div className="col-span-12 flex flex-col gap-14 lg:col-span-8">
            <section>
              <h1 className="max-w-[24ch] text-[40px] leading-[1.06] tracking-tight text-balance md:text-[52px]">
                Stop guessing what the market pays.
              </h1>
              <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
                Every figure below carries its sample size. Nothing here is sponsored,
                inferred from job listings, or generated. It comes from verified offer
                letters and salary slips submitted anonymously by people doing the work.
              </p>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-y border-foreground">
                      <th className="label-xs py-2.5 pr-4 font-normal">Role</th>
                      <th className="label-xs px-4 py-2.5 font-normal">Experience</th>
                      <th className="label-xs px-4 py-2.5 font-normal">City · tier</th>
                      <th className="label-xs px-4 py-2.5 text-right font-normal">Fixed</th>
                      <th className="label-xs px-4 py-2.5 text-right font-normal">Total</th>
                      <th className="label-xs py-2.5 pl-4 text-right font-normal">n</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarkRows.map((r) => (
                      <tr
                        key={r.role + r.city}
                        className="border-b border-border transition-colors hover:bg-secondary"
                      >
                        <td className="py-4 pr-4 text-[14px] font-medium">{r.role}</td>
                        <td className="num px-4 py-4 text-[13px]">{r.years}</td>
                        <td className="px-4 py-4 text-[13px] text-muted-foreground">
                          {r.city} · {r.tier}
                        </td>
                        <td className="num px-4 py-4 text-right text-[13px]">{r.fixed.toFixed(1)}</td>
                        <td className="num px-4 py-4 text-right text-[14px] font-medium">
                          {r.total.toFixed(1)}
                        </td>
                        <td className="num py-4 pl-4 text-right text-[12px] text-muted-foreground">
                          {r.sample}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="num mt-3 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  Figures in ₹ lakh per annum · medians, not averages
                </p>
              </div>
            </section>

            <section className="border border-foreground bg-foreground px-7 py-8 text-primary-foreground">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-[46ch]">
                  <h2 className="text-[26px] leading-tight">Fix the opacity you complain about.</h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-primary-foreground/60">
                    Thirty seconds, no name, no employer identifier stored. Every submission
                    tightens the bands the next person negotiates against.
                  </p>
                </div>
                <Link
                  to="/salary-explorer"
                  className="num shrink-0 border border-accent bg-accent px-6 py-3 text-[12px] tracking-[0.14em] uppercase transition-opacity hover:opacity-90"
                >
                  Contribute a data point
                </Link>
              </div>
            </section>

            <section>
              <SectionHeading>Recent analysis</SectionHeading>
              <div className="mt-6 flex flex-col">
                {articles.map((a) => (
                  <Link
                    key={a.slug}
                    to="/analysis/$slug"
                    params={{ slug: a.slug }}
                    className="group grid grid-cols-12 gap-4 border-b border-border py-6"
                  >
                    <div className="col-span-12 md:col-span-3">
                      <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
                        {a.category}
                      </div>
                      <div className="num mt-1 text-[11px] text-muted-foreground">{a.date}</div>
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      <h3 className="text-[21px] leading-snug text-pretty group-hover:text-accent">
                        {a.title}
                      </h3>
                      <p className="mt-2 max-w-[64ch] text-[13px] leading-relaxed text-muted-foreground">
                        {a.standfirst}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
