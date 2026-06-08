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
  role: "Junior Software Developer | Systems & DevOps",
  summary:
    "Recent Information Systems graduate with honors and hands-on experience building full-stack, mobile, and backend systems. Skilled in developing APIs, containerizing services, maintaining CI/CD workflows, and working across software, infrastructure, and hardware-adjacent environments. Brings a strong foundation in programming, databases, Linux, networking, and systems design, supported by prior academic training in mathematics and astronomy. Seeking entry-level software development, backend, systems, or DevOps opportunities.",
  location: "Las Vegas, NV - relocating June 15, 2026",
  email: "alirezaafshan4@gmail.com",
  websiteUrl: "https://alirezaafshan.com",
  githubUrl: "https://github.com/YesterdaysLemon",
  linkedInUrl: "https://www.linkedin.com/in/alireza-afshan",
  experience: [
    {
      title: "Lead Developer - CentraID Capstone Project",
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
        "React",
        "React Native",
        "Expo",
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
        "REST APIs",
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
