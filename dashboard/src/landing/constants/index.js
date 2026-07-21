export const COLORS = {
  gold:       '#2dd4bf',
  goldLight:  '#5eead4',
  goldFaint:  'rgba(45,212,191, 0.1)',
  goldBorder: 'rgba(45,212,191, 0.15)',
  pink:       '#2dd4bf',
  orange:     '#2dd4bf',
  white:      '#EEEEEE',
  muted:      '#888888',
  dark:       '#000000',
  darkAlt:    '#121212',
  darkWarm:   '#090909',
  accent:     '#64a0dc',
};

export const FONTS = {
  heading: 'Outfit, sans-serif',
  body:    'Outfit, sans-serif',
};

// ─── Shared Section Theme ─────────────────────────────────────────────────────
// Import this instead of defining local `const T = { ... }` in each section.
export const THEME = {
  bg:      COLORS.dark,
  card:    COLORS.darkAlt,
  white:   COLORS.white,
  muted:   '#888880',
  gold:    COLORS.gold,
  pink:    COLORS.gold,
  orange:  COLORS.gold,
  border:  COLORS.goldBorder,
  faint:   COLORS.goldFaint,
  cream:   '#F0ECD8',
};

// ─── Navbar Links ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home',       target: '',                href: '#', path: '/' },
  { label: 'Features',   target: 'explainer-video',  href: '#features', path: '/features' },
];

export const DROPDOWN_LINKS = [
  { label: "FAQ's",           path: '/resources/faq' },
  { label: 'About Founder',   path: '/resources/about-founder' },
  { label: 'Blogs',           path: '/resources/blogs' },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: 'How does the AI prevent candidate cheating?',
    a: 'Our AI platform features advanced integrity checks: face verification via webcam, screen sharing detection, copy-paste blocks, and automated parsing of coding responses to detect plagiarism and third-party prompts.',
  },
  {
    q: 'What types of roles can intervieHire evaluate?',
    a: 'We support a wide array of technical and non-technical roles, including software engineers (frontend, backend, fullstack), product managers, sales executives, customer success, and operations.',
  },
  {
    q: 'Can we integrate this with our existing ATS?',
    a: 'Yes! We support integrations with major ATS platforms such as Greenhouse, Level, and Ashby, allowing you to trigger evaluations and sync transcripts directly.',
  },
  {
    q: 'How are the industry experts calibrated?',
    a: 'All of our human interviewers are active professionals in their respective fields who undergo standardized training and calibration cycles to evaluate candidates objectively.',
  },
];

// ─── Impact / Stats Marquee ───────────────────────────────────────────────────
export const IMPACT_STATS = [
  { num: '50%+',        label: 'Reduction in cost-per-hire' },
  { num: '100s of hrs', label: 'Saved per hire cycle' },
  { num: 'Zero Bias',   label: 'In AI screening layer' },
  { num: '24/7',        label: 'Candidate interviews automated' },
  { num: '98%',         label: 'Cheating detection accuracy' },
  { num: '10x Faster',  label: 'Hiring pipeline velocity' },
  { num: '4.9/5',       label: 'Candidate experience rating' },
];

// ─── Blog Posts (Landing Shortlist) ──────────────────────────────────────────
export const BLOG_POSTS = [
  {
    title:   'Preventing AI Interview Cheating',
    excerpt: 'How we screen for screen sharing, web searches, and copy-paste behavior.',
    date:    'June 2, 2026',
  },
  {
    title:   'Standardizing Tech Screening',
    excerpt: 'The impact of standardized rubric evaluation on engineering diversity and performance.',
    date:    'May 24, 2026',
  },
  {
    title:   'Scaling Startups Asynchronously',
    excerpt: 'How async technical screening saves up to 35 hours per engineer hiring cycle.',
    date:    'May 10, 2026',
  },
];

// ─── Contact Info ─────────────────────────────────────────────────────────────
export const CONTACT_INFO = {
  email:    'interviehire@gmail.com',
  website:  'interviehire.com',
  founders: 'Devasri Bali & Aditya Rana',
};

