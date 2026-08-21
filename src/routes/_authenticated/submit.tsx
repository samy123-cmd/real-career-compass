import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav, SiteFooter, SectionHeading } from "@/components/site/SiteChrome";
import { createPost } from "@/lib/posts.functions";
import { getMyProfile } from "@/lib/salary.functions";

export const Route = createFileRoute("/_authenticated/submit")({
  head: () => ({
    meta: [
      { title: "Write an analysis — Career Reality" },
      {
        name: "description",
        content: "Publish your own career or compensation analysis with a methodology note.",
      },
      { property: "og:title", content: "Write an analysis — Career Reality" },
      { property: "og:description", content: "Publish career analysis under your own byline." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmitPost,
});

const field =
  "w-full border border-border bg-card px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-foreground";
const categories = ["Salary reality", "Money reality", "Career risk", "Hiring reality"];

function SubmitPost() {
  const navigate = useNavigate();
  const publish = useServerFn(createPost);
  const fetchProfile = useServerFn(getMyProfile);
  const profile = useQuery({ queryKey: ["my-profile"], queryFn: () => fetchProfile() });

  const [form, setForm] = useState({
    title: "",
    standfirst: "",
    category: categories[0]!,
    body: "",
    methodology: "",
    authorName: "",
  });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () =>
      publish({
        data: {
          title: form.title,
          standfirst: form.standfirst,
          category: form.category,
          body: form.body,
          methodology: form.methodology || undefined,
          authorName: form.authorName || profile.data?.display_name || "Member",
        },
      }),
    onSuccess: (res) => navigate({ to: "/analysis/$slug", params: { slug: res.slug } }),
    onError: (e) =>
      setError(
        e instanceof Error
          ? "Check the lengths: a title needs 8+ characters, the standfirst 20+, and the body at least 200."
          : "Could not publish.",
      ),
  });

  const words = form.body.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1240px] px-4 py-8 md:px-8 md:py-12">
        <header className="border-b border-rule pb-6">
          <div className="num text-[10px] tracking-[0.14em] text-accent uppercase">Contribute</div>
          <h1 className="mt-2 text-[30px] leading-tight tracking-tight md:text-[40px]">
            Write an analysis
          </h1>
          <p className="mt-4 max-w-[64ch] text-[14px] leading-relaxed text-muted-foreground">
            House style: a claim, the numbers behind it, and how you got them. Say what
            your sample is and where it is thin — the methodology note is what separates
            this from a LinkedIn post.
          </p>
        </header>

        <form
          className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-5 lg:col-span-8">
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Headline</span>
              <input
                className={field}
                required
                minLength={8}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="The hike cycle nobody plans for"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Standfirst</span>
              <textarea
                className={`${field} min-h-24`}
                required
                minLength={20}
                value={form.standfirst}
                onChange={(e) => setForm({ ...form, standfirst: e.target.value })}
                placeholder="One or two sentences stating the finding and its size."
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Body · blank line between paragraphs</span>
              <textarea
                className={`${field} min-h-[420px] leading-relaxed`}
                required
                minLength={200}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
              <span className="num text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                {words} words · {form.body.length}/200 characters minimum
              </span>
            </label>
          </div>

          <aside className="flex flex-col gap-5 lg:col-span-4">
            <SectionHeading>Publication details</SectionHeading>
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Category</span>
              <select
                className={field}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Byline</span>
              <input
                className={field}
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                placeholder={profile.data?.display_name ?? "Your name"}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-xs">Methodology note</span>
              <textarea
                className={`${field} min-h-32`}
                value={form.methodology}
                onChange={(e) => setForm({ ...form, methodology: e.target.value })}
                placeholder="Sample size, how it was collected, what it excludes."
              />
            </label>
            {error && <p className="text-[13px] text-accent">{error}</p>}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="num border border-foreground bg-foreground px-5 py-3 text-[12px] tracking-[0.14em] text-primary-foreground uppercase hover:border-accent hover:bg-accent disabled:opacity-50"
            >
              {mutation.isPending ? "Publishing…" : "Publish now"}
            </button>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Published immediately under your byline. You can delete it from your ledger
              at any time.
            </p>
          </aside>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
