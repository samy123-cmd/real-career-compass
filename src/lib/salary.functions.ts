import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createPublicClient } from "@/lib/supabase-public.server";

const entrySchema = z.object({
  roleTitle: z.string().min(2).max(80),
  level: z.string().max(40).optional(),
  company: z.string().max(80).optional(),
  city: z.string().min(2).max(60),
  employerTier: z.enum(["Product", "GCC", "Services", "Consumer"]),
  experienceYears: z.number().min(0).max(45),
  fixedLpa: z.number().min(0).max(2000),
  variableLpa: z.number().min(0).max(2000),
  noticeDays: z.number().int().min(0).max(180),
  isPublic: z.boolean(),
  note: z.string().max(400).optional(),
});

export const listPublicSalaries = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("salary_entries")
    .select(
      "id, role_title, level, company, city, employer_tier, experience_years, fixed_lpa, variable_lpa, total_lpa, notice_days, created_at",
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) return { entries: [], error: "Live submissions are temporarily unavailable." };
  return { entries: data ?? [], error: null as string | null };
});

export const listMySalaries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("salary_entries")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const addSalaryEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => entrySchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("salary_entries").insert({
      user_id: context.userId,
      role_title: data.roleTitle,
      level: data.level ?? null,
      company: data.company ?? null,
      city: data.city,
      employer_tier: data.employerTier,
      experience_years: data.experienceYears,
      fixed_lpa: data.fixedLpa,
      variable_lpa: data.variableLpa,
      total_lpa: data.fixedLpa + data.variableLpa,
      notice_days: data.noticeDays,
      is_public: data.isPublic,
      note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSalaryEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("salary_entries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("id, display_name, headline, city")
      .eq("id", context.userId)
      .maybeSingle();
    return data ?? null;
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        displayName: z.string().min(2).max(60),
        headline: z.string().max(120).optional(),
        city: z.string().max(60).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("profiles").upsert({
      id: context.userId,
      display_name: data.displayName,
      headline: data.headline ?? null,
      city: data.city ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