// ─── Features Page Steps ──────────────────────────────────────────────────────
export const FEATURE_STEPS = [
  { title: "Create an Interview", desc: "Define the role, upload a job description, set skill weights, and configure culture-fit criteria. Lina uses this to build a custom scoring rubric.", features: ["AI rubric builder", "Skill weighting", "Culture fit config"], time: "5 min setup" },
  { title: "Invite Candidates", desc: "Send automated email invitations with calendar scheduling. Candidates pick a slot - no back-and-forth coordination needed.", features: ["Auto email", "Calendar sync", "Reminders"], time: "1 click" },
  { title: "Screen Resumes Beyond Keywords", desc: "Lina reads resumes for actual capability signals - not just keyword matches. She spots transferable skills, project complexity, and growth trajectory.", features: ["Semantic parsing", "Skill signal detection", "Growth scoring"], time: "Real-time" },
  { title: "Candidates Take Interviews", desc: "Candidates enter a conversational AI interview that adapts in real time. Lina asks follow-ups, probes depth, and evaluates responses - 24/7, no human needed.", features: ["Adaptive questioning", "Real-time scoring", "24/7 availability"], time: "30–45 min" },
  { title: "See Results & Hire Faster", desc: "Review full transcripts, skill scores, red flags, and a ranked shortlist. Make data-driven decisions in hours, not weeks.", features: ["Transcripts", "Scorecards", "Ranked shortlist"], time: "Instant" },
];

// ─── Pricing Page Plans ───────────────────────────────────────────────────────
export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    desc: 'For small teams ready to automate their first hiring pipeline.',
    features: [
      '25 AI interviews per month',
      'Cheat detection (face verify + plagiarism scan)',
      'Email support',
      'Standardized scoring',
      '24/7 automated scheduling',
    ],
    cta: 'Subscribe Now',
    badge: null,
    color: '#888880',
  },
  {
    name: 'Growth',
    price: '$99',
    period: '/month',
    desc: 'For growing teams that need speed, scale, and integrity.',
    features: [
      '200 AI interviews per month',
      'Advanced cheat detection (face verify + screen share + plagiarism)',
      'Priority support',
      'Custom scoring rubrics',
      'Team collaboration',
      'Analytics dashboard',
      'ATS integration (Greenhouse, Lever, Ashby)',
      'API access',
    ],
    cta: 'Subscribe Now',
    badge: 'Most Popular',
    color: '#2dd4bf',
  },
  {
    name: 'Enterprise',
    price: '$299',
    period: '/month',
    desc: 'For organizations with unique hiring workflows at scale.',
    features: [
      '1,000 AI interviews per month',
      'All cheat detection features',
      'Whitelabel AI interviews',
      'Dedicated account manager',
      'SSO & custom integrations',
      'Industry expert calibration',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Subscribe Now',
    badge: null,
    color: '#64a0dc',
  },
];

