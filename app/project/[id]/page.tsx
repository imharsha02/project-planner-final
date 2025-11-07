import React from "react";
import { getProjects } from "@/app/lib/getProjects";
import ProjectDetailContent from "./ProjectDetailContent";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const project = await getProjects();
  const currentProject = project?.find((project) => project.id === id);

  return (
    <ProjectDetailContent
      projectId={id}
      projectName={currentProject?.project_name}
      projectDescription={currentProject?.project_description}
      department={currentProject?.department}
      startDate={currentProject?.start_date || undefined}
      endDate={currentProject?.end_date || undefined}
      isGroupProject={currentProject?.is_group_project ?? null}
    />
  );
};

export default Page;
