import React from "react";
import { getProjects } from "@/app/lib/getProjects";
import AddStepsSection from "@/app/components/AddStepsSection";
const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const project = await getProjects();
  return (
    <>
      {/* Heading */}
      <div className="py-4">
        <h2 className="scroll-m-20 text-center tracking-wide text-3xl font-semibold">
          {project?.find((project) => project.id === id)?.project_name}
        </h2>
        <p className="text-center tracking-wide font-light">
          {project?.find((project) => project.id === id)?.project_description}
        </p>
      </div>

      {/* page content */}
      <AddStepsSection projectId={id} />
    </>
  );
};

export default Page;
