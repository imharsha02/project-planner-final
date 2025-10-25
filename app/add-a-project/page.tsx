"use client";
import Link from "next/link";
import { TypographyH2 } from "../components/Typography/TypographyH2";
import ProjectDetailsForm from "../components/projectDetailsForm";
import { Button } from "@/components/ui/button";
const ProjectDetailsFormPage = () => {
  return (
    <div>
      <div className="flex items-center">
        <Button asChild={true} title="Back to Dashboard" className="mx-4">
          <Link href="/Dashboard">&lt;</Link>
        </Button>
        <TypographyH2 className="text-center py-3 border-none tracking-wide w-full">
          Add a project
        </TypographyH2>
      </div>
      <ProjectDetailsForm />
    </div>
  );
};
export default ProjectDetailsFormPage;
