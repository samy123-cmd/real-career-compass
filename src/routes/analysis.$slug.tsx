import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import { getPost } from "@/lib/posts.functions";
import { formatDate, readingTime } from "@/lib/slug";

export const Route = createFileRoute("/analysis/$slug")({
  loader: async ({ params }) => {
    const result = await getPost({ data: { slug: params.slug } });
    if (!result.post) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) {
      return {
        meta: [
          { title: "Analysis unavailable — Career Reality" },
          { name: "description", content: "This analysis is not currently published." },
          { property: "og:title", content: "Analysis unavailable — Career Reality" },
          { property: "og:description", content: "This analysis is not currently published." },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const post = loaderData.post;
    return {
      meta: [
        { title: `${post.title} — Career Reality` },
        { name: "description", content: post.standfirst.slice(0, 158) },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.standfirst.slice(0, 158) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[68ch] px-4 py-20 md:px-8">
        <h1 className="text-[30px] leading-tight">This piece didn't load</h1>
        <Link to="/analysis" className="num mt-6 inline-block border border-foreground px-5 py-2.5 text-[11px] tracking-[0.14em] uppercase">
          All analysis
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
  notFoundComponent: AnalysisNotFound,
  component: AnalysisPage,
});

function AnalysisNotFound() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-20 md:px-8">
        <h1 className="text-[32px] leading-tight md:text-[36px]">This analysis isn't published.</h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
          It may have been withdrawn pending a correction, or deleted by its author.
        </p>
        <Link
          to="/analysis"
          className="num mt-8 inline-block border border-foreground px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-primary-foreground"
        >
          All analysis
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

type KeyFigure = { label: string; value: string };

function AnalysisPage() {
  const { post, more } = Route.useLoaderData();
  if (!post) return <AnalysisNotFound />;

  const figures: KeyFigure[] = Array.isArray(post.key_figures)
    ? (post.key_figures as KeyFigure[]).filter((f) => f && f.label && f.value)
    : [];
  const paragraphs = post.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-8 md:py-12">
        <article className="mx-auto max-w-[68ch]">
          <div className="num flex flex-wrap items-center gap-3 text-[10px] tracking-[0.14em] uppercase">
            <span className="text-accent">{post.category}</span>
            <span className="text-muted-foreground">{formatDate(post.published_at)}</span>
            <span className="text-muted-foreground">{readingTime(post.body)}</span>
          </div>
          <h1 className="mt-5 text-[30px] leading-[1.1] tracking-tight text-balance md:text-[46px]">
            {post.title}
          </h1>
          <p className="mt-6 border-l-2 border-accent pl-4 text-[16px] leading-relaxed text-muted-foreground md:pl-5 md:text-[17px]">
            {post.standfirst}
          </p>
          <div className="num mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-rule py-3 text-[11px] text-muted-foreground uppercase">
            <span>{post.author_name}</span>
            <span>·</span>
            <span>Reviewed {formatDate(post.published_at)}</span>
          </div>

          {figures.length > 0 && (
            <dl className="my-10 grid grid-cols-1 gap-6 border-b border-rule pb-8 sm:grid-cols-3">
              {figures.map((f) => (
                <div key={f.label}>
                  <dt className="label-xs">{f.label}</dt>
                  <dd className="num mt-2 text-[24px] leading-none md:text-[26px]">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-col gap-6">
            {paragraphs.map((p, i) => (
              <p
                key={p.slice(0, 30)}
                className={
                  i === 0
                    ? "text-[16px] leading-[1.75] first-letter:float-left first-letter:mt-1 first-letter:mr-2 first-letter:font-serif first-letter:text-[52px] first-letter:leading-[0.8] md:text-[17px]"
                    : "text-[16px] leading-[1.75] md:text-[17px]"
                }
              >
                {p}
              </p>
            ))}
          </div>

          {post.methodology && (
            <section className="mt-12 border border-border bg-card p-5 md:p-6">
              <h2 className="label-xs">Methodology</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {post.methodology}
              </p>
            </section>
          )}
        </article>

        {more.length > 0 && (
          <section className="mx-auto mt-16 max-w-[68ch]">
            <SectionHeading>More analysis</SectionHeading>
            <div className="mt-4 flex flex-col">
              {more.map((a) => (
                <Link
                  key={a.slug}
                  to="/analysis/$slug"
                  params={{ slug: a.slug }}
                  className="group border-b border-border py-5"
                >
                  <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
                    {a.category} · {formatDate(a.published_at)}
                  </div>
                  <h3 className="mt-1.5 text-[18px] leading-snug text-pretty group-hover:text-accent md:text-[19px]">
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
