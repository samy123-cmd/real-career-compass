-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Member',
  headline TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- SALARY ENTRIES
CREATE TABLE public.salary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  level TEXT,
  company TEXT,
  city TEXT NOT NULL,
  employer_tier TEXT NOT NULL DEFAULT 'Product',
  experience_years NUMERIC(4,1) NOT NULL DEFAULT 0,
  fixed_lpa NUMERIC(6,2) NOT NULL,
  variable_lpa NUMERIC(6,2) NOT NULL DEFAULT 0,
  total_lpa NUMERIC(6,2) NOT NULL,
  notice_days INTEGER NOT NULL DEFAULT 60,
  is_public BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salary_entries TO authenticated;
GRANT SELECT ON public.salary_entries TO anon;
GRANT ALL ON public.salary_entries TO service_role;
ALTER TABLE public.salary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "salary_public_read" ON public.salary_entries FOR SELECT USING (is_public = true);
CREATE POLICY "salary_read_own" ON public.salary_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "salary_insert_own" ON public.salary_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "salary_update_own" ON public.salary_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "salary_delete_own" ON public.salary_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX salary_entries_public_idx ON public.salary_entries (is_public, role_title, city);

-- POSTS
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  author_id UUID REFERENCES auth.users ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Career Reality Desk',
  category TEXT NOT NULL DEFAULT 'Career reality',
  title TEXT NOT NULL,
  standfirst TEXT NOT NULL,
  body TEXT NOT NULL,
  key_figures JSONB NOT NULL DEFAULT '[]'::jsonb,
  methodology TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON public.posts FOR SELECT USING (is_published = true);
