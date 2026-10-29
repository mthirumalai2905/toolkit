export interface ProjectItem {
  id: string;
  name: string;
  handle: string;
  date: string;
  pinned?: boolean;
  href: string;
  tagline: string;
  description: string;
  stack: string[];
  metric: string;
  metricLabel: string;
  accentGradient: string;
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: string;
  };
}

export interface ExperienceHighlight {
  title: string;
  detail: string;
}

export interface ExperienceItem {
  slug: string;
  company: string;
  handle: string;
  role: string;
  type: string;
  period: string;
  duration: string;
  location: string;
  logo?: string;
  current?: boolean;
  tech: string[];
  preview: string;
  summary: string;
  context?: string;
  highlights: ExperienceHighlight[];
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: string;
  };
}

export interface EssayBlock {
  type: "p" | "h2" | "quote" | "ul";
  text?: string;
  items?: string[];
}

export interface EssayItem {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  read: string;
  excerpt: string;
  tags: string[];
  content: EssayBlock[];
  stats: {
    replies: number;
    reposts: number;
    likes: number;
    views: string;
  };
}

export interface CompetitivePlatform {
  id: string;
  name: string;
  handle: string;
  rating: string;
  rawRating: number;
  maxRating: number;
  rank: string;
  color: string;
  href: string;
  note: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  highlight: string;
  period: string;
  location: string;
}

export interface GlobalClient {
  country: string;
  city: string;
  flag: string;
  code: string;
  focus: string;
}

