import React from "react";
import { getProjects } from "@/app/lib/getProjects";
import { TypographyH2 } from "@/app/components/Typography/TypographyH2";
import { TypographyP } from "@/app/components/Typography/TypographyP";
const ProjectId = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const projects = await getProjects();
  const project = projects?.find((project) => project.id === id);
  console.log(project);
  return (
    <div className="a m-10">
      {project && (
        <div>
          {/* Heading of the page */}
          <div>
            <TypographyH2 className="tracking-wide border-none text-center">
              {project.project_name}
            </TypographyH2>
            <TypographyP className="tracking-wide border-none text-center">
              {project.project_description}
            </TypographyP>
            <TypographyP className="tracking-wide border-none text-center">
              {project.start_date}
            </TypographyP>
            <TypographyP className="tracking-wide border-none text-center">
              {project.end_date}
            </TypographyP>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectId;
