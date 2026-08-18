import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/ctc-decoder")({
  head: () => ({
    meta: [
      { title: "CTC decoder — turn your package into real monthly in-hand" },
      {
        name: "description",
        content:
          "Convert an Indian CTC into monthly in-hand pay with employer PF, gratuity, variable pay and new-regime income tax accounted for.",
      },
      { property: "og:title", content: "CTC decoder — what your package actually pays monthly" },
      {
        property: "og:description",
        content:
          "A ruled ledger showing where every rupee of your CTC goes before it reaches your account.",
      },
    ],
  }),
  component: CtcDecoder,
});

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

/** New-regime slab tax on taxable income, plus 4% cess. */
function slabTax(taxable: number) {
  const slabs: [number, number][] = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.1],
    [1600000, 0.15],
    [2000000, 0.2],
    [2400000, 0.25],
    [Infinity, 0.3],
  ];
  let tax = 0;
  let prev = 0;
  for (const [ceiling, rate] of slabs) {
    if (taxable > prev) {
      tax += (Math.min(taxable, ceiling) - prev) * rate;
      prev = ceiling;
    }
  }
  return tax * 1.04;
}

function CtcDecoder() {
  const [ctcLpa, setCtcLpa] = useState(28);
  const [variablePct, setVariablePct] = useState(10);
  const [basicPct, setBasicPct] = useState(40);

  const ledger = useMemo(() => {
    const ctc = ctcLpa * 100000;
    const variable = (ctc * variablePct) / 100;
    const fixed = ctc - variable;
    const basic = (fixed * basicPct) / 100;
    const employerPf = Math.min(basic, 1800 * 12 / 0.12) * 0.12;
    const gratuity = basic * 0.0481;
    const employeePf = employerPf;
    const grossCash = fixed - employerPf - gratuity;
    const standardDeduction = 75000;
    const taxable = Math.max(0, grossCash - standardDeduction);
    const tax = slabTax(taxable);
    const professionalTax = 2400;
    const annualInHand = grossCash - employeePf - tax - professionalTax;

    return {
      ctc,
      variable,
      fixed,
      basic,
      employerPf,
      gratuity,
      employeePf,
      grossCash,
      tax,
      professionalTax,
      annualInHand,
      monthly: annualInHand / 12,
      leakage: 1 - annualInHand / ctc,
    };
  }, [ctcLpa, variablePct, basicPct]);

  const rows: { label: string; value: number; sub: string; negative?: boolean }[] = [
    { label: "Cost to company", value: ledger.ctc, sub: "The number in the offer letter" },
    {
      label: "Performance variable",
      value: -ledger.variable,
      sub: "Paid at company discretion, usually annually",
      negative: true,
    },
    {
      label: "Employer PF contribution",
      value: -ledger.employerPf,
      sub: "Yours, but locked until withdrawal",
      negative: true,
    },
    {
      label: "Gratuity provision",
      value: -ledger.gratuity,
      sub: "Forfeited if you leave before five years",
      negative: true,
    },
    { label: "Gross cash salary", value: ledger.grossCash, sub: "What payroll actually processes" },
    {
      label: "Employee PF",
      value: -ledger.employeePf,
      sub: "12% of basic, deducted monthly",
      negative: true,
    },
    {
      label: "Income tax + cess",
      value: -ledger.tax,
      sub: "New regime, ₹75,000 standard deduction",
      negative: true,
    },
    { label: "Professional tax", value: -ledger.professionalTax, sub: "State levy", negative: true },
  ];

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <header className="border-b border-rule pb-8">
          <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">Instrument 01</div>
          <h1 className="mt-3 max-w-[26ch] text-[40px] leading-[1.06] tracking-tight md:text-[52px]">
            CTC decoder
          </h1>
          <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
            A package is not a salary. Enter the three numbers recruiters gloss over and
            see what lands in your account each month.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-12 gap-12">
          <section className="col-span-12 lg:col-span-4">
            <SectionHeading>Inputs</SectionHeading>
            <div className="mt-6 flex flex-col gap-8">
              <label className="block">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium">Total CTC</span>
                  <span className="num text-[13px]">{ctcLpa.toFixed(1)} LPA</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={120}
                  step={0.5}
                  value={ctcLpa}
                  onChange={(e) => setCtcLpa(Number(e.target.value))}
                  className="mt-3 w-full accent-[oklch(0.552_0.152_33.5)]"
                />
              </label>
              <label className="block">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium">Variable component</span>
                  <span className="num text-[13px]">{variablePct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={variablePct}
                  onChange={(e) => setVariablePct(Number(e.target.value))}
                  className="mt-3 w-full accent-[oklch(0.552_0.152_33.5)]"
                />
              </label>
              <label className="block">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium">Basic as share of fixed</span>
                  <span className="num text-[13px]">{basicPct}%</span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={60}
                  step={1}
                  value={basicPct}
                  onChange={(e) => setBasicPct(Number(e.target.value))}
                  className="mt-3 w-full accent-[oklch(0.552_0.152_33.5)]"
                />
              </label>
            </div>

            <div className="mt-10 border border-foreground bg-foreground px-6 py-7 text-primary-foreground">
              <div className="num text-[10px] tracking-[0.14em] uppercase opacity-60">
                Monthly in-hand
              </div>
              <div className="num mt-2 text-[38px] leading-none">{inr(ledger.monthly)}</div>
              <div className="mt-4 border-t border-primary-foreground/15 pt-4 text-[12px] leading-relaxed opacity-70">
                {(ledger.leakage * 100).toFixed(1)}% of the headline package never reaches
                your bank account this year.
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-8">
            <SectionHeading>Ledger · annual</SectionHeading>
            <table className="mt-6 w-full border-collapse text-left">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-border">
                    <td className="py-4 pr-4">
                      <div className="text-[14px] font-medium">{r.label}</div>
                      <div className="mt-1 text-[12px] text-muted-foreground">{r.sub}</div>
                    </td>
                    <td
                      className={
                        r.negative
                          ? "num py-4 text-right text-[14px] whitespace-nowrap text-accent"
                          : "num py-4 text-right text-[14px] whitespace-nowrap"
                      }
                    >
                      {r.negative ? "−" : ""}
                      {inr(Math.abs(r.value))}
                    </td>
                  </tr>
                ))}
                <tr className="border-b-2 border-foreground">
                  <td className="py-5 pr-4 text-[15px] font-semibold">Annual in-hand</td>
                  <td className="num py-5 text-right text-[18px] font-semibold whitespace-nowrap">
                    {inr(ledger.annualInHand)}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-5 max-w-[70ch] text-[12px] leading-relaxed text-muted-foreground">
              Assumes the new tax regime, a ₹75,000 standard deduction, employee and
              employer provident fund at 12% of basic, gratuity provisioned at 4.81% of
              basic, and ₹2,400 annual professional tax. Metro HRA exemptions, NPS and
              old-regime deductions are not modelled — treat this as a floor, not advice.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