export const PROFILE = {
  name: "Thirumalai",
  shortName: "Thiru",
  handle: "@mthirumalai2905",
  verified: true,
  roleTag: "AI Engineer · Systems & Applied Research",
  headline:
    "Crafting products, systems, and interfaces that solve real problems. General on purpose.",
  bioParagraphs: [
    "Building the unglamorous pieces that make software feel effortless: small primitives, fast failure modes, and things that stay alive while you use them.",
    "Distributing the real-time web.",
  ],
  philosophy:
    "Great AI products are not model demos. They are systems: opinionated defaults, fast failure modes, small primitives that compose, and interfaces that respect the user's intelligence.",
  location: "Mumbai, India",
  discordUrl: "https://discord.gg/QNWtdXgF8",
  websiteLabel: "next-gen-ai-works.vercel.app",
  websiteUrl: "https://next-gen-ai-works.vercel.app/",
  calendlyUrl: "https://calendly.com/mthirumalai2905/30min",
  resumeUrl: "/Thirumalai.pdf",
  joined: "Joined September 2022",
  stats: {
    postsCount: "28 Posts",
    following: "142",
    followers: "2,431",
    streak: "1,033d",
  },
  socials: [
    {
      label: "Discord",
      handle: "discord.gg/QNWtdXgF8",
      href: "https://discord.gg/QNWtdXgF8",
    },
    {
      label: "LinkedIn",
      handle: "in/mthirumalai2905",
      href: "https://www.linkedin.com/in/mthirumalai2905/",
    },
    {
      label: "GitHub",
      handle: "@mthirumalai2905",
      href: "https://github.com/mthirumalai2905",
    },
    {
      label: "Peerlist",
      handle: "peerlist.io/mthirumalai2905",
      href: "https://peerlist.io/mthirumalai2905",
    },
    {
      label: "Instagram",
      handle: "@mthirumalai2905",
      href: "https://www.instagram.com/mthirumalai2905/",
    },
    {
      label: "Calendly",
      handle: "30min Quick Call",
      href: "https://calendly.com/mthirumalai2905/30min",
    },
  ],
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "alyson-hr",
    name: "Alyson HR",
    handle: "alyson-client.vercel.app",
    date: "Pinned · Production",
    pinned: true,
    href: "https://alyson-client.vercel.app/",
    tagline: "Agentic AI workspace for HR.",
    description:
      "An agentic HR workspace built at RevCloud. Autonomous agents handle onboarding, offboarding, leave, bonuses, and time tracking so the team is not copying the same steps across five separate tools.",
    stack: ["React", "TypeScript", "Agents", "LLMs", "AWS"],
    metric: "HR",
    metricLabel: "Agent Workspace",
    accentGradient: "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
    stats: { replies: 18, reposts: 34, likes: 248, views: "4.8K" },
  },
  {
    id: "dumpstash",
    name: "DumpStash",
    handle: "unblockchain.vercel.app",
    date: "2026 · AI Product",
    href: "https://unblockchain.vercel.app/",
    tagline: "AI workspace for rapid thinking.",
    description:
      "Dump raw ideas, notes, and voice into a frictionless capture surface while AI classifies, threads, and summarizes in the background. Turns unstructured thought into PRDs, roadmaps, and task lists with realtime sync, sharing, and multi-session workspaces.",
    stack: ["React", "TypeScript", "Supabase", "Groq", "Gemini"],
    metric: "AI",
    metricLabel: "Native Capture",
    accentGradient: "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
    stats: { replies: 14, reposts: 29, likes: 196, views: "3.9K" },
  },
  {
    id: "research-agent",
    name: "Research Agent",
    handle: "Internal / NDA Pipeline",
    date: "2026 · Autonomous Graph",
    href: "https://calendly.com/mthirumalai2905/30min",
    tagline: "Autonomous research pipeline with a live knowledge graph.",
    description:
      "Client research agent built on Hermes for agent harnessing: planning, tool loops, retries, and long-running task control. Drives a real Chrome session to scrape and navigate the open web, then normalizes entities, relationships, and evidence into Neo4j so findings become a queryable knowledge graph instead of a pile of docs.",
    stack: ["Hermes", "Chrome", "Neo4j", "Python", "Agents"],
    metric: "NDA",
    metricLabel: "Knowledge Graph",
    accentGradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    stats: { replies: 22, reposts: 41, likes: 312, views: "6.1K" },
  },
  {
    id: "system-forge",
    name: "System Forge",
    handle: "system-blueprint-studio.vercel.app",
    date: "2026 · Architecture Tool",
    href: "https://system-blueprint-studio.vercel.app/playground",
    tagline: "Live system design playground.",
    description:
      "A collaborative canvas for brainstorming and building system architectures in real time. Invite friends, sketch distributed flows together, and forge designs from the whiteboard into something you can actually ship.",
    stack: ["React", "TypeScript", "Realtime", "System Design"],
    metric: "Live",
    metricLabel: "Collab Design",
    accentGradient: "from-amber-500/20 via-orange-500/10 to-rose-500/20",
    stats: { replies: 11, reposts: 24, likes: 174, views: "3.2K" },
  },
  {
    id: "imagify",
    name: "Imagify",
    handle: "imagify-indol.vercel.app",
    date: "2025 · Micro-SaaS",
    href: "https://imagify-indol.vercel.app/",
    tagline: "Text to image, shipped as a clean micro-SaaS.",
    description:
      "A full-stack SaaS app for AI image generation. Sign in with Clerk, purchase credit packs via Razorpay, and transform natural-language prompts into high-resolution visuals ready to download or share.",
    stack: ["React", "Node.js", "MongoDB", "Clerk", "Razorpay"],
    metric: "SaaS",
    metricLabel: "Text to Image",
    accentGradient: "from-pink-500/20 via-rose-500/10 to-orange-500/20",
    stats: { replies: 9, reposts: 17, likes: 142, views: "2.7K" },
  },
  {
    id: "retrolio",
    name: "Retrolio",
    handle: "frontend-os-livid.vercel.app",
    date: "2025 · Interactive OS",
    href: "https://frontend-os-livid.vercel.app/",
    tagline: "A portfolio that boots like Windows 95.",
    description:
      "An intentionally nostalgic 90s desktop experience with draggable windows, retro icons, and authentic OS chrome that makes you feel like you time-traveled.",
    stack: ["React", "TypeScript", "Vite", "Retro UI"],
    metric: "90s",
    metricLabel: "Desktop Vibes",
    accentGradient: "from-cyan-500/20 via-sky-500/10 to-blue-500/20",
    stats: { replies: 15, reposts: 21, likes: 168, views: "3.1K" },
  },
  {
    id: "pokedex",
    name: "PokeDex",
    handle: "mthirumalai2905.github.io/pokedex",
    date: "2024 · Web App",
    href: "https://mthirumalai2905.github.io/pokedex/",
    tagline: "Browse every Pokémon like a trainer.",
    description:
      "A fast interactive Pokédex you can poke around in. Look up entries, heights, weights, abilities, base stats, and evolution chains without leaving the page.",
    stack: ["HTML", "CSS", "JavaScript", "REST API"],
    metric: "1k+",
    metricLabel: "Species Indexed",
    accentGradient: "from-red-500/20 via-amber-500/10 to-yellow-500/20",
    stats: { replies: 6, reposts: 12, likes: 98, views: "1.9K" },
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    slug: "semantic-as",
    company: "Semantic AS",
    handle: "@semantic_no",
    role: "AI Engineer & Business Development Consultant",
    type: "Full-time · Specialist",
    period: "Sep 2026 — Present",
    duration: "Current",
    location: "Oslo, Norway (Remote)",
    current: true,
    tech: ["Production LLMs", "RAG", "Agent Orchestration", "Evaluation Harnesses", "TypeScript", "Python"],
    preview:
      "AI engineer and business development consultant. Production LLM systems, hybrid retrieval, and the customer conversations around that work.",
    summary:
      "At Semantic AS I work as an AI engineer and a business development consultant. The engineering is resilient AI systems and enterprise intelligence pipelines: hybrid retrieval, tool-use orchestration, and evaluation gates that keep grounded responses fast. The consulting side takes that work into the business.",
    highlights: [
      {
        title: "Hybrid Retrieval & Grounding",
        detail:
          "Architected low-latency lexical + dense vector retrieval pipelines with reranking and strict freshness SLAs.",
      },
      {
        title: "Durable Agent Workflows",
        detail:
          "Designed replayable state machines and human-in-the-loop checkpoints for multi-step enterprise automation.",
      },
      {
        title: "Continuous Evaluation Harnesses",
        detail:
          "Built automated faithfulness, tool-accuracy, and p95 latency regression suites integrated directly into CI/CD.",
      },
      {
        title: "Business Development",
        detail:
          "Business development consultant alongside the engineering, carrying the systems into customer and partner conversations.",
      },
    ],
    stats: { replies: 19, reposts: 28, likes: 276, views: "5.2K" },
  },
  {
    slug: "revcloud",
    company: "RevCloud",
    handle: "@revcloud",
    role: "Data Scientist & AI Engineer",
    type: "Full-time",
    period: "Aug 2025 — Sep 2026",
    duration: "1 yr 2 mos",
    location: "San Francisco, CA / Pune",
    logo: "/logos/revcloud.png",
    tech: ["Generative AI", "AWS", "MLOps", "Recall.ai", "SageMaker", "Lambda"],
    preview:
      "Production generative AI at RevCloud: agents, assistants, and automation on LLM architectures. Owned the ML pipelines and AWS infra those systems run on, from training and eval through deploy and monitoring.",
    summary:
      "At RevCloud I built production generative AI: agents, pipelines, and the cloud infrastructure they run on. The work spanned HR automation (Alyson HR), meeting intelligence with Recall.ai, and an organization-wide Knowledge Brain.",
    context:
      "RevCloud opened a collaborative engineering hub in Pune to keep product, research, and reviews in the same room—eliminating timezone lag while shipping directly for US enterprise workflows.",
    highlights: [
      {
        title: "Production Generative AI",
        detail:
          "Agents, intelligent assistants, and automation workflows on LLM architectures—built to ship, not to demo.",
      },
      {
        title: "ML Pipelines with CI/CD",
        detail:
          "Automated training, evaluation, deployment, and monitoring so models move from notebook to production without a fire drill.",
      },
      {
        title: "Cloud-Native AI on AWS",
        detail:
          "Infrastructure on S3, EC2, Lambda, SageMaker, and CloudWatch for reliable deploys and full observability.",
      },
      {
        title: "Agentic HR Platform",
        detail:
          "Automated onboarding, offboarding, leave, bonuses, and time tracking so HR is not copying the same steps into five tools.",
      },
      {
        title: "Meeting Intelligence & Knowledge Brain",
        detail:
          "Recall.ai bots join live meetings, stream transcripts to S3, and index organizational knowledge for semantic search and context-aware assistants.",
      },
    ],
    stats: { replies: 24, reposts: 39, likes: 318, views: "6.4K" },
  },
  {
    slug: "augmentpath-labs",
    company: "Augmentpath Labs",
    handle: "@augmentpath",
    role: "Growth Lead",
    type: "Part-time",
    period: "Part-time",
    duration: "",
    location: "Texas, United States (Remote)",
    tech: [],
    preview:
      "Part-time growth lead, remote from Texas in the United States.",
    summary:
      "Growth lead at Augmentpath Labs. The role was part-time, and the work was remote from Texas in the United States.",
    highlights: [
      {
        title: "Growth",
        detail:
          "Led growth for Augmentpath Labs on a part-time, remote basis.",
      },
    ],
    stats: { replies: 4, reposts: 7, likes: 64, views: "1.2K" },
  },
  {
    slug: "mkc-labs",
    company: "MKC Labs",
    handle: "@mkclabs_ny",
    role: "Applied AI Engineer",
    type: "Contract",
    period: "Jul 2026 — Aug 2026",
    duration: "2 mos",
    location: "New York, NY",
    logo: "/logos/mkc-labs.svg",
    tech: ["Frontend", "Hermes", "Discord Bots", "Haki", "AI Agents"],
    preview:
      "New York contract focused on product frontend, a Hermes research agent for local NYC listings, and Haki, a chat-first multi-channel outreach platform.",
    summary:
      "At MKC Labs in New York I split time between existing product frontend and two production AI systems the team used daily: an automated NYC real-estate listings agent in Discord, and Haki for AI-driven cold outreach.",
    highlights: [
      {
        title: "SimpleStreet Research Agent",
        detail:
          "A Hermes agent that scrapes SimpleStreet and posts filtered New York property listings into Discord with photos so leadership can review opportunities in real time.",
      },
      {
        title: "Haki Chat-First Outreach",
        detail:
          "A conversational multi-channel campaign platform where sequences are authored and refined in chat before autonomous agents execute outreach.",
      },
      {
        title: "Product Frontend Engineering",
        detail:
          "Shipped high-polish UI surfaces across existing production applications.",
      },
    ],
    stats: { replies: 12, reposts: 19, likes: 164, views: "3.1K" },
  },
  {
    slug: "mercor",
    company: "Mercor",
    handle: "@mercor_ai",
    role: "AI Engineer",
    type: "Freelance · Specialist",
    period: "Jun 2025",
    duration: "1 mo",
    location: "San Francisco, CA (Remote)",
    logo: "/logos/mercor.png",
    tech: ["Prompt Engineering", "Red Teaming", "LLM Evals", "Model Safety"],
    preview:
      "Prompt engineering and LLM red teaming under NDA for frontier AI workflows. Designed deterministic prompt templates, stress-tested models for failure modes, and authored vulnerability reports.",
    summary:
      "A specialized AI engineering engagement with Mercor focused on prompt systems and frontier model safety: architecting structured prompt templates, executing adversarial red-teaming, and documenting failure modes for eval loops.",
    context:
      "Executed under strict client NDA—focused on adversarial robustness, jailbreak resistance, instruction hierarchy, and silent hallucination detection.",
    highlights: [
      {
        title: "Deterministic Prompt Systems",
        detail:
          "Designed reusable, slot-constrained prompt templates engineered to produce reliable structured outputs under noisy real-world inputs.",
      },
      {
        title: "Adversarial Red Teaming",
        detail:
          "Probed models for prompt injection, instruction leakage, and subtle reasoning failures where outputs sound plausible but violate constraints.",
      },
      {
        title: "Vulnerability & Eval Reporting",
        detail:
          "Delivered reproducible failure cases, severity taxonomies, and concrete mitigations to harden model evaluation harnesses.",
      },
    ],
    stats: { replies: 16, reposts: 31, likes: 245, views: "4.9K" },
  },
  {
    slug: "fiverr",
    company: "Fiverr",
    handle: "@fiverr_pro",
    role: "AI Fullstack Developer",
    type: "Freelance",
    period: "Jan 2024 — Jun 2024",
    duration: "6 mos",
    location: "Pune, India (Remote)",
    logo: "/logos/fiverr.svg",
    tech: ["Next.js", "React", "Node.js", "UI/UX", "SaaS"],
    preview:
      "Delivered end-to-end full-stack applications, custom SaaS products, and high-conversion UI/UX systems for international clients across US, Europe, and APAC.",
    summary:
      "Worked independently with founders and overseas teams to take products from initial Figma mockups to deployed full-stack SaaS applications.",
    highlights: [
      {
        title: "End-to-End SaaS Builds",
        detail:
          "Architected and shipped full-stack web apps with authentication, billing, and AI integrations.",
      },
      {
        title: "UI/UX & Product Polish",
        detail:
          "Designed clean, high-trust interfaces that helped early-stage clients pitch and onboard customers.",
      },
    ],
    stats: { replies: 8, reposts: 14, likes: 132, views: "2.4K" },
  },
  {
    slug: "ampexweb",
    company: "AmpexWeb Private Limited",
    handle: "@ampexweb",
    role: "Full Stack Developer",
    type: "Full-time",
    period: "Sep 2023 — Oct 2023",
    duration: "2 mos",
    location: "Bengaluru, India (Remote)",
    logo: "/logos/ampexweb.png",
    tech: ["Backend APIs", "Frontend", "Full-Stack"],
    preview:
      "Owned the full-stack application build: architected backend APIs, revamped the core web presence, and wired interactive frontend flows.",
    summary:
      "At AmpexWeb I stood up the backend services and rebuilt the customer-facing frontend so the product had a fast, cohesive architecture.",
    highlights: [
      {
        title: "Backend Services & APIs",
        detail:
          "Created the core backend API and data layer powering the application.",
      },
      {
        title: "Full Website & Frontend Revamp",
        detail:
          "Redesigned and implemented the responsive frontend wired to the new stack.",
      },
    ],
    stats: { replies: 5, reposts: 9, likes: 89, views: "1.6K" },
  },
  {
    slug: "verzeo",
    company: "Verzeo",
    handle: "@verzeo_tech",
    role: "Cyber Security Engineer",
    type: "Internship",
    period: "Sep 2022 — Oct 2022",
    duration: "2 mos",
    location: "Bengaluru, India (Remote)",
    logo: "/logos/verzeo.svg",
    tech: ["Cybersecurity", "Network Security", "Threat Analysis"],
    preview:
      "Early engineering internship focused on cybersecurity fundamentals, vulnerability assessment, and security-first software habits.",
    summary:
      "Developed foundational security engineering habits, threat modeling awareness, and defensive system design principles.",
    highlights: [
      {
        title: "Security Fundamentals",
        detail:
          "Practiced vulnerability discovery, secure coding patterns, and risk-aware system design.",
      },
    ],
    stats: { replies: 4, reposts: 7, likes: 74, views: "1.2K" },
  },
];

