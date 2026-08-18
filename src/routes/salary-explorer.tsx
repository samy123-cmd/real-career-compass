import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import { percentiles, distribution, companyRows } from "@/data/career-reality";

export const Route = createFileRoute("/salary-explorer")({
  head: () => ({
    meta: [
      { title: "Salary explorer — percentile benchmarks for Indian tech roles" },
      {
        name: "description",
        content:
          "Percentile salary bands by role, experience and city, with company-level fixed pay, variable pay and notice periods.",
      },
      { property: "og:title", content: "Salary explorer — percentile benchmarks for Indian tech" },
      {
        property: "og:description",
        content:
          "10th, 50th and 90th percentile compensation bands with the distribution behind them.",
      },
    ],
  }),
  component: SalaryExplorer,
});

const filters = [
  { label: "Role: Software engineer", active: true },
  { label: "Experience: 4–6 years", active: false },
  { label: "City: Bengaluru", active: false },
  { label: "Tier: Product + GCC", active: false },
  { label: "Unit: ₹ LPA", active: false },
];

function SalaryExplorer() {
  const max = Math.max(...distribution.map((d) => d.count));

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <header className="border-b border-rule pb-8">
          <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
            Data explorer · 216 verified submissions
          </div>
          <h1 className="mt-3 max-w-[28ch] text-[40px] leading-[1.06] tracking-tight md:text-[52px]">
            Salary explorer
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.label}
                type="button"
                className={
                  f.active
                    ? "num border border-foreground bg-foreground px-3 py-1.5 text-[11px] text-primary-foreground"
                    : "num border border-border bg-card px-3 py-1.5 text-[11px] transition-colors hover:border-foreground"
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <section className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {percentiles.map((p) => (
            <div
              key={p.label}
              className={
                p.emphasis
                  ? "border-l-2 border-accent pl-5"
                  : "border-l-2 border-border pl-5"
              }
            >
              <div
                className={
                  p.emphasis
                    ? "num text-[10px] tracking-[0.14em] text-accent uppercase"
                    : "label-xs"
                }
              >
                {p.label}
              </div>
              <div className="num mt-2 text-[34px] leading-none">
                {p.value.toFixed(1)}
                <span className="ml-1.5 text-[13px] text-muted-foreground">LPA</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <SectionHeading>Distribution · total CTC, ₹ lakh</SectionHeading>
          <div className="mt-8 flex h-56 items-end gap-2 border-b border-foreground">
            {distribution.map((d) => (
              <div key={d.bucket} className="group flex flex-1 flex-col items-center justify-end gap-2">
                <span className="num text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {d.count}
                </span>
                <div
                  className="w-full bg-foreground/85 transition-colors group-hover:bg-accent"
                  style={{ height: `${(d.count / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {distribution.map((d) => (
              <span key={d.bucket} className="num flex-1 text-center text-[10px] text-muted-foreground">
                {d.bucket}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading>Company-level submissions</SectionHeading>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-foreground">
                  <th className="label-xs py-2.5 pr-4 font-normal">Company</th>
                  <th className="label-xs px-4 py-2.5 font-normal">Role</th>
                  <th className="label-xs px-4 py-2.5 text-right font-normal">Fixed</th>
                  <th className="label-xs px-4 py-2.5 text-right font-normal">Variable</th>
                  <th className="label-xs px-4 py-2.5 font-normal">Notice</th>
                  <th className="label-xs py-2.5 pl-4 text-right font-normal">Total CTC</th>
                </tr>
              </thead>
              <tbody>
                {companyRows.map((r) => (
                  <tr key={r.company} className="border-b border-border transition-colors hover:bg-secondary">
                    <td className="py-4 pr-4 text-[14px] font-semibold">{r.company}</td>
                    <td className="px-4 py-4 text-[13px] text-muted-foreground">{r.role}</td>
                    <td className="num px-4 py-4 text-right text-[13px]">{r.fixed.toFixed(1)}</td>
                    <td className="num px-4 py-4 text-right text-[13px]">{r.variable.toFixed(1)}</td>
                    <td className="num px-4 py-4 text-[12px] text-muted-foreground">{r.notice}</td>
                    <td className="num py-4 pl-4 text-right text-[14px] font-medium">
                      {r.total.toFixed(1)} LPA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-[70ch] text-[12px] leading-relaxed text-muted-foreground">
            Submissions are voluntary and skew toward product companies and captives in
            metros. Cohorts below twenty entries are withheld rather than published with
            a wide error band.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
