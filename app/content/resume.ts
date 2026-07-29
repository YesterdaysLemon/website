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
    "Information Systems graduate with honors who likes working where software meets systems. I build backend services, developer tools, simulations, and small full-stack products, with an emphasis on deterministic tests, inspectable evidence, safe automation, and honest system boundaries. Recent work spans a security-first AI delivery harness, reproducible computational research, browser-based physics and biology experiments, and the deployment infrastructure behind the small apps on this site. I am looking for junior software, backend, systems, developer tooling, or DevOps roles.",
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
        "Built deterministic interactive systems including a recurrent-controller worm terrarium with causal controls and replayable evaluation, a connectome-driven C. elegans simulation, and a tested Godot card-duel vertical slice.",
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
      label: "Languages",
      details: [
        "TypeScript",
        "JavaScript",
        "Python",
        "Java",
        "SQL",
        "HTML",
        "CSS",
      ],
    },
    {
      label: "Frameworks & Tools",
      details: [
        "NestJS",
        "Node.js",
        "Express",
        "Next.js",
        "Fastify",
        "React",
        "React Native",
        "Expo",
        "Godot",
        "Three.js",
        "Vite",
        "Tailwind",
      ],
    },
    {
      label: "Databases",
      details: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Firebase"],
    },
    {
      label: "DevOps & Systems",
      details: [
        "Docker",
        "Git",
        "GitHub",
        "GitHub Actions",
        "CI/CD",
        "Linux",
        "Caddy",
        "nginx",
        "VPS deployment",
        "REST APIs",
      ],
    },
    {
      label: "Testing & Delivery",
      details: [
        "Pytest",
        "Playwright",
        "TypeScript",
        "Ruff",
        "CodeQL",
        "Deterministic replay",
        "Evidence-gated evaluation",
        "Human-in-the-loop workflows",
      ],
    },
    {
      label: "Concepts",
      details: [
        "Object-Oriented Programming",
        "Software Architecture",
        "Systems Design",
        "Networking",
        "Database Design",
      ],
    },
    {
      label: "Hardware & Systems",
      details: [
        "RFID systems",
        "Access point software",
        "Soldering",
        "Hardware testing",
        "Firmware",
        "Keyboards",
      ],
    },
    {
      label: "Spoken Languages",
      details: ["English", "Farsi"],
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