export const ESSAYS: EssayItem[] = [
  {
    slug: "designing-retrieval-for-production-llm-systems",
    title: "Designing retrieval for production LLM systems",
    date: "Jul 12, 2026",
    dateISO: "2026-07-12",
    read: "12 min read",
    excerpt:
      "Hybrid retrieval, latency budgets, and the evaluation loops that keep grounded answers trustworthy in production.",
    tags: ["RAG", "Retrieval", "Systems"],
    stats: { replies: 31, reposts: 64, likes: 412, views: "9.4K" },
    content: [
      {
        type: "p",
        text: "Most retrieval systems look fine in a notebook and fall apart the moment real traffic arrives. The difference is rarely the embedding model. It is how you design the path from query to context under latency, freshness, and failure constraints.",
      },
      { type: "h2", text: "Start with the failure modes" },
      {
        type: "p",
        text: "Before picking a vector database, write down what 'wrong' looks like. Empty retrieval. Stale documents. Soft failures that still return an answer. Over-retrieval that blows the context window. Each of those needs an explicit policy.",
      },
      {
        type: "ul",
        items: [
          "Empty retrieval should degrade to a safe refusal, not a confident hallucination.",
          "Stale indexes need freshness SLAs tied to source systems, not best-effort sync jobs.",
          "Soft ranking failures should be observable. If BM25 and dense disagree wildly, log it.",
        ],
      },
      { type: "h2", text: "Hybrid is the default, not a luxury" },
      {
        type: "p",
        text: "Dense retrieval alone is brittle on identifiers, error codes, and exact phrases. Lexical retrieval alone misses paraphrases. In production I almost always ship a hybrid stack: BM25 for precision, dense vectors for recall, and a lightweight reranker when the latency budget allows.",
      },
      {
        type: "quote",
        text: "Treat retrieval as a product surface. Latency, citation quality, and empty-result behavior are user-facing features.",
      },
      { type: "h2", text: "Measure what users actually feel" },
      {
        type: "p",
        text: "Offline nDCG is useful. Online faithfulness and citation click-through are decisive. Instrument the full path: query rewrite, candidate set, rerank, prompt assembly, then model response. If you cannot attribute a bad answer to a retrieval miss versus a generation miss, you will optimize the wrong layer.",
      },
      {
        type: "p",
        text: "The systems that survive are opinionated: small candidate sets, hard latency budgets, and evaluation harnesses that run on every index change.",
      },
    ],
  },
  {
    slug: "the-evaluation-harness-we-should-have-built-first",
    title: "The evaluation harness we should have built first",
    date: "May 18, 2026",
    dateISO: "2026-05-18",
    read: "9 min read",
    excerpt:
      "Why demos ship without evals, and how a minimal harness would have saved months of silent regressions.",
    tags: ["Evals", "LLM Ops"],
    stats: { replies: 24, reposts: 52, likes: 338, views: "7.8K" },
    content: [
      {
        type: "p",
        text: "We shipped three major prompt changes before we had a real evaluation harness. Each one improved a demo. Two of them quietly hurt production faithfulness. That is the tax of optimizing by vibe.",
      },
      { type: "h2", text: "A harness is not a spreadsheet" },
      {
        type: "p",
        text: "An evaluation harness is a runnable system: curated cases, scorers, thresholds, and a place the results live next to the deploy. If it cannot block a merge, it is documentation wearing a lab coat.",
      },
      {
        type: "ul",
        items: [
          "Start with 50 to 100 golden tasks that represent real user pain, not toy prompts.",
          "Score faithfulness, tool correctness, and latency separately.",
          "Store diffs per commit so regressions are attributable.",
        ],
      },
      { type: "h2", text: "Online and offline need each other" },
      {
        type: "p",
        text: "Offline suites catch sharp regressions. Online sampling catches distribution shift. The teams that win run both, and they treat eval failures with the same seriousness as unit test failures.",
      },
      {
        type: "quote",
        text: "If you cannot fail a release on eval quality, you do not have quality gates. You have dashboards.",
      },
    ],
  },
  {
    slug: "latency-budgets-are-product-decisions",
    title: "Latency budgets are product decisions",
    date: "Mar 9, 2026",
    dateISO: "2026-03-09",
    read: "6 min read",
    excerpt:
      "Every millisecond you spend on retrieval, tools, or streaming is a product tradeoff. Treat it like one.",
    tags: ["Latency", "Product"],
    stats: { replies: 19, reposts: 43, likes: 289, views: "6.2K" },
    content: [
      {
        type: "p",
        text: "Engineers talk about latency as an infrastructure metric. Users experience it as trust. A 4-second grounded answer can feel slower than a 900ms ungrounded one if you do not stream or set expectations.",
      },
      { type: "h2", text: "Write the budget on a napkin" },
      {
        type: "p",
        text: "Allocate time to routing, retrieval, tools, generation, and UI. If the sum exceeds what the product can tolerate, cut scope before you add GPUs. Most 'we need a faster model' conversations are really 'we refused to cut a stage'.",
      },
      {
        type: "ul",
        items: [
          "TTFT under 800ms for interactive chat.",
          "Retrieval under 120ms p95 for enterprise search assistants.",
          "Tool loops capped with explicit user-visible progress.",
        ],
      },
      {
        type: "quote",
        text: "A latency budget without an owner is a wish. Assign someone who can say no to features that break it.",
      },
    ],
  },
  {
    slug: "notes-on-agent-orchestration-at-scale",
    title: "Notes on agent orchestration at scale",
    date: "Jan 22, 2026",
    dateISO: "2026-01-22",
    read: "14 min read",
    excerpt:
      "Durable state, replay, and human checkpoints: the unglamorous primitives that make agents reliable.",
    tags: ["Agents", "Orchestration"],
    stats: { replies: 27, reposts: 58, likes: 374, views: "8.5K" },
    content: [
      {
        type: "p",
        text: "Agent demos optimize for cleverness. Agent systems optimize for recoverability. Once a workflow spans minutes, tools, and humans, the hard problem is not planning. It is durable state.",
      },
      { type: "h2", text: "Make every step replayable" },
      {
        type: "p",
        text: "If you cannot restart from a checkpoint after a worker crash, you do not have an agent platform. You have a long-running script. Persist inputs, tool results, and decisions. Treat the LLM turn as one more impure step with a recorded outcome.",
      },
      { type: "h2", text: "Humans are part of the graph" },
      {
        type: "p",
        text: "Approval gates, clarifications, and overrides should be first-class nodes. Hiding them in Slack threads creates an orchestration system you cannot observe or test.",
      },
      {
        type: "ul",
        items: [
          "Idempotent tool calls with explicit side-effect boundaries.",
          "Timeouts and compensations for external systems.",
          "Replay suites that re-run failed trajectories against mocked tools.",
        ],
      },
      {
        type: "quote",
        text: "Scale is not more agents. Scale is more recoverable paths through the same graph.",
      },
    ],
  },
];

