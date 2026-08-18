export type Severity = "low" | "moderate" | "elevated" | "high";

export const realityIndex = {
  score: 61,
  verdict: "Elevated pressure",
  month: "August 2026",
  revision: "2.04.1",
  note: "Composite of 210+ verified compensation submissions, 12 tracked layoff events and hiring-velocity signals across seven Indian metros.",
  components: [
    {
      label: "Salary pressure",
      value: 72,
      severity: "high" as Severity,
      note: "Median offers flat in nominal terms for three quarters while rent-adjusted costs rose.",
    },
    {
      label: "Switch difficulty",
      value: 62,
      severity: "elevated" as Severity,
      note: "Loops lengthened to a median 5.2 rounds; 41% of offers now carry a bond or clawback clause.",
    },
    {
      label: "Layoff risk",
      value: 49,
      severity: "moderate" as Severity,
      note: "Concentrated in late-stage consumer internet; GCC captives remain comparatively stable.",
    },
  ],
};

export const tickerRows = [
  { role: "Staff Engineer", org: "Atlassian", city: "BLR", lpa: 74.0, delta: 4.1 },
  { role: "SDE III", org: "Zomato", city: "GGN", lpa: 54.0, delta: 2.2 },
  { role: "Product Manager", org: "Razorpay", city: "BLR", lpa: 42.5, delta: -1.4 },
  { role: "Data Engineer", org: "PhonePe", city: "PUN", lpa: 28.4, delta: 0.0 },
  { role: "SRE II", org: "Flipkart", city: "BLR", lpa: 36.8, delta: 1.9 },
  { role: "Associate", org: "Goldman Sachs", city: "BLR", lpa: 45.0, delta: 3.4 },
  { role: "Design Lead", org: "Swiggy", city: "BLR", lpa: 39.2, delta: -0.8 },
  { role: "ML Engineer", org: "Sarvam AI", city: "BLR", lpa: 48.0, delta: 6.7 },
];

export const benchmarkRows = [
  {
    role: "Staff Software Engineer",
    years: "11–13y",
    city: "Bengaluru",
    tier: "Product",
    fixed: 62.0,
    total: 74.0,
    sample: 34,
  },
  {
    role: "Senior Software Engineer",
    years: "7–9y",
    city: "Bengaluru",
    tier: "GCC",
    fixed: 36.5,
    total: 41.0,
    sample: 58,
  },
  {
    role: "Engineering Manager",
    years: "10–12y",
    city: "Hyderabad",
    tier: "GCC",
    fixed: 44.0,
    total: 52.5,
    sample: 21,
  },
  {
    role: "SDE II",
    years: "4–6y",
    city: "Pune",
    tier: "Product",
    fixed: 24.0,
    total: 27.5,
    sample: 47,
  },
  {
    role: "Data Scientist II",
    years: "4–5y",
    city: "Gurugram",
    tier: "Consumer",
    fixed: 26.0,
    total: 30.0,
    sample: 29,
  },
  {
    role: "SDE I",
    years: "0–2y",
    city: "Chennai",
    tier: "Services",
    fixed: 9.5,
    total: 10.2,
    sample: 63,
  },
];

export const percentiles = [
  {
    label: "10th percentile",
    value: 18.4,
    note: "Services firms and regional captives. Often paired with 90-day notice and a training bond.",
    emphasis: false,
  },
  {
    label: "50th percentile — median",
    value: 28.0,
    note: "Current equilibrium for five years of experience in Bengaluru product companies.",
    emphasis: true,
  },
  {
    label: "90th percentile",
    value: 54.2,
    note: "Trading firms, late-stage unicorns and niche infrastructure roles. RSU-heavy.",
    emphasis: false,
  },
];

export const distribution = [
  { bucket: "10–15", count: 11 },
  { bucket: "15–20", count: 26 },
  { bucket: "20–25", count: 41 },
  { bucket: "25–30", count: 52 },
  { bucket: "30–35", count: 38 },
  { bucket: "35–40", count: 24 },
  { bucket: "40–50", count: 14 },
  { bucket: "50–60", count: 7 },
  { bucket: "60+", count: 3 },
];

