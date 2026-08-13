export type ResumeRole = {
  title: string;
  organization: string;
  location?: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
};

export type ResumeEducation = {
  institution: string;
  degree: string;
  location?: string;
  start: string;
  end: string;
  summary?: string;
  notes: string[];
};

export type ResumeSkillGroup = {
  label: string;
  summary: string;
  details: string[];
};

export type ResumeData = {
  name: string;
  role: string;
  summary: string;
  location: string;
  email: string;
  websiteUrl: string;
  githubUrl: string;
  linkedInUrl: string;
  experience: ResumeRole[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
  }[];
};

export const resumeData: ResumeData = {
  name: "Alireza Afshan",
  role: "Junior Software Developer | Backend, Systems & Developer Tooling",
  summary:
    "Information Systems graduate with honors building backend services, developer tools, and full-stack products across TypeScript, Python, PostgreSQL, and Docker. I have led a six-person capstone, shipped public plugins and self-hosted apps, and built deterministic testing, CI, rollback, and evidence trails into projects ranging from attendance systems to research simulators. I am looking for junior backend, platform, developer tooling, or DevOps roles where careful systems thinking matters.",
  location: "Las Vegas, NV | open to remote work and relocation",
  email: "mail@alirezaafshan.com",
  websiteUrl: "https://alirezaafshan.com",
  githubUrl: "https://github.com/YesterdaysLemon",
  linkedInUrl: "https://www.linkedin.com/in/alireza-afshan",
  experience: [
    {
      title: "Independent Software & Systems Portfolio",
      organization: "Personal projects",
      location: "Las Vegas, NV",
      start: "May 2026",
      end: "Present",
      summary:
        "Shipping public developer tools, product prototypes, simulations, and self-hosted infrastructure with a bias toward bounded automation and inspectable evidence.",
      highlights: [
        "Built ForgeWard, a provider-neutral Python CLI that coordinates model-assisted software work through typed outputs, path and budget controls, deterministic checks, inspectable evidence, and explicit human approval gates.",
        "Published Job Application Batch Builder, an evidence-first Codex plugin that researches current roles and produces audited DOCX/PDF application packages from candidate-authorized sources without inventing claims.",
        "Built production-shaped product prototypes including RetainerProof, a multi-tenant client value ledger with background jobs, source-backed evidence, and a Dockerized demo environment.",
        "Built a signed webhook deployment manager that runs health-checked Docker rollouts with rollback support across multiple apps on one VPS behind Caddy.",
        "Built Pocket Museum, a local-first Expo and React Three Fiber prototype with photo intake, 3D exhibit placement, persisted schema migrations, accessible fallbacks, and 93 automated tests.",
        "Developed verifier-first open-math repositories and reproducible simulation harnesses for recurrent controllers, connectome models, and batched drones, keeping every conclusion scoped to the evidence actually produced.",
      ],
    },
    {
      title: "Backend & Systems Lead - CentraID Capstone",
      organization: "University of Doha for Science and Technology",
      location: "Doha, Qatar",
      start: "September 2025",
      end: "May 2026",
      summary:
        "Completed prototype attendance verification system for university classrooms, combining mobile software, access point software, backend APIs, and containerized deployment infrastructure.",
      highlights: [
        "Led backend architecture for a six-person capstone spanning a NestJS REST API, PostgreSQL, an Expo student app, and a Dockerized Python/Linux reader with local SQLite state.",
        "Designed device-bound attendance, rotating session challenges, reader heartbeat and access-point control, RFID fallback, live rosters, and course rollups across the mobile, reader, and backend layers.",
        "Built a PostgreSQL-backed GitHub Actions quality gate with unit and end-to-end tests, then containerized the services and supporting demo infrastructure.",
        "Led Git/GitHub onboarding, cross-component integration, technical documentation, and troubleshooting guides for the team.",
        "Presented and defended the completed prototype to a three-judge panel; project was accepted and received an A.",
      ],
    },
    {
      title: "Software & IT Intern",
      organization: "Drabzin Co.",
      location: "Doha, Qatar",
      start: "February 2026",
      end: "April 2026",
      summary:
        "Developed internal software and provided technical support for a CNC factory and door/gate manufacturing business.",
      highlights: [
        "Built a Python image-preparation workflow for a CNC design team with interactive perspective correction, AI-assisted debris removal, automated output handling, and folder-based export.",
        "Created a small web interface for the workflow and supported hardware troubleshooting, machine configuration, and day-to-day factory IT needs.",
      ],
    },
    {
      title: "Lead Developer - Mobile Identity & Verification Prototypes",
      organization: "Academic mobile projects",
      location: "Doha, Qatar",
      start: "December 2024",
      end: "April 2025",
      summary:
        "Two related Expo/Firebase proofs of concept for photo-based vehicle approvals and QR-based classroom attendance.",
      highlights: [
        "Led both cross-platform prototypes on a shared React Native, Expo, and Firebase foundation, reusing routing, permissions, role-specific screens, and real-time cloud state.",
        "Built photo capture, upload, review, and approval flows for vehicle access; adapted the architecture for teacher-generated QR codes, student scanning, and live attendance rosters.",
      ],
    },
  ],
  education: [
    {
      institution: "University of Doha for Science and Technology",
      degree: "BS in Information Systems",
      location: "Doha, Qatar",
      start: "January 2023",
      end: "May 2026",
      summary: "Graduated with honors.",
      notes: [
        "Relevant coursework: Software Engineering, DevOps, Systems Design, Linux, Networking, System Administration, Databases, Java, JavaScript, Python.",
      ],
    },
    {
      institution: "University of Arizona",
      degree: "Mathematics and Astronomy coursework",
      location: "Tucson, AZ",
      start: "September 2018",
      end: "May 2022",
      summary:
        "Completed coursework through junior-level studies before transferring academic focus to Information Systems.",
      notes: [
        "Developed mathematical thinking and analytical problem-solving skills through coursework in differential equations, linear algebra, vector calculus, astronomy, and related quantitative subjects.",
      ],
    },
  ],
  skills: [
    {
      label: "Backend & data systems",
      summary:
        "Most of my projects need an API, a database, or a small worker humming away somewhere.",
      details: [
        "TypeScript & Node.js",
        "Python",
        "Java & SQL",
        "NestJS",
        "Fastify & Express",
        "PostgreSQL & SQLite",
        "REST APIs",
        "Pydantic",
        "Background jobs",
      ],
    },
    {
      label: "Frontend & interactive systems",
      summary:
        "From ordinary forms to fish tanks, neural worms, and the occasional wizard duel.",
      details: [
        "React",
        "Next.js",
        "Vite & Tailwind",
        "React Native & Expo",
        "Firebase",
        "Three.js",
        "React Three Fiber",
        "WebGL",
        "Godot & GDScript",
        "Accessible UI & reduced motion",
      ],
    },
    {
      label: "Delivery & infrastructure",
      summary:
        "I like getting projects off localhost and keeping the boring parts predictable.",
      details: [
        "Docker",
        "GitHub Actions",
        "CodeQL",
        "CI/CD",
        "Linux VPS",
        "Caddy & nginx",
        "Signed webhooks",
        "Health checks & rollback",
      ],
    },
    {
      label: "Verification & quality",
      summary:
        "Tests are most useful when they can tell me exactly how I was wrong.",
      details: [
        "Pytest",
        "Playwright",
        "Integration tests",
        "Static typing",
        "Ruff",
        "Deterministic replay",
        "Checksummed artifacts",
        "Independent verification",
      ],
    },
    {
      label: "AI-assisted developer tooling",
      summary:
        "I use models as collaborators, with regular code holding the keys and checking the receipts.",
      details: [
        "LiteLLM",
        "Provider-neutral orchestration",
        "Typed model outputs",
        "Capability-limited context",
        "Human approval gates",
        "Secure SDLC",
        "Codex plugins & skills",
        "Evidence & provenance",
      ],
    },
    {
      label: "Research & simulation",
      summary:
        "The odd little corner where math, biology, physics, and reproducible code keep meeting.",
      details: [
        "Scientific computing",
        "Exact computation",
        "Connectomics",
        "Biomechanics",
        "Recurrent controllers",
        "Reinforcement learning",
        "Deterministic simulation",
        "Offline evaluation",
        "Data provenance",
      ],
    },
    {
      label: "Systems & collaboration",
      summary:
        "The glue work: hardware, Linux, docs, Git, and helping a team share the same map.",
      details: [
        "Linux & networking",
        "RFID readers",
        "Offline-first services",
        "Technical documentation",
        "Git onboarding",
        "Multi-repo workflows",
        "DOCX & PDF pipelines",
        "English and Farsi",
      ],
    },
  ],
  certifications: [
    {
      title: "Cybersecurity Foundation",
      issuer: "Palo Alto Cybersecurity Program",
      date: "May 2024",
    },
    {
      title: "Certificate of Recognition",
      issuer: "Ministry of Higher Education Scientific Research Competition",
      date: "April 2025",
    },
  ],
};
