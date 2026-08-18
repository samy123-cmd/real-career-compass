import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import { layoffRows, layoffTimeline, severityLabel } from "@/data/career-reality";

export const Route = createFileRoute("/layoff-radar")({
  head: () => ({
    meta: [
      { title: "Layoff radar — stability signals across Indian tech employers" },
      {
        name: "description",
        content:
          "Tracked hiring freezes, restructurings and stability scores across Indian technology employers, with dated evidence for every signal.",
      },
      { property: "og:title", content: "Layoff radar — employer stability signals, dated and sourced" },
      {
        property: "og:description",
        content:
          "Stability scores and a running timeline of hiring freezes, offer withdrawals and restructurings in Indian tech.",
      },
    ],
  }),
  component: LayoffRadar,
});

function LayoffRadar() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <header className="border-b border-rule pb-8">
          <div className="num flex items-center gap-2 text-[10px] tracking-[0.14em] text-accent uppercase">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            12 events tracked · updated 15 Aug 2026
          </div>
          <h1 className="mt-3 max-w-[26ch] text-[40px] leading-[1.06] tracking-tight md:text-[52px]">
            Layoff radar
          </h1>
          <p className="mt-5 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground">
            Employers are grouped rather than named where a signal rests on a single
            internal source. Every entry carries the evidence and the date we saw it.
          </p>
        </header>

        <section className="mt-12">
          <SectionHeading>Stability scores</SectionHeading>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-foreground">
                  <th className="label-xs py-2.5 pr-4 font-normal">Employer group</th>
                  <th className="label-xs px-4 py-2.5 font-normal">Sector</th>
                  <th className="label-xs px-4 py-2.5 font-normal">Signal</th>
                  <th className="label-xs px-4 py-2.5 font-normal">Risk</th>
                  <th className="label-xs py-2.5 pl-4 text-right font-normal">Stability</th>
                </tr>
              </thead>
              <tbody>
                {layoffRows.map((r) => (
                  <tr key={r.company} className="border-b border-border transition-colors hover:bg-secondary">
                    <td className="py-5 pr-4 align-top">
                      <div className="text-[14px] font-semibold">{r.company}</div>
                      <div className="num mt-1 text-[11px] text-muted-foreground">{r.updated}</div>
                    </td>
                    <td className="px-4 py-5 align-top text-[13px] text-muted-foreground">{r.sector}</td>
                    <td className="max-w-[34ch] px-4 py-5 align-top text-[13px] leading-relaxed">
                      {r.signal}
                    </td>
                    <td className="px-4 py-5 align-top">
                      <span
                        className={
                          r.severity === "high" || r.severity === "elevated"
                            ? "num border border-accent px-2 py-0.5 text-[10px] tracking-[0.12em] text-accent uppercase"
                            : "num border border-border px-2 py-0.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase"
                        }
                      >
                        {severityLabel[r.severity]}
                      </span>
                    </td>
                    <td className="py-5 pl-4 align-top">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-[3px] w-20 bg-secondary">
                          <div
                            className={r.stability < 50 ? "h-full bg-accent" : "h-full bg-foreground"}
                            style={{ width: `${r.stability}%` }}
                          />
                        </div>
                        <span className="num w-6 text-right text-[13px]">{r.stability}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 max-w-[76ch]">
          <SectionHeading>Event timeline</SectionHeading>
          <ol className="mt-6">
            {layoffTimeline.map((e) => (
              <li key={e.title} className="grid grid-cols-12 gap-4 border-b border-border py-6">
                <div className="num col-span-12 text-[11px] text-muted-foreground md:col-span-3">
                  {e.date}
                </div>
                <div className="col-span-12 md:col-span-9">
                  <h3 className="text-[17px] leading-snug text-pretty">{e.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{e.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
