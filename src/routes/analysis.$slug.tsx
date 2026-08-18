import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import { articles } from "@/data/career-reality";

export const Route = createFileRoute("/analysis/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Analysis unavailable — Career Reality" }, { name: "robots", content: "noindex" }],
      };
    }
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} — Career Reality` },
        { name: "description", content: article.standfirst },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.standfirst },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: AnalysisNotFound,
  component: AnalysisPage,
});

function AnalysisNotFound() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-24 md:px-8">
        <h1 className="text-[36px] leading-tight">This analysis isn't published.</h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
          It may have been withdrawn pending a correction. The current index and
          benchmarks remain available.
        </p>
        <Link to="/" className="num mt-8 inline-block border border-foreground px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-primary-foreground">
          Back to the terminal
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function AnalysisPage() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-12 md:px-8">
        <article className="mx-auto max-w-[68ch]">
          <div className="num flex flex-wrap items-center gap-3 text-[10px] tracking-[0.14em] uppercase">
            <span className="text-accent">{article.category}</span>
            <span className="text-muted-foreground">{article.date}</span>
            <span className="text-muted-foreground">{article.readingTime}</span>
          </div>
          <h1 className="mt-5 text-[38px] leading-[1.1] tracking-tight text-balance md:text-[46px]">
            {article.title}
          </h1>
          <p className="mt-6 border-l-2 border-accent pl-5 text-[17px] leading-relaxed text-muted-foreground">
            {article.standfirst}
          </p>
          <div className="num mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-rule py-3 text-[11px] text-muted-foreground uppercase">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.reviewed}</span>
          </div>

          <dl className="my-10 grid grid-cols-1 gap-6 border-b border-rule pb-8 sm:grid-cols-3">
            {article.keyFigures.map((f) => (
              <div key={f.label}>
                <dt className="label-xs">{f.label}</dt>
                <dd className="num mt-2 text-[26px] leading-none">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-6">
            {article.body.map((p, i) => (
              <p
                key={p.slice(0, 24)}
                className={
                  i === 0
                    ? "text-[17px] leading-[1.75] first-letter:float-left first-letter:mt-1 first-letter:mr-2 first-letter:font-serif first-letter:text-[52px] first-letter:leading-[0.8]"
                    : "text-[17px] leading-[1.75]"
                }
              >
                {p}
              </p>
            ))}
          </div>

          <section className="mt-12 border border-border bg-card p-6">
            <h2 className="label-xs">Methodology</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {article.methodology}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="label-xs border-b border-rule pb-2">Correction log</h2>
            {article.corrections.length === 0 ? (
              <p className="mt-3 text-[13px] text-muted-foreground">
                No corrections have been issued for this piece.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {article.corrections.map((c) => (
                  <li key={c.date} className="flex gap-4">
                    <span className="num shrink-0 text-[11px] text-accent">{c.date}</span>
                    <span className="text-[13px] leading-relaxed text-muted-foreground">{c.note}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </article>

        <section className="mx-auto mt-20 max-w-[68ch]">
          <SectionHeading>More analysis</SectionHeading>
          <div className="mt-4 flex flex-col">
            {related.map((a) => (
              <Link
                key={a.slug}
                to="/analysis/$slug"
                params={{ slug: a.slug }}
                className="group border-b border-border py-5"
              >
                <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
                  {a.category} · {a.date}
                </div>
                <h3 className="mt-1.5 text-[19px] leading-snug text-pretty group-hover:text-accent">
                  {a.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