export const TOOLKIT = [
  {
    id: "01",
    category: "AI & LLM Systems",
    items: [
      "OpenAI API",
      "Claude",
      "Gemini",
      "Groq",
      "LangChain",
      "RAG Pipelines",
      "Autonomous Agents",
      "Hermes",
      "OpenClaw",
      "MLOps",
      "Red Teaming",
      "LLM Evals",
      "Cursor",
    ],
  },
  {
    id: "02",
    category: "Frontend Architecture",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Realtime UI"],
  },
  {
    id: "03",
    category: "Backend & Distributed",
    items: ["Node.js", "Express.js", "Python", "Java", "REST & Streaming APIs"],
  },
  {
    id: "04",
    category: "Data & Knowledge Graphs",
    items: ["Neo4j", "PostgreSQL / SQL", "MongoDB", "Redis", "Cassandra", "MySQL", "Supabase"],
  },
  {
    id: "05",
    category: "Cloud & Infrastructure",
    items: ["AWS (S3, EC2, Lambda, SageMaker, CloudWatch)", "Docker", "Kubernetes", "CI/CD"],
  },
];

export const COMPETITIVE_STATS = {
  summary: [
    { value: "1,033+", label: "Day Streak" },
    { value: "1.6k+", label: "Problems Solved" },
    { value: "Top 4%", label: "Global LeetCode" },
    { value: "4+ Yrs", label: "Active Competing" },
  ],
  platforms: [
    {
      id: "lc",
      name: "LeetCode",
      handle: "@pabloescobar69",
      rating: "1890",
      rawRating: 1890,
      maxRating: 3000,
      rank: "Knight · Top 4%",
      color: "#FFA116",
      href: "https://leetcode.com/pabloescobar69/",
      note: "Contest speed, dynamic programming, and interview-grade algorithmic precision under a clock.",
    },
    {
      id: "cf",
      name: "Codeforces",
      handle: "@thiru2905",
      rating: "1500",
      rawRating: 1500,
      maxRating: 3500,
      rank: "Specialist",
      color: "#22A86B",
      href: "https://codeforces.com/profile/thiru2905",
      note: "Weekly rated rounds focused on graphs, constructive algorithms, and tight runtime constraints.",
    },
    {
      id: "cc",
      name: "CodeChef",
      handle: "@badge",
      rating: "4★",
      rawRating: 4,
      maxRating: 7,
      rank: "4★ Coder",
      color: "#0071E3",
      href: "https://www.codechef.com/users/badge",
      note: "Long challenges and cook-offs that build stamina, edge-case accuracy, and ranking consistency.",
    },
  ] as CompetitivePlatform[],
};