export const companyRows = [
  {
    company: "Atlassian",
    role: "P4 Software Engineer",
    fixed: 52.0,
    variable: 10.0,
    notice: "60d",
    total: 62.0,
  },
  {
    company: "Swiggy",
    role: "Staff Engineer",
    fixed: 62.0,
    variable: 12.0,
    notice: "30d",
    total: 74.0,
  },
  {
    company: "Goldman Sachs",
    role: "Associate — Engineering",
    fixed: 36.5,
    variable: 8.5,
    notice: "90d",
    total: 45.0,
  },
  {
    company: "Zomato",
    role: "SDE III (iOS)",
    fixed: 48.0,
    variable: 6.0,
    notice: "60d",
    total: 54.0,
  },
  {
    company: "PhonePe",
    role: "Data Engineer II",
    fixed: 25.4,
    variable: 3.0,
    notice: "60d",
    total: 28.4,
  },
  {
    company: "Infosys",
    role: "Technology Lead",
    fixed: 13.8,
    variable: 1.2,
    notice: "90d",
    total: 15.0,
  },
];

export const layoffRows = [
  {
    company: "Consumer internet — Series E",
    sector: "Quick commerce",
    stability: 34,
    severity: "high" as Severity,
    signal: "Two reorgs in five months; 11% of engineering exited without backfill.",
    updated: "12 Aug 2026",
  },
  {
    company: "Edtech — post-IPO",
    sector: "Education",
    stability: 41,
    severity: "elevated" as Severity,
    signal: "Hiring freeze extended to Q4; sales org restructured into pods.",
    updated: "09 Aug 2026",
  },
  {
    company: "US retail bank GCC",
    sector: "BFSI captive",
    stability: 78,
    severity: "low" as Severity,
    signal: "Headcount plan intact; 340 open requisitions across BLR and HYD.",
    updated: "14 Aug 2026",
  },
  {
    company: "IT services — top 5",
    sector: "Services",
    stability: 63,
    severity: "moderate" as Severity,
    signal: "Bench duration capped at 45 days; involuntary attrition rising quietly.",
    updated: "07 Aug 2026",
  },
  {
    company: "AI infrastructure — Series B",
    sector: "Deep tech",
    stability: 71,
    severity: "moderate" as Severity,
    signal: "Funded through 2028 but compensation is heavily equity-weighted.",
    updated: "15 Aug 2026",
  },
];

export const layoffTimeline = [
  {
    date: "15 Aug 2026",
    title: "Quick-commerce operator cuts 120 roles in city ops and analytics",
    detail: "Severance at one month per year served; relieving letters issued within 14 days.",
  },
  {
    date: "11 Aug 2026",
    title: "Edtech extends hiring freeze through Q4 FY27",
    detail: "Internal note confirms only revenue-critical backfills will be approved.",
  },
  {
    date: "04 Aug 2026",
    title: "Payments unicorn withdraws 18 unjoined offers",
    detail: "Candidates offered a one-time ex-gratia payment of ₹1.5L in lieu of joining.",
  },
  {
    date: "28 Jul 2026",
    title: "Global product company shutters its Chennai design studio",
    detail: "26 roles relocated to Bengaluru; no remote continuation offered.",
  },
];

export type Article = {
  slug: string;
  category: string;
  date: string;
  title: string;
  standfirst: string;
  author: string;
  readingTime: string;
  reviewed: string;
  keyFigures: { label: string; value: string }[];
  body: string[];
  methodology: string;
  corrections: { date: string; note: string }[];
};

