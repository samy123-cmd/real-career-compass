import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";
import { listPosts } from "@/lib/posts.functions";
import { formatDate, readingTime } from "@/lib/slug";

const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: () => listPosts(),
});

export const Route = createFileRoute("/analysis/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Analysis — salary, hiring and career-risk reporting for Indian tech" },
      {
        name: "description",
        content:
          "Reported analysis on Indian tech pay: what roles actually pay, why CTC misleads, notice-period leverage, city cost adjustments and the AI hiring shift.",
      },
      { property: "og:title", content: "Career Reality analysis" },
      {
        property: "og:description",
        content: "Reported career and compensation analysis, each piece published with its methodology.",
      },
    ],
  }),
  errorComponent: () => (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[68ch] px-4 py-20 md:px-8">
        <h1 className="text-[30px] leading-tight">Analysis didn't load</h1>
        <p className="mt-3 text-[14px] text-muted-foreground">
          Refresh in a moment — the archive is still there.
        </p>
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
  component: AnalysisIndex,
});

function AnalysisIndex() {
  const { data } = useSuspenseQuery(postsQuery);
  const posts = data.posts;
  const [lead, ...rest] = posts;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-8 md:px-8 md:py-12">
        <header className="border-b border-rule pb-6">
          <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
            Analysis · {posts.length} published
          </div>
          <h1 className="mt-3 max-w-[24ch] text-[34px] leading-[1.06] tracking-tight md:text-[52px]">
            Reporting, not takes.
          </h1>
          <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
            Every piece states its sample, its method and what it cannot show. Members
            publish here too — with the same requirement.
          </p>
          <Link
            to="/submit"
            className="num mt-6 inline-block border border-foreground px-5 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-colors hover:bg-foreground hover:text-primary-foreground"
          >
            Write an analysis
          </Link>
        </header>

        {data.error && (
          <p className="mt-8 border border-accent px-4 py-3 text-[13px] text-accent">{data.error}</p>
        )}

        {lead && (
          <Link
            to="/analysis/$slug"
            params={{ slug: lead.slug }}
            className="group mt-10 block border-b border-rule pb-10"
          >
            <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
              {lead.category} · {formatDate(lead.published_at)}
            </div>
            <h2 className="mt-3 max-w-[30ch] text-[28px] leading-[1.1] text-balance group-hover:text-accent md:text-[40px]">
              {lead.title}
            </h2>
            <p className="mt-4 max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground">
              {lead.standfirst}
            </p>
            <div className="num mt-4 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {lead.author_name} · {readingTime(lead.body)}
            </div>
          </Link>
        )}

        <div className="mt-2 flex flex-col">
          {rest.map((a) => (
            <Link
              key={a.slug}
              to="/analysis/$slug"
              params={{ slug: a.slug }}
              className="group grid grid-cols-1 gap-2 border-b border-border py-6 md:grid-cols-12 md:gap-6"
            >
              <div className="md:col-span-3">
                <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">
                  {a.category}
                </div>
                <div className="num mt-1 text-[11px] text-muted-foreground">
                  {formatDate(a.published_at)} · {readingTime(a.body)}
                </div>
              </div>
              <div className="md:col-span-9">
                <h3 className="text-[19px] leading-snug text-pretty group-hover:text-accent md:text-[22px]">
                  {a.title}
                </h3>
                <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-muted-foreground">
                  {a.standfirst}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
