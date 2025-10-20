import { Link } from "react-router";
import type { Route } from "./+types/resume";
import ResumeSection from "~/components/resumeSection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "alireza afshan resume" },
    { name: "alireza afshan resume", content: "alireza afshan resume" },
  ];
}

export default function Resume() {
  return (
    <div className="container mx-auto font-serif">
      <div className="flex h-screen flex-col items-center justify-start p-4">
        <h1 className="text-2xl font-bold">ALIREZA AFSHAN</h1>
        <p>
          Las Vegas, NV | Doha, Qatar | P: +974 5089 1117 |
          mail@alirezaafshan.com, alirezaafshan4@gmail.com
        </p>
        <div className="container my-4 w-full">
          <h1 className="text-gray-700">EDUCATION</h1>
          <div className="flex flex-col border-t-2 border-black">
            <ResumeSection sectionData={{
            kind: "education",
            institution: "UNIVERSITY OF DOHA FOR SCIENCE AND TECHNOLOGY",
            location: "Doha, QA",
            degree: "Bachelor of Science",
            duration: "Expected, Jan, 2023 - May, 2026",
            major: "Major in Information Systems; College of Computing",
            gpa: "Cumulative GPA: ~3.8",
            relevantCourseWork: [
              "Data Structures and Algorithms",
              "Web Development",
              "Database Management Systems",
              "Software Engineering",
              "Computer Networks",
              "Linux Administration",
              "Cloud Computing",
              "Cybersecurity Fundamentals", 
              "Mobile Application Development",
            ]
          }} />
          <ResumeSection sectionData={{
            kind: "education",
            institution: "UNIVERSITY OF ARIZONA",
            location: "Tucson, AZ",
            degree: "Bachelor of Science",
            duration: "Not Completed, Sept 2017 - Mar, 2021",
            major: "Major in Astronomy/Mathematics",
            gpa: "Cumulative GPA: ~3.2"
          }} />
        </div>
        <h1 className="text-gray-700 mt-2">WORK EXPERIENCE</h1>
          <div className="flex flex-col border-t-2 border-black">
            <ResumeSection sectionData={{
            kind: "work",
            institution: "UNIVERSITY OF DOHA FOR SCIENCE AND TECHNOLOGY",
            location: "Doha, QA",
            position: "Intern",
            duration: "Expected, Jan, 2023 - May, 2026",
            bullets: ["Worked on developing a web application using React and Node.js", "Collaborated with a team of developers to design and implement new features", "Participated in code reviews and contributed to improving code quality"]
          }} />
          
        </div>
      </div>
    </div>
    </div>
  );
}