export const articles: Article[] = [
  {
    slug: "notice-period-offer-compression",
    category: "Money reality",
    date: "14 Aug 2026",
    title: "The 90-day trap: how long notice periods quietly compress your next offer",
    standfirst:
      "Across 412 offer letters collected this year, candidates serving 90-day notice periods received measurably lower fixed pay than otherwise identical candidates on 30 days.",
    author: "Career Reality Desk",
    readingTime: "9 min read",
    reviewed: "Reviewed 14 Aug 2026",
    keyFigures: [
      { label: "Offer letters analysed", value: "412" },
      { label: "Median fixed-pay gap", value: "-11.4%" },
      { label: "Offers with buyout clause", value: "23%" },
    ],
    body: [
      "Recruiters describe notice period as a scheduling detail. The data says it is a pricing input. When we grouped submissions by role, city, years of experience and company tier, the only remaining variable that moved fixed pay by double digits was the length of notice the candidate had to serve.",
      "The mechanism is unglamorous. A hiring manager with a quarterly headcount target discounts a candidate who cannot start for three months, because the requisition risk sits with them. That discount does not appear as a line item. It appears as a lower band placement, or as an offer that lands at the bottom of the range you were told was 'competitive'.",
      "Buyout language makes it worse. Where a buyout exists, 23% of offers in our sample funded it out of the joining bonus rather than as a separate payment — which means the candidate absorbed it through a clawback obligation lasting twelve to eighteen months.",
      "What actually works: get the notice figure into the conversation before the band conversation, in writing, and ask whether the company funds buyouts as a separate, non-recoverable payment. Two sentences, asked early, are worth more than a fourth round of negotiation at the end.",
    ],
    methodology:
      "Submissions are anonymous and voluntary, which biases the sample toward product and GCC employers in metros. We de-duplicate by hashed offer identifiers, drop entries missing fixed-pay breakdowns, and report medians rather than means. Cohorts smaller than 20 are not published.",
    corrections: [
      {
        date: "15 Aug 2026",
        note: "An earlier version reported the median gap as -13.1% by including 14 entries that lacked a verified notice-period field.",
      },
    ],
  },
  {
    slug: "bengaluru-hyderabad-purchasing-power",
    category: "Salary reality",
    date: "09 Aug 2026",
    title: "Bengaluru pays more. Hyderabad leaves you with more.",
    standfirst:
      "Rent-adjusted disposable income for mid-senior engineers is now 15% higher in Hyderabad, despite headline packages running 8% behind Bengaluru.",
    author: "Career Reality Desk",
    readingTime: "7 min read",
    reviewed: "Reviewed 09 Aug 2026",
    keyFigures: [
      { label: "Headline pay gap", value: "+8% BLR" },
      { label: "Rent-adjusted gap", value: "+15% HYD" },
      { label: "Median 2BHK rent delta", value: "₹19,400/mo" },
    ],
    body: [
      "The comparison people run is package versus package. The comparison that determines your life is package minus rent, commute and the cost of the neighbourhood you can actually tolerate living in.",
      "On our submissions, a senior engineer with seven years of experience takes home a median ₹41.0 LPA in Bengaluru against ₹37.8 LPA in Hyderabad. Then rent lands: the median two-bedroom near the primary tech corridor costs ₹19,400 more per month in Bengaluru, which is ₹2.3L a year of after-tax income.",
      "Commute compounds it. Self-reported one-way commute times cluster at 52 minutes in Bengaluru against 31 in Hyderabad — roughly 160 working hours a year, unpaid.",
      "None of this makes Hyderabad the right answer. It makes the headline number the wrong question. Model the after-rent figure before you treat a Bengaluru offer as a raise.",
    ],
    methodology:
      "Rent figures come from listing medians within 8km of primary tech corridors, cross-checked against submitted rental agreements. Commute times are self-reported and unweighted.",
    corrections: [],
  },
  {
    slug: "staff-engineer-promotion-freeze",
    category: "Career risk",
    date: "02 Aug 2026",
    title: "The staff engineer freeze: why individual-contributor promotions stalled",
    standfirst:
      "Senior engineers are being asked to operate at staff scope without the title, as companies shrink their IC ladders above the senior band.",
    author: "Career Reality Desk",
    readingTime: "8 min read",
    reviewed: "Reviewed 02 Aug 2026",
    keyFigures: [
      { label: "Median time in senior band", value: "3.4 years" },
      { label: "Staff promotions per 100 seniors", value: "6" },
      { label: "Scope-without-title reports", value: "38%" },
    ],
    body: [
      "The senior software engineer band has become a holding pen. Median time served before a staff promotion is now 3.4 years, up from 2.1 in our 2024 cohort, and only six staff promotions were recorded per hundred seniors in the last cycle.",
      "The substitution is scope. Thirty-eight percent of respondents in the senior band reported owning cross-team architecture, on-call escalation and hiring loops — staff responsibilities on a senior title and a senior band.",
      "Companies are candid about why in private: staff headcount is budgeted centrally, and a title change triggers a compensation band change. Scope does not.",
      "If you are in this position, the leverage is documentation, not patience. Write down the scope you already own, get it acknowledged in writing at a review, and set a dated expectation. Absent a date, you are subsidising the org chart.",
    ],
    methodology:
      "Based on 268 self-reported career-history submissions from engineers at product companies and GCCs with more than 500 employees in India.",
    corrections: [],
  },
];

export const tools = [
  { to: "/salary-explorer", label: "Salary explorer", meta: "210+ points" },
  { to: "/ctc-decoder", label: "CTC decoder", meta: "In-hand" },
  { to: "/layoff-radar", label: "Layoff radar", meta: "12 tracked" },
] as const;

export const severityLabel: Record<Severity, string> = {
  low: "Low",
  moderate: "Moderate",
  elevated: "Elevated",
  high: "High",
};
