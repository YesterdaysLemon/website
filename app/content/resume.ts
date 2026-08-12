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
    "Information Systems graduate with honors who likes working where software meets systems. I build backend services, developer tools, simulations, and small full-stack products, then take them through deterministic tests, CI, containers, and deployment. Recent work spans secure AI tooling, connectome-driven simulation, verifier-first computational research, and the infrastructure behind the small apps on this site. I am looking for junior backend, systems, developer tooling, or DevOps roles.",
  location: "Las Vegas, NV | open to remote work and relocation",
  email: "mail@alirezaafshan.com",
  websiteUrl: "https://alirezaafshan.com",
  githubUrl: "https://github.com/YesterdaysLemon",
  linkedInUrl: "https://www.linkedin.com/in/alireza-afshan",
  experience: [
    {
      title: "Independent Software, Research & Infrastructure Projects",
      organization: "Personal projects",
      location: "Las Vegas, NV",
      start: "May 2026",
      end: "Present",
      summary:
        "Building and validating developer tools, simulations, research software, and self-hosted web products across public and private repositories.",
      highlights: [
        "Built ForgeWard, a provider-neutral Python CLI that coordinates model-assisted software work through typed outputs, path and budget controls, deterministic checks, inspectable evidence, and explicit human approval gates.",
        "Developed verifier-first computational research repositories for open graph and number theory problems; published exact finite or conditional checkpoints while keeping every global problem explicitly unresolved.",
        "Built and evaluated interactive systems including a recurrent-controller worm terrarium with causal controls, a connectome-driven C. elegans simulation, and a reproducible batched-drone training harness.",
        "Built production-shaped product prototypes including RetainerProof, a multi-tenant client value ledger with background jobs, source-backed evidence, and a Dockerized demo environment.",
        "Built a signed webhook deployment manager that runs health-checked Docker rollouts with rollback support across multiple apps on one VPS behind Caddy.",
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
        "Led backend architecture and implementation for a custom attendance platform using TypeScript, NestJS, PostgreSQL, Docker, and REST APIs.",
        "Built and maintained the CI/CD pipeline, including automated test execution before merges to the main branch.",
        "Containerized backend services and supporting infrastructure, preparing the prototype for deployment.",
        "Developed Python access point software with local SQLite storage and helped consolidate RFID integration into the reader workflow.",
        "Supported React Native and Expo mobile development, including secure on-device storage with Expo SecureStore.",
        "Led GitHub onboarding, version control practices, technical documentation, and development guides for a six-person team.",
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
        "Built a Python-based image preparation tool to help designers clean and transform worksite photos before use in design workflows.",
        "Created an interface for perspective transformations, AI-assisted debris removal, automated output handling, and folder-based image export.",
        "Built a small web app to demonstrate the workflow and assisted with IT support, hardware troubleshooting, and machine configuration.",
      ],
    },
    {
      title: "Lead Developer - Drive Safe",
      organization: "Mobile App Proof of Concept",
      location: "Doha, Qatar",
      start: "December 2024",
      end: "April 2025",
      summary:
        "Mobile proof of concept for vehicle access verification in a Ministry of Education-aligned academic project.",
      highlights: [
        "Built a React Native mobile proof of concept for vehicle access verification with Firebase-backed data handling.",
        "Developed photo-based verification features to help prevent unauthorized vehicle use in a Ministry of Education-aligned academic project.",
      ],
    },
    {
      title: "Lead Developer - QR Attendance Verification",
      organization: "Mobile App Proof of Concept",
      location: "Doha, Qatar",
      start: "March 2025",
      end: "April 2025",
      summary:
        "Mobile attendance verification proof of concept using QR-code-based workflows.",
      highlights: [
        "Built a React Native and Firebase mobile proof of concept for QR-based student attendance verification.",
        "Adapted architecture from the Drive Safe project and implemented QR code generation and mobile permission handling.",
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
