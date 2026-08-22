import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { tickerRows } from "@/data/career-reality";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/", label: "Terminal" },
  { to: "/salary-explorer", label: "Salary explorer" },
  { to: "/ctc-decoder", label: "CTC decoder" },
  { to: "/layoff-radar", label: "Layoff radar" },
  { to: "/analysis", label: "Analysis" },
] as const;

function TickerRun() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {tickerRows.map((r) => (
        <span key={r.role + r.org} className="num flex items-center gap-2 text-[11px] whitespace-nowrap">
          <span className="text-muted-foreground uppercase">
            {r.role} · {r.org} · {r.city}
          </span>
          <span>{r.lpa.toFixed(1)}L</span>
          <span className={r.delta > 0 ? "text-positive" : r.delta < 0 ? "text-accent" : "text-muted-foreground"}>
            {r.delta > 0 ? "+" : ""}
            {r.delta.toFixed(1)}%
          </span>
        </span>
      ))}
    </div>
  );
}

export function SalaryTicker() {
  return (
    <div className="flex h-7 items-center gap-3 overflow-hidden border-b border-rule bg-foreground px-4 text-primary-foreground">
      <span className="num shrink-0 text-[10px] tracking-[0.14em] text-accent uppercase">Live</span>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-ticker flex w-max">
          <TickerRun />
          <TickerRun />
        </div>
      </div>
    </div>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background">
      <SalaryTicker />
      <div className="flex h-14 items-center justify-between border-b border-rule px-4 md:px-8">
        <div className="flex items-baseline gap-8">
          <Link to="/" className="font-serif text-lg leading-none tracking-tight md:text-xl">
            Career<span className="italic text-accent">Reality</span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className: "text-foreground underline decoration-accent decoration-2 underline-offset-[6px]",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="num hidden text-[10px] text-muted-foreground uppercase xl:inline">
            Data v2.04.1 · Aug 2026
          </span>
          <ThemeToggle />
          <Link
            to={isAuthenticated ? "/dashboard" : "/auth"}
            className="num hidden border border-foreground bg-foreground px-3 py-1.5 text-[11px] tracking-[0.08em] text-primary-foreground uppercase transition-colors hover:border-accent hover:bg-accent sm:inline-block"
          >
            {isAuthenticated ? "Your ledger" : "Create account"}
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="num border border-rule px-2.5 py-1.5 text-[10px] tracking-[0.12em] uppercase lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-b border-rule bg-background lg:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              onClick={() => setOpen(false)}
              className="border-b border-border px-4 py-3.5 text-[15px]"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to={isAuthenticated ? "/dashboard" : "/auth"}
            onClick={() => setOpen(false)}
            className="num bg-foreground px-4 py-4 text-[12px] tracking-[0.14em] text-primary-foreground uppercase"
          >
            {isAuthenticated ? "Your ledger" : "Create a free account"}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule px-4 py-10 md:mt-24 md:px-8">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="font-serif text-lg">
            Career<span className="italic text-accent">Reality</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Independent compensation and career-risk research for Indian technology
            professionals. Editorial conclusions are not for sale.
          </p>
        </div>
        <div className="flex flex-wrap gap-10 md:gap-12">
          <nav className="flex flex-col gap-2">
            <span className="label-xs">Tools</span>
            <Link to="/salary-explorer" className="text-[13px] hover:text-accent">
              Salary explorer
            </Link>
            <Link to="/ctc-decoder" className="text-[13px] hover:text-accent">
              CTC decoder
            </Link>
            <Link to="/layoff-radar" className="text-[13px] hover:text-accent">
              Layoff radar
            </Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <span className="label-xs">Newsroom</span>
            <Link to="/analysis" className="text-[13px] hover:text-accent">
              Analysis
            </Link>
            <Link to="/submit" className="text-[13px] hover:text-accent">
              Write for us
            </Link>
            <Link to="/auth" className="text-[13px] hover:text-accent">
              Member account
            </Link>
          </nav>
          <nav className="flex flex-col gap-2">
            <span className="label-xs">Standards</span>
            <span className="text-[13px] text-muted-foreground">Methodology</span>
            <span className="text-[13px] text-muted-foreground">Correction log</span>
            <span className="text-[13px] text-muted-foreground">Privacy protocol</span>
          </nav>
        </div>
      </div>
      <div className="num mx-auto mt-10 max-w-[1240px] border-t border-rule pt-4 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        © 2026 Career Reality · Sample sizes published with every figure
      </div>
    </footer>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="label-xs border-b border-rule pb-2">{children}</h2>;
}