export const INCLUDED_FEATURES = [
  { icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', title: 'Conversational AI Interviews', desc: 'Follow-up questions, 24/7 - just like a real interviewer' },
  { icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', title: 'Skill-Based Scoring', desc: 'Resume + interview combined into one standardized score' },
  { icon: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', title: 'Eye Tracking & Integrity', desc: 'Real-time gaze monitoring & anti-cheat integrity checks' },
  { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', title: 'Full Transcripts & Video', desc: 'Every interview recorded with timestamped transcripts' },
  { icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', title: 'Candidate Dashboard', desc: 'Rankings, detailed scores, and one-click export' },
  { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'Custom or AI-Generated Questions', desc: 'Write your own or let Lina generate the perfect interview' },
  { icon: 'M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16 M9 12h6', title: 'CSV Upload & ATS Integration', desc: 'Bulk upload candidates and connect with your ATS' },
  { icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', title: 'Learns From Your Feedback', desc: 'The AI adapts to your preferences and improves over time' },
];

// ─── Home Pricing Section Plans ──────────────────────────────────────────────
export const PRICING_SECTION_PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    desc: 'Perfect for small teams exploring AI-powered hiring.',
    features: [
      '5 interviews per month',
      'Basic cheating detection',
      'Email support',
      'Standard scoring',
    ],
    cta: 'Get Started',
    badge: null,
    color: '#888880',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    desc: 'For growing teams that need speed and reliability.',
    features: [
      '100 interviews per month',
      'Advanced cheating detection',
      'Priority support',
      'Custom scoring rubrics',
      'Team collaboration',
      'Analytics dashboard',
      'API access',
    ],
    cta: 'Start Free Trial',
    badge: 'Most Popular',
    color: '#2dd4bf',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For organizations with unique hiring workflows.',
    features: [
      'Unlimited interviews',
      'Whitelabel interviews',
      'Dedicated account manager',
      'SSO & custom integrations',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    badge: null,
    color: '#64a0dc',
  },
];

// ─── Blog Articles (Full Blog List) ──────────────────────────────────────────
export const BLOGS = [
  { title:"Preventing AI Interview Cheating", excerpt:"How we screen for screen sharing, web searches, and copy-paste behavior in real-time interviews.", date:"June 2, 2026", tag:"Engineering", readTime:"5 min read" },
  { title:"Standardizing Tech Screening", excerpt:"The impact of standardized rubric evaluation on engineering diversity and long-term performance.", date:"May 24, 2026", tag:"Diversity", readTime:"7 min read" },
  { title:"Scaling Startups Asynchronously", excerpt:"How async technical screening saves up to 35 hours per engineer hiring cycle.", date:"May 10, 2026", tag:"Startups", readTime:"6 min read" },
  { title:"The Rise of AI-Powered Interviews", excerpt:"Why forward-thinking companies are replacing phone screens with conversational AI agents.", date:"Apr 28, 2026", tag:"AI Trends", readTime:"8 min read" },
  { title:"Building a Bias-Free Hiring Pipeline", excerpt:"Strategies for removing unconscious bias from every stage of the technical interview process.", date:"Apr 14, 2026", tag:"Diversity", readTime:"6 min read" },
  { title:"How to Evaluate Senior Engineers at Scale", excerpt:"Deep-dive system design and architecture assessments that separate top-tier talent.", date:"Mar 30, 2026", tag:"Engineering", readTime:"9 min read" },
  { title:"Why Traditional Technical Interviews Are Broken", excerpt:"The data behind why whiteboard interviews fail and what actually predicts job performance.", date:"Mar 15, 2026", tag:"Industry", readTime:"7 min read" },
  { title:"Reducing Time-to-Hire with Automation", excerpt:"How automated screening pipelines cut your hiring cycle from weeks to days.", date:"Feb 28, 2026", tag:"Productivity", readTime:"5 min read" },
  { title:"The Cost of a Bad Engineering Hire", excerpt:"Breaking down the real financial and cultural cost of mis-hiring in technical roles.", date:"Feb 10, 2026", tag:"Business", readTime:"6 min read" },
  { title:"Integrating AI Interviews with Your ATS", excerpt:"A technical guide to connecting IntervieHire with Greenhouse, Lever, Ashby and more.", date:"Jan 25, 2026", tag:"Integration", readTime:"8 min read" },
  { title:"Remote-First Hiring Best Practices", excerpt:"Building evaluation workflows that work across time zones, cultures, and async schedules.", date:"Jan 8, 2026", tag:"Remote", readTime:"5 min read" },
  { title:"2026 State of Technical Hiring", excerpt:"Annual report on hiring trends, salary benchmarks, and the fastest-growing skill demands.", date:"Dec 15, 2025", tag:"Research", readTime:"12 min read" },
];

// ─── Team Members & About Founder Gallery ─────────────────────────────────────
export const TEAM = [
  { name:'Rohit Sharma', role:'Head of Engineering', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name:'Priya Kapoor', role:'VP of AI Research', img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name:'Alex Chen', role:'Lead Product Designer', img:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { name:'Sarah Okafor', role:'Head of Customer Success', img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name:'Marcus Lee', role:'Senior Full-Stack Engineer', img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name:'Ananya Patel', role:'ML Ops Lead', img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
];

export const GALLERY = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
];

// ─── Solving For Section Data ────────────────────────────────────────────────
export const SOLVES = [
  {
    title: "Eliminating Scheduling Hell",
    desc: "No more endless calendar tennis. Candidates take interviews asynchronously on their own time, 24/7.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&q=80"
  },
  {
    title: "Removing Recruitment Bias",
    desc: "Standardized AI evaluation frameworks ensure every candidate is graded fairly based on capability, not gut feeling.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80"
  },
  {
    title: "Cheating & Proxy Prevention",
    desc: "Built-in plagiarism, copy-paste, and screen-sharing detection keep evaluations honest and transparent.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=700&q=80"
  }
];

export const TARGET_AUDIENCES = [
  {
    title: "Smaller Teams & Startups",
    desc: "Build high-performing teams without dedicated HR managers. Save engineering lead hours.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80"
  },
  {
    title: "Fast-Growing Companies",
    desc: "Screen hundreds of applicants in hours rather than days. Scale hiring pipelines effortlessly.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=700&q=80"
  },
  {
    title: "Technical Hiring Managers",
    desc: "Stop conducting redundant phone screenings. Review structured feedback and hire directly.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=80"
  }
];

// ─── Hiring Chaos Section Data ───────────────────────────────────────────────
export const PAIN_PILLS = [
  { num: "50%+",       label: "Reduction in cost-per-hire" },
  { num: "100s of hrs",label: "Saved per hire cycle" },
  { num: "Zero Bias",  label: "In AI screening layer" },
  { num: "24/7",       label: "Candidate interviews automated" },
  { num: "98%",        label: "Cheating detection accuracy" },
  { num: "10x Faster", label: "Hiring pipeline velocity" },
  { num: "4.9/5",      label: "Candidate experience rating" },
];

export const CHAOS_CARDS = [
  { type:'score',    label:'Candidate Score',   name:'Priya Sharma - Backend Eng.',  score:'61 / 100', scoreColor:'#2dd4bf', note1:'Manually reviewed by 3 people',  note2:'No decision after 2 weeks' },
  { type:'status',   label:'Interview Status',  name:'Marcus T. - Final Round',      status:'DROPPED',  reason:'Interviewer no-showed',         time:'3 days ago' },
  { type:'calendar', label:'Scheduling',        candidate:'Arjun M. - 4th reschedule', slots:[{day:'Mon · 10:00 AM',state:'declined'},{day:'Tue · 2:30 PM',state:'declined'},{day:'Wed · 4:00 PM',state:'pending'}] },
  { type:'cost',     label:'Recruiter Cost',    line:'Manual screening',              hrs:'38 hrs',      hrsLabel:'this week',                   cost:'$2,660',   costLabel:'recruiter cost', flag:'Zero AI assistance used' },
  { type:'score',    label:'Panel Evaluation',  name:'Kevin L. - Data Engineer',      score:'78 / 100', scoreColor:'#2dd4bf', note1:'Conflicting feedback from panel', note2:'No structured rubric applied' },
  { type:'status',   label:'Offer Status',      name:'Neha R. - Product Manager',     status:'OFFER DECLINED', reason:'Process took 6 weeks',    time:'Yesterday' },
];

// ─── Problem facts ────────────────────────────────────────────────────────────
export const ROW1_CARDS = [
  {
    type: 'stat',
    accent: '#DDDDDD',
    stat: '72%',
    source: 'LINKEDIN TALENT TRENDS 2024',
    body: 'Of recruiters say they have encountered at least one fabricated job title or company on a resume in the past year.',
  },
  {
    type: 'quote',
    accent: '#2dd4bf',
    quote: '"We spent 6 weeks interviewing a candidate who had never actually worked at the companies on their CV."',
    author: 'VP of Engineering, Fintech Unicorn',
    via: 'SHARED AT TECHCRUNCH DISRUPT 2024',
  },
  {
    type: 'stat',
    accent: '#2dd4bf',
    stat: '40–60',
    source: 'SHRM HIRING BENCHMARK REPORT',
    body: 'Days. The average time-to-hire for a mid-level tech role - and most of that time is pure scheduling overhead.',
  },
  {
    type: 'stat',
    accent: '#DDDDDD',
    stat: '$17,000',
    source: 'SOCIETY FOR HUMAN RESOURCE MGMT',
    body: 'Average cost per bad hire. For senior roles it balloons to over 3× the annual salary.',
  },
  {
    type: 'quote',
    accent: '#2dd4bf',
    quote: '"Our panel gave wildly different scores to the same candidate. We had no idea who to believe."',
    author: 'Head of Talent, B2B SaaS Company',
    via: 'GLASSDOOR EMPLOYER STUDY 2025',
  },
  {
    type: 'stat',
    accent: '#2dd4bf',
    stat: '35%',
    source: 'HARVARD BUSINESS REVIEW',
    body: 'Of engineering managers\' time is consumed by screening calls that could be fully automated.',
  },
  {
    type: 'stat',
    accent: '#DDDDDD',
    stat: '46%',
    source: 'ROBERT HALF STAFFING SURVEY',
    body: 'Of new hires fail within 18 months - not due to skill gaps, but misaligned expectations set during rushed interviews.',
  },
  {
    type: 'quote',
    accent: '#2dd4bf',
    quote: '"I interviewed the same person twice before realising they had two completely different LinkedIn profiles."',
    author: 'Engineering Lead, Series C Startup',
    via: 'HACKER NEWS THREAD, 2025',
  },
];

export const ROW2_CARDS = [
  {
    type: 'stat',
    accent: '#2dd4bf',
    stat: '600%',
    source: 'IDENTITY THEFT RESOURCE CENTER 2024',
    body: 'Increase in synthetic identity fraud targeting HR and onboarding systems since 2020.',
  },
  {
    type: 'quote',
    accent: '#DDDDDD',
    quote: '"We had a candidate answer every technical question correctly on paper, then couldn\'t write a single line of code on day one."',
    author: 'CTO, Climate Tech Startup',
    via: 'BLIND TECH FORUM, MARCH 2025',
  },
  {
    type: 'stat',
    accent: '#2dd4bf',
    stat: '1 in 3',
    source: 'WORKSTREAM HIRING REPORT 2025',
    body: 'Remote job offers are now accepted by someone other than the person who interviewed - ghost employment is mainstream.',
  },
  {
    type: 'stat',
    accent: '#2dd4bf',
    stat: '$220B',
    source: 'WORLD ECONOMIC FORUM 2024',
    body: 'Lost globally each year to occupational fraud - insider threats now start at the hiring stage.',
  },
  {
    type: 'quote',
    accent: '#DDDDDD',
    quote: '"The developer we hired for $140k/year was outsourcing their entire job to someone in another country - for years."',
    author: 'Engineering Director, Public SaaS Company',
    via: 'THE VERGE, JANUARY 2025',
  },
  {
    type: 'stat',
    accent: '#2dd4bf',
    stat: '88%',
    source: 'GARTNER TALENT SURVEY 2024',
    body: 'Of CHROs admit their current vetting process would not catch a sophisticated identity spoof or proxy interview.',
  },
  {
    type: 'stat',
    accent: '#2dd4bf',
    stat: '3.2×',
    source: 'MCKINSEY FUTURE OF WORK REPORT',
    body: 'More likely to make a bad hire when interviews are rushed and unstructured versus AI-assisted evaluations.',
  },
  {
    type: 'quote',
    accent: '#DDDDDD',
    quote: '"By the time we realised the candidate was using AI to answer everything live, we had already made the offer."',
    author: 'Director of Engineering, E-Commerce Platform',
    via: 'TECHCRUNCH APRIL 2025',
  },
];

// ─── Solution Section Cards ──────────────────────────────────────────────────
export const SOLUTION_CARDS = [
  {
    num: "01",
    label: "Candidate Sourcing",
    variant: "sourcing",
    badge: "SOURCING",
    titleAccent: "AI Powered",
    titleRest: "Candidate Sourcing",
    title: "AI Powered Candidate Sourcing",
    body: "Find the right talent, faster. Our AI scans multiple channels to source relevant candidates who match your requirements and company culture.",
    features: [
      { icon: "search", title: "Intelligent Search",        desc: "AI understands your requirements and finds the best matches." },
      { icon: "globe",  title: "Multi-Channel Sourcing",    desc: "We scan 15+ platforms including LinkedIn, Naukri, Wellfound & more." },
      { icon: "people", title: "Passive Talent Discovery",  desc: "Engage with passive candidates who aren't actively looking." },
      { icon: "star",   title: "Smart Recommendations",     desc: "AI ranks and recommends the most relevant talent for you." },
    ],
    uiType: "sourcing",
    accent: "#2dd4bf",
    bgGradient: "linear-gradient(135deg, rgba(45,212,191, 0.12) 0%, transparent 60%)",
    border: "rgba(45,212,191, 0.25)"
  },
  {
    num: "02",
    label: "AI Resume Parsing",
    title: "AI Resume Parsing & Match Rating",
    body: "Upload resumes in bulk. Our AI automatically extracts candidates' experience, skills, and match rating against your job description constraints before the first call.",
    pills: ["AI Resume Parsing", "Semantic Skill Match", "Job Constraints Check", "Recruiter Dashboard", "Bulk Actions"],
    uiType: "resume",
    accent: "#2dd4bf",
    bgGradient: "linear-gradient(135deg, rgba(45,212,191, 0.12) 0%, transparent 60%)",
    border: "rgba(45,212,191, 0.25)"
  },
  {
    num: "03",
    label: "AI Recruiter",
    variant: "screening",
    badge: "RECRUITER SCREENING",
    titleAccent: "AI Recruiter",
    titleRest: "Screening",
    body: "Our AI interviewer, Lina, conducts intelligent screening calls and gathers key information to help you shortlist the right candidates faster.",
    features: [
      { icon: "phone", title: "Automated Screening Calls" },
      { icon: "chat", title: "Smart Questioning" },
      { icon: "doc", title: "Real-time Transcription" },
      { icon: "chart", title: "Candidate Insights" },
      { icon: "link", title: "Seamless ATS Integration" }
    ],
    uiType: "screening",
    accent: "#2dd4bf",
    bgGradient: "linear-gradient(135deg, rgba(45,212,191, 0.12) 0%, transparent 60%)",
    border: "rgba(45,212,191, 0.25)"
  },
  {
    num: "04",
    label: "Functional Interviews",
    variant: "functional",
    badge: "FUNCTIONAL INTERVIEW",
    titleAccent: "AI Powered",
    titleRest: "Functional Interviews",
    body: "Our AI interviewer, Lina, conducts in-depth functional interviews with role-specific, scenario-based and follow-up questions to assess real-world problem solving, critical thinking and domain expertise.",
    features: [
      { icon: "search", title: "In-depth Questioning", desc: "Deep dive into experience, approach, and decisions." },
      { icon: "brief", title: "Role-Specific Interviews", desc: "Tailored interviews aligned to job functions and seniority." },
      { icon: "target", title: "Scenario & Case Based", desc: "Real-world scenarios and problem solving questions." },
      { icon: "chat", title: "Follow-up Probing", desc: "AI asks smart follow-ups to evaluate depth of thinking." },
      { icon: "chart", title: "Real-time Evaluation", desc: "Live scoring on key competencies and functional skills." },
      { icon: "doc", title: "Interview Analytics", desc: "Detailed reports and insights to help you hire with confidence." }
    ],
    uiType: "functional",
    accent: "#2dd4bf",
    bgGradient: "linear-gradient(135deg, rgba(45,212,191, 0.12) 0%, transparent 60%)",
    border: "rgba(45,212,191, 0.25)"
  },
  {
    num: "05",
    label: "Manager Dashboard",
    title: "Consolidated Scorecards & Insights",
    body: "Get standardized reports, verified credentials, interview recordings, and cheating logs. Hire candidate shortlists with complete confidence.",
    pills: ["Standardized Scoring", "Radar Skill Chart", "Cheating Detection Logs", "Structured Feedback Reports", "One-Click Hire"],
    uiType: "dashboard",
    accent: "#2dd4bf",
    bgGradient: "linear-gradient(135deg, rgba(45,212,191, 0.12) 0%, transparent 60%)",
    border: "rgba(45,212,191, 0.25)"
  }
];

// ─── HiringChaosSection - animated pills & floating cards ────────────────────
export const CHAOS_PAIN_PILLS = [
  { num: '50%+',        label: 'Reduction in cost-per-hire' },
  { num: '100s of hrs', label: 'Saved per hire cycle' },
  { num: 'Zero Bias',   label: 'In AI screening layer' },
  { num: '24/7',        label: 'Candidate interviews automated' },
  { num: '98%',         label: 'Cheating detection accuracy' },
  { num: '10x Faster',  label: 'Hiring pipeline velocity' },
  { num: '4.9/5',       label: 'Candidate experience rating' },
];

export const CHAOS_CARDS_DATA = [
  { type: 'score',    label: 'Candidate Score',  name: 'Priya Sharma - Backend Eng.',    score: '61 / 100', scoreColor: '#2dd4bf', note1: 'Manually reviewed by 3 people',  note2: 'No decision after 2 weeks' },
  { type: 'status',   label: 'Interview Status', name: 'Marcus T. - Final Round',         status: 'DROPPED',        reason: 'Interviewer no-showed',         time: '3 days ago' },
  { type: 'calendar', label: 'Scheduling',       candidate: 'Arjun M. - 4th reschedule', slots: [{ day: 'Mon · 10:00 AM', state: 'declined' }, { day: 'Tue · 2:30 PM', state: 'declined' }, { day: 'Wed · 4:00 PM', state: 'pending' }] },
  { type: 'cost',     label: 'Recruiter Cost',   line: 'Manual screening',                hrs: '38 hrs', hrsLabel: 'this week', cost: '$2,660', costLabel: 'recruiter cost', flag: 'Zero AI assistance used' },
  { type: 'score',    label: 'Panel Evaluation', name: 'Kevin L. - Data Engineer',        score: '78 / 100', scoreColor: '#2dd4bf', note1: 'Conflicting feedback from panel', note2: 'No structured rubric applied' },
  { type: 'status',   label: 'Offer Status',     name: 'Neha R. - Product Manager',       status: 'OFFER DECLINED', reason: 'Process took 6 weeks',          time: 'Yesterday' },
];

export const CHAOS_CARD_ENTRY = [
  { top: '4%',  left: '1%',  rotate: -5, fromX: '-140%', fromY: '-80%', fromR: -30 },
  { top: '40%', left: '-1%', rotate:  3, fromX: '-160%', fromY:  '20%', fromR:  18 },
  { top: '5%',  right: '2%', rotate:  4, fromX:  '140%', fromY: '-80%', fromR:  28 },
  { top: '40%', right: '1%', rotate: -3, fromX:  '160%', fromY:  '20%', fromR: -20 },
  { top: '70%', right: '3%', rotate:  2, fromX:  '130%', fromY:  '80%', fromR:  22 },
  { top: '70%', left: '1%',  rotate: -4, fromX: '-130%', fromY:  '80%', fromR: -25 },
];

export const CHAOS_PILL_POSITIONS = [
  { top: '13%', left: '26%',  fromX: '-60px', fromY:  '60px' },
  { top: '22%', left: '36%',  fromX: '-30px', fromY:  '80px' },
  { top: '16%', right: '24%', fromX:  '60px', fromY:  '60px' },
  { top: '68%', left: '24%',  fromX: '-60px', fromY: '-60px' },
  { top: '81%', left: '40%',  fromX: '-30px', fromY: '-80px' },
  { top: '72%', right: '28%', fromX:  '60px', fromY: '-60px' },
  { top: '30%', right: '10%', fromX:  '80px', fromY:  '30px' },
];

// ─── LinaInterviewerSection ───────────────────────────────────────────────────
export const LINA_FEATURES = [
  { label: 'Conversational, not scripted',     body: 'Lina runs a real dialogue, not a fixed question list - she reacts to what a candidate actually says.' },
  { label: 'Resume + live response scoring',   body: 'Every candidate is scored on a blend of verified background and how they actually perform in the room.' },
  { label: 'Built-in integrity layer',         body: 'Proctoring, gaze tracking and answer-pattern detection run quietly in the background of every interview.' },
  { label: 'Follow-up questions in real time', body: 'When an answer is thin, Lina probes deeper - the way a sharp human interviewer would.' },
  { label: 'Gets sharper with every hire',     body: 'Every hire and pass your team logs feeds back into how Lina scores the next candidate.' },
];

export const LINA_SIGNALS = [
  { label: 'Gaze tracking',    value: 'active' },
  { label: 'Answer detection', value: 'active' },
  { label: 'Resume match',     value: '92%' },
];

// ─── AboutFounderSection ──────────────────────────────────────────────────────
export const FOUNDER_TEAM = [
  { name: 'Rohit Sharma', role: 'Head of Engineering',       img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Priya Kapoor', role: 'VP of AI Research',          img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Alex Chen',    role: 'Lead Product Designer',      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { name: 'Sarah Okafor', role: 'Head of Customer Success',   img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name: 'Marcus Lee',   role: 'Senior Full-Stack Engineer',  img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Ananya Patel', role: 'ML Ops Lead',                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
];

export const FOUNDER_GALLERY = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
];

// ─── BudgetCtaSection ─────────────────────────────────────────────────────────
export const BUDGET_CTA_STATS = [
  { num: '$4,200', suffix: '/mo', label: 'Avg. recruiter cost replaced' },
  { num: '85',     suffix: '%',  label: 'Cost saved vs. manual screening' },
  { num: '200',    suffix: '',   label: 'Interviews/week per Lina instance' },
];

// ─── ManifestoSection ─────────────────────────────────────────────────────────
export const MANIFESTO_LINES = [
  ["We", "didn't", "build", "another", "tool."],
  ["We", "built", "the", "hiring", "layer"],
  ["your", "team", "never", "had."]
];

// ─── HeroSection ──────────────────────────────────────────────────────────────
export const HERO_WORDS1 = ["Interview", "Smarter,"];
export const HERO_WORDS2 = ["Hire", "Faster."];

// ─── PilotPage ────────────────────────────────────────────────────────────────
export const PILOT_TRUST_BADGES = [
  { num: '10x',   label: 'Faster Hiring'    },
  { num: '98%',   label: 'Cheat Detection'  },
  { num: '4.9/5',  label: 'Candidate Rating' },
];

export const PILOT_CONTACT_ROWS = [
  {
    icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6',
    label: CONTACT_INFO.email,
    isPolyline: true,
  },
  {
    icon: null,
    label: CONTACT_INFO.website,
    isGlobe: true,
  },
  {
    icon: null,
    label: `Co-Founders: ${CONTACT_INFO.founders}`,
    isPeople: true,
  },
];






