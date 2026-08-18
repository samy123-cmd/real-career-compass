# Career Reality — best-in-class alternative

A research-grade career intelligence site for Indian tech: honest salary data, risk analysis, company intel. The feel is a paid research terminal crossed with FT/Economist data journalism — dense, precise, quietly expensive. No emoji feature cards, no gradient hero, no generic "Get started".

## Design system

- Palette: paper `#F9F8F6`, ink `#121212`, muted grey, single signal accent `#C84B31` used only for severity/live states. Ruled hairlines instead of card shadows.
- Type: Playfair Display (editorial headlines) + Inter (UI) + JetBrains Mono (all numerals, tabular figures).
- Sharp corners, 1px borders, generous whitespace around dense data blocks. Restrained motion: ticker scroll, row hover, number tick-in only.

## Screens (mockups, static realistic data)

1. **Home / Terminal** — live salary ticker in the nav; left rail with the Career Reality Index (composite score + salary pressure, switch difficulty, layoff risk bars) and tool links; main column with a hero benchmark table (role · years · city · fixed · total LPA), anonymous-submission band, and recent analysis list with category + date.
2. **Salary Explorer** — filter chips (role, experience, city, currency), 25th/50th/90th percentile bands with interpretation notes, distribution chart, and a company-level table incl. variable pay and notice period.
3. **CTC Decoder** — input CTC and components, output monthly in-hand with PF, gratuity, and tax breakdown as a ruled ledger.
4. **Layoff Radar** — company stability table with signal severity, plus a timeline of tracked events.
5. **Article page** — editorial reading layout: standfirst, byline, methodology note, pull data, correction log.

## Technical notes

- TanStack Start routes: `/` (index), `/salary-explorer`, `/ctc-decoder`, `/layoff-radar`, `/analysis/$slug`.
- Tokens go into `src/styles.css` as oklch semantic variables; fonts loaded via `<link>` in `src/routes/__root.tsx`.
- Shared components: `IndexGauge`, `SalaryTicker`, `DataTable`, `PercentileBand`, `AnalysisList`, `SiteNav`, `SiteFooter`.
- All data is typed static fixtures in `src/data/` — no backend in this pass, so numbers are realistic mock data. Say the word and I'll wire it to Lovable Cloud later.
- Per-route `head()` with unique title/description/og tags.

## Not included

No auth, no payments/Pro subscription flow, no live data ingestion.
