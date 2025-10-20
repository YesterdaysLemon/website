import React from 'react'

type ResumeEducationSectionProps = {
  sectionData: {
    kind: 'education';
    institution: string;
    location: string;
    degree: string;
    duration: string;
    major: string;
    gpa: string;
    relevantCourseWork?: string[]
  };
}

type ResumeWorkSectionProps = {
  sectionData: {
    kind: 'work';
    institution: string;
    location: string;
    position: string;
    duration: string;
    bullets: string[];
  };
};

type ResumeSectionProps = ResumeEducationSectionProps | ResumeWorkSectionProps;

function ResumeEducationSection({ sectionData }: ResumeEducationSectionProps) {
  return (
    <div>
        <span className="mt-2 flex flex-row justify-between">
          <p className="text-gray-700">
            {sectionData?.institution}
          </p>
          <p className="text-sm">{sectionData?.location}</p>
        </span>
        <span className="flex flex-row justify-between">
          <p className="text-gray-700">{sectionData?.degree}</p>
          <p className="text-sm">{sectionData?.duration}</p>
        </span>
        <p className="text-sm">{sectionData?.major}</p>
        <p className="text-sm">{sectionData?.gpa}</p>
        {sectionData?.relevantCourseWork && (
          <div>
            <h2 className="text-sm">Relevant Coursework</h2>
            <p className="text-sm">
                {sectionData.relevantCourseWork?.join(', ')}
            </p>
          </div>
        )}
      </div>
  )
}

function ResumeWorkSection({ sectionData }: ResumeWorkSectionProps) {
  return (
    <div>
        <span className="mt-2 flex flex-row justify-between">
          <p className="text-gray-700">
            {sectionData?.institution}
          </p>
          <p className="text-sm">{sectionData?.location}</p>
        </span>
        <span className="flex flex-row justify-between">
          <p className="text-gray-700">{sectionData?.position}</p>
          <p className="text-sm">{sectionData?.duration}</p>
        </span>
        <ul className="list-disc pl-5">
          {sectionData?.bullets.map((bullet, index) => (
            <li key={index} className="text-sm">{bullet}</li>
          ))}
        </ul>
      </div>
  )
}

function ResumeSection({ sectionData }: ResumeSectionProps) {
  switch (sectionData.kind) {
    case 'education':
      return <ResumeEducationSection sectionData={sectionData} />;
    case 'work':
      return <ResumeWorkSection sectionData={sectionData} />;
    default:
      return null;
  }
}

export default ResumeSection;
