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
  notes: string[];
};

export type ResumeData = {
  name: string;
  role: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  githubUrl: string;
  pdfPath: string;
  experience: ResumeRole[];
  education: ResumeEducation[];
  skills: {
    technical: string[];
    languages: string[];
    additional: string[];
  };
  certifications: {
    title: string;
    issuer: string;
    date: string;
  }[];
};

export const resumeData: ResumeData = {
  name: "Alireza Afshan",
  role: "Software and Systems Engineer",
  summary:
    "Software and systems engineering student with hands-on experience leading mobile, backend, and DevOps-focused projects in academic and government-aligned settings.",
  location: "Doha, Qatar",
  email: "mail@alirezaafshan.com",
  phone: "+974 5089 1117",
  githubUrl: "https://github.com/YesterdaysLemon",
  pdfPath: "/resume/Alireza_Afshanv4.pdf",
  experience: [
    {
      title: "Lead Developer",
      organization: "Mobile App Project - Drive Safe",
      location: "Doha, Qatar",
      start: "December 2024",
      end: "April 2025",
      summary:
        "Worked with a colleague on a proof of concept for the Qatar Ministry of Education focused on restricting unauthorized access to a vehicle.",
      highlights: [
        "Built a React Native mobile interface.",
        "Used Firebase for cloud data management.",
        "Implemented photo-based verification as part of the access flow.",
      ],
    },
    {
      title: "Lead Developer",
      organization: "Mobile App Project - QR Attendance Verification",
      location: "Doha, Qatar",
      start: "March 2025",
      end: "April 2025",
      summary:
        "Adapted the Drive Safe architecture into a second proof of concept for verifying student attendance with QR codes.",
      highlights: [
        "Reused and extended the existing React Native application structure.",
        "Used Firebase for cloud data management.",
        "Handled QR code generation, device permissions, and mobile workflows.",
      ],
    },
    {
      title: "Lead Developer",
      organization: "UDST Capstone Project - CentraID",
      location: "Doha, Qatar",
      start: "September 2025",
      end: "Expected May 2026",
      summary:
        "Contributing to a hybrid RFID and mobile attendance system with a student team, with emphasis on architecture, platform choices, and delivery pipeline work.",
      highlights: [
        "Contributed to software architecture and microservice planning.",
        "Helped choose the project technology stack and evaluate new features such as Wi-Fi RTT.",
        "Set up CI/CD workflows and containerized backend services with Docker.",
      ],
    },
  ],
  education: [
    {
      institution: "University of Arizona",
      degree: "Bachelor of Science in Mathematics (incomplete)",
      location: "Tucson, Arizona",
      start: "September 2018",
      end: "May 2022",
      notes: [
        "Completed coursework through year three before interruption.",
        "Relevant coursework included astronomy and mathematics.",
      ],
    },
    {
      institution: "University of Doha for Science and Technology",
      degree: "Bachelor of Science in Information Systems",
      location: "Doha, Qatar",
      start: "January 2023",
      end: "Expected May 2026",
      notes: [
        "Coursework includes software engineering, DevOps, systems design, Linux, networking, and system administration.",
        "Primary languages and tools across coursework include Java, JavaScript, and Python.",
      ],
    },
  ],
  skills: {
    technical: [
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express",
      "TypeScript",
      "React",
      "React Native",
      "Tailwind CSS",
      "Java",
      "Python",
      "MySQL",
      "MongoDB",
      "Redis",
      "Git",
      "GitHub",
      "Docker",
    ],
    languages: ["English (native)", "Farsi (conversational)"],
    additional: [
      "Object-oriented programming",
      "Database management",
      "Hardware testing and soldering",
      "Public speaking",
      "Custom keyboards",
      "Botany",
      "Guitar",
    ],
  },
  certifications: [
    {
      title: "Cybersecurity Foundation",
      issuer: "Palo Alto Cybersecurity Program",
      date: "May 2024",
    },
    {
      title: "Certificate of Recognition",
      issuer: "Ministry of Higher Education, Scientific Research Competition",
      date: "April 2025",
    },
  ],
};
