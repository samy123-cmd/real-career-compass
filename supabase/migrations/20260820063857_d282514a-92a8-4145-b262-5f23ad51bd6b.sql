GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.salary_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salary_entries TO authenticated;
GRANT ALL ON public.salary_entries TO service_role;