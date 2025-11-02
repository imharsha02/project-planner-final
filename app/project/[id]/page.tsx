import React from "react";
import { getProjects } from "@/app/lib/getProjects";
import { TypographyH2 } from "@/app/components/Typography/TypographyH2";
const ProjectId = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const projects = await getProjects();
  const project = projects?.find((project) => project.id === id);
  console.log(project);
  return (
    <div className="a m-10">
      {/* TODO: Add individual project details */}
      {project ? (
        <div>
          <TypographyH2 className="tracking-wide border-none text-center">
            {project.project_name}
          </TypographyH2>
          {project.department}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProjectId;
