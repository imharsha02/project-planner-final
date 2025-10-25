"use client";
import { TypographyH2 } from "../components/Typography/TypographyH2";
import ProjectDetailsForm from "../components/projectDetailsForm";
const ProjectDetailsFormPage = () => {
  return (
    <div>
      <TypographyH2 className="text-center py-3 border-none tracking-wide w-full">
        Add a project
      </TypographyH2>
      <ProjectDetailsForm />
    </div>
  );
};
export default ProjectDetailsFormPage;