CREATE POLICY "posts_read_own" ON public.posts FOR SELECT TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);
CREATE INDEX posts_published_idx ON public.posts (is_published, published_at DESC);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER salary_entries_touch BEFORE UPDATE ON public.salary_entries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- SEED EDITORIAL
INSERT INTO public.posts (slug, category, title, standfirst, body, key_figures, methodology, published_at) VALUES
(
  'india-tech-salary-bands-2026',
  'Salary reality',
  'What Indian tech actually pays in 2026, band by band',
  'Public salary guides disagree by as much as 40% on the same role. Read side by side, they still agree on the shape of the market: a compressed services floor, a wide product middle, and a thin top decile driven by equity.',
  'Every published India compensation guide measures something slightly different. AmbitionBox and Glassdoor aggregate self-reported CTC, which pulls the middle of the distribution upward because people round up and count unvested equity. Recruitment guides from Michael Page, Randstad and Xpheno report offered ranges rather than paid packages, so they read high at the top and thin at the bottom. levels.fyi covers a narrow, product-heavy slice with the most reliable equity data and the least representative sample.

Read together, the bands converge on a familiar structure. Entry-level engineering at large IT services employers still clears in the ₹3.5–7 LPA range, essentially flat in nominal terms for several years. Product companies pay entry roles roughly two to three times that. By the four-to-six year mark, the same job title spans ₹12 LPA at a services firm and ₹45 LPA at a well-funded product company — a spread wider than most people''s entire career progression.

The middle is where negotiation actually matters. Global capability centres — the captive engineering arms of foreign banks, retailers and enterprise software firms — now sit between services and product on cash, but ahead of both on stability and predictability of the variable component. That trade is rarely priced correctly by candidates, who compare headline CTC and ignore that a 20% variable at a consumer internet company is discretionary in a way a GCC bonus usually is not.

At the top, the distribution stops being about salary. Staff-and-above packages at product companies and quant-adjacent firms are equity-weighted, which means the number in the offer letter is a forecast, not a payment. Treat unlisted-company equity as optional income, and the top decile looks considerably closer to the median than the guides suggest.',
  '[{"label":"Entry services band","value":"₹3.5–7 LPA"},{"label":"Same-title spread at 5y","value":"₹12–45 LPA"},{"label":"Top-decile equity share","value":"30–60%"}]'::jsonb,
  'Bands are compiled from published India salary guides and aggregators (AmbitionBox, Glassdoor India, levels.fyi India, and recruiter salary guides), then reconciled against member submissions. Where sources conflict, the wider range is reported rather than an average.',
  now() - interval '2 days'
),
(
  'ctc-versus-in-hand-india',
  'Money reality',
  'Why your ₹28 LPA package pays like ₹1.7 lakh a month',
  'Cost to company is an employer accounting figure. Between the offer letter and your bank account sit variable pay, both halves of provident fund, gratuity provisioning and the tax slab — routinely a quarter of the headline number.',
  'The single most common compensation mistake in Indian tech is treating CTC as salary. Cost to company is exactly what it says: everything the employer books against you, including money you may never receive and money you cannot touch for decades.

Start with variable pay. A 10–20% performance component is standard at product and consumer internet companies. It is paid at company discretion, usually annually, and in a bad year it is the first line to be cut. Model it at zero when you are deciding whether an offer is affordable, and treat it as upside when it lands.

Then provident fund. Both the employee and employer contributions — 12% of basic each — are inside CTC at most companies. That is real money and it compounds tax-efficiently, but it is not spendable this month. Gratuity provisioning, typically 4.81% of basic, is worse: you forfeit it entirely if you leave before five years of continuous service, which most Indian tech employees do.

Tax is the last cut. Under the new regime with the standard deduction, a mid-senior package loses a double-digit percentage to income tax and cess, plus a small state professional tax. Put together, a ₹28 LPA package with a 10% variable and 40% basic lands close to ₹1.7 lakh a month in hand — roughly 76% of what the offer letter advertises.

The practical move is to negotiate on fixed pay and basic, not on CTC. A recruiter can raise your headline number by inflating variable and retention components without changing a rupee of what reaches your account.',
  '[{"label":"Typical variable band","value":"10–20%"},{"label":"Gratuity vesting","value":"5 years"},{"label":"Headline that never lands","value":"~24%"}]'::jsonb,
  'Illustrative figures use the new tax regime with the ₹75,000 standard deduction, employee and employer PF at 12% of basic, gratuity provisioned at 4.81% of basic, and ₹2,400 annual professional tax. Metro HRA exemption, NPS and old-regime deductions are not modelled, so real in-hand can be modestly higher.',
  now() - interval '5 days'
),
(
  'notice-period-negotiation-india',
  'Career risk',
  'The 90-day notice period is a pay cut you agreed to in advance',
  'Long notice periods are standard in Indian IT services and increasingly common elsewhere. They do not just delay your exit — they weaken your position in every negotiation that follows.',
  'Notice periods in India run from 30 days at most product companies to 90 days across large IT services employers, with the occasional 180-day clause in senior or specialised roles. Candidates treat the number as an administrative detail. Hiring managers treat it as a cost.

The reason is quarterly headcount. A manager filling a requisition this quarter is comparing a candidate who can start in four weeks against one who cannot start for three months. The delay carries real risk — budget can be pulled, priorities shift, the requisition can vanish — and that risk gets priced into how aggressively they will stretch for you.

Buyout clauses complicate it further. Some employers will fund a buyout, but many structure it inside the joining bonus, which converts it into a clawback obligation lasting a year or more. If you resign inside that window, you repay money you never really received.

Three things materially help. Raise the notice figure early, in writing, before band discussions conclude. Ask explicitly whether a buyout is funded as a separate non-recoverable payment or folded into a bonus with a clawback. And check your own contract: many notice clauses permit adjustment against accrued leave, which can shorten a 90-day exit by weeks at no cost to anyone.',
  '[{"label":"Services standard","value":"90 days"},{"label":"Product standard","value":"30–60 days"},{"label":"Clawback window","value":"12–18 months"}]'::jsonb,
  'Notice-period norms are drawn from published employment terms and member-submitted offer details. Buyout structures vary by employer and are reported qualitatively rather than as percentages.',
  now() - interval '9 days'
),
(
  'bengaluru-hyderabad-cost-adjusted-pay',
  'Salary reality',
  'Bengaluru pays more. Hyderabad often leaves you with more.',
  'Headline packages in Bengaluru lead the country. Once rent, commute and the cost of a liveable neighbourhood are subtracted, the ranking gets much less obvious.',
  'Bengaluru remains the highest-paying Indian tech market by headline CTC, and it is not close for product and startup roles. Hyderabad, Pune, Gurugram and Chennai trail it — typically by high single digits for comparable roles at comparable employers, more for equity-heavy positions that simply do not exist outside Bengaluru.

Cost erodes most of that lead. Rent near the primary tech corridors is the largest single variable: two-bedroom rents in Bengaluru''s Outer Ring Road belt run well ahead of comparable Hyderabad or Pune corridors, and deposits in Bengaluru are conventionally far higher — often ten months against two or three elsewhere. That deposit is not an expense, but it is capital you cannot deploy.

Commute is the quieter cost. Bengaluru''s corridor congestion is structurally worse than Hyderabad''s, and self-reported one-way commutes differ by roughly twenty minutes for otherwise comparable jobs. Over a year that is several working weeks of unpaid time, and it shows up as attrition rather than as a line in a salary guide.

None of this makes any city the right answer — career optionality in Bengaluru is genuinely higher, and optionality compounds. But if you are comparing two offers, subtract twelve months of rent and commute before you call the bigger number a raise.',
  '[{"label":"Headline gap, BLR lead","value":"high single digits"},{"label":"Deposit norm, BLR","value":"up to 10 months"},{"label":"Commute delta","value":"~20 min each way"}]'::jsonb,
  'City comparisons combine published salary-guide differentials with rental listing medians near primary tech corridors and self-reported commute times from member submissions. Commute figures are unweighted.',
  now() - interval '14 days'
),
(
  'ai-hiring-shift-indian-tech',
  'Career risk',
  'The AI hiring shift is real, but it is not replacing engineers yet',
  'Entry-level requisitions at large employers are down while AI and platform roles command premiums. The risk is not automation — it is a narrowing ladder into the industry.',
  'Two things are simultaneously true in Indian tech hiring. Aggregate fresher intake at the largest IT services employers has fallen sharply from its post-pandemic peak, and compensation for machine-learning, data-platform and inference-infrastructure roles has risen faster than any other category.

That combination is not automation replacing engineers. It is employers reallocating headcount budget away from generic delivery capacity toward a small number of specialised roles, while using AI tooling to hold delivery output flat with fewer new hires. The effect lands hardest on the bottom of the ladder: the standard three-year path from campus hire to independent engineer has fewer seats, and those seats are triaged more aggressively.

For people already in the industry, the risk is not being replaced but being repriced. Roles that are largely ticket-throughput — manual QA, first-line support engineering, routine integration work — are seeing slower increments and thinner internal mobility. Roles that own a system rather than a queue are not.

The defensible position is ownership: a service, a data domain, a reliability budget, a model in production and the evaluation harness around it. Tooling literacy matters less than people assume; being the person accountable for an outcome matters more. Titles follow accountability, and compensation follows titles.',
  '[{"label":"Direction, fresher intake","value":"down"},{"label":"Fastest-rising band","value":"ML / platform"},{"label":"Most exposed work","value":"queue-based roles"}]'::jsonb,
  'Based on published hiring disclosures from listed Indian IT services companies, NASSCOM industry commentary and recruiter salary guides. Trend directions are reported qualitatively; this piece deliberately avoids precise headcount figures that individual sources contradict.',
  now() - interval '20 days'
);