export const EDUCATION: EducationItem[] = [
  {
    school: "Sinhgad College of Engineering, Pune",
    degree: "B.E. in Electronics & Telecommunication Engineering",
    highlight: "First Class with Distinction",
    period: "Graduated June 2025",
    location: "Pune, Maharashtra",
  },
  {
    school: "Lakshya Prep Junior College, Mumbai",
    degree: "Higher Secondary Certificate (HSC · Class XII)",
    highlight: "92.50%",
    period: "2021",
    location: "Mumbai, Maharashtra",
  },
  {
    school: "The South Indian Association High School, Mumbai",
    degree: "Secondary School Certificate (SSC · Class X)",
    highlight: "90.80%",
    period: "2019",
    location: "Mumbai, Maharashtra",
  },
];

export const CLIENT_PINS = [
  { city: "San Francisco", lon: -122.42, lat: 37.77 },
  { city: "New York", lon: -74.01, lat: 40.71 },
  { city: "Oslo", lon: 10.75, lat: 59.91 },
  { city: "Paris", lon: 2.35, lat: 48.86 },
  { city: "Berlin", lon: 13.4, lat: 52.52 },
  { city: "Dubai", lon: 55.27, lat: 25.2 },
  { city: "Jakarta", lon: 106.85, lat: -6.21 },
];

export const GLOBAL_CLIENTS: GlobalClient[] = [
  {
    country: "United States",
    city: "San Francisco & New York",
    flag: "🇺🇸",
    code: "US",
    focus: "Production GenAI, Agentic HR, NYC Real Estate Agents & Frontier Red Teaming",
  },
  {
    country: "Norway",
    city: "Oslo",
    flag: "🇳🇴",
    code: "NO",
    focus: "Semantic AS · Enterprise LLM Systems & Hybrid Retrieval Infrastructure",
  },
  {
    country: "France",
    city: "Paris",
    flag: "🇫🇷",
    code: "FR",
    focus: "Custom AI SaaS & Full-Stack Product Engineering",
  },
  {
    country: "Germany",
    city: "Berlin",
    flag: "🇩🇪",
    code: "DE",
    focus: "Data Science Systems & Automated Growth Workflows",
  },
  {
    country: "United Arab Emirates",
    city: "Dubai",
    flag: "🇦🇪",
    code: "AE",
    focus: "High-Conversion Web Platforms & AI Automation",
  },
  {
    country: "Indonesia",
    city: "Jakarta",
    flag: "🇮🇩",
    code: "ID",
    focus: "Full-Stack Client Products & Interactive Systems",
  },
];
