import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createPublicClient } from "@/lib/supabase-public.server";
import { slugify } from "@/lib/slug";

const POST_COLUMNS =
  "id, slug, title, standfirst, body, category, author_name, methodology, key_figures, published_at";

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(50);
  if (error) return { posts: [], error: "Articles are temporarily unavailable." };
  return { posts: data ?? [], error: null as string | null };
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { data: post } = await supabase
      .from("posts")
      .select(POST_COLUMNS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    const { data: more } = await supabase
      .from("posts")
      .select("slug, title, category, published_at")
      .eq("is_published", true)
      .neq("slug", data.slug)
      .order("published_at", { ascending: false })
      .limit(4);
    return { post: post ?? null, more: more ?? [] };
  });

export const listMyPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("posts")
      .select("id, slug, title, category, is_published, published_at")
      .eq("author_id", context.userId)
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().min(8).max(160),
        standfirst: z.string().min(20).max(400),
        body: z.string().min(200),
        category: z.string().min(2).max(40),
        methodology: z.string().max(1200).optional(),
        authorName: z.string().min(2).max(60),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const slug = `${slugify(data.title)}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await context.supabase.from("posts").insert({
      slug,
      title: data.title,
      standfirst: data.standfirst,
      body: data.body,
      category: data.category,
      methodology: data.methodology ?? null,
      author_id: context.userId,
      author_name: data.authorName,
      is_published: true,
    });
    if (error) throw new Error(error.message);
    return { slug };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
