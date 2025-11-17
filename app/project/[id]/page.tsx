import React from "react";
import { getProjects } from "@/app/lib/getProjects";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import ProjectDetailContent from "./ProjectDetailContent";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const project = await getProjects();
  const currentProject = project?.find((project) => project.id === id);
  const supabase = createServerSupabaseServiceClient();
  const { data: teamMembersData } = await supabase
    .from("team_members")
    .select("id, member_email")
    .eq("project_id", id);
  const initialTeamMembers =
    teamMembersData?.flatMap((member) =>
      member?.id && member?.member_email
        ? [{ id: member.id, member_email: member.member_email }]
        : []
    ) ?? [];

  return (
    <ProjectDetailContent
      projectId={id}
      projectName={currentProject?.project_name}
      projectDescription={currentProject?.project_description}
      department={currentProject?.department}
      startDate={currentProject?.start_date || undefined}
      endDate={currentProject?.end_date || undefined}
      isGroupProject={currentProject?.is_group_project ?? null}
      initialTeamMembers={initialTeamMembers}
    />
  );
};

export default Page;
