import React from "react";
import { getProjects } from "@/app/lib/getProjects";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { auth } from "@/app/auth";
import ProjectDetailContent from "./ProjectDetailContent";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    if (!id) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-600">Invalid project ID.</p>
          </div>
        </div>
      );
    }

    const session = await auth();
    const project = await getProjects().catch((error) => {
      console.error("Error fetching projects:", error);
      return null;
    });

    const currentProject = project?.find((project) => project.id === id);
    
    // Check if user is the owner
    const isOwner = currentProject?.user_id === session?.user?.id;

    const supabase = createServerSupabaseServiceClient();
    const { data: teamMembersData, error: teamMembersError } = await supabase
      .from("team_members")
      .select("id, member_email")
      .eq("project_id", id);

    if (teamMembersError) {
      console.error("Error fetching team members:", teamMembersError);
    }

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
        isOwner={isOwner}
      />
    );
  } catch (error) {
    console.error("Error in project page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-destructive mb-4">
            Error Loading Project
          </h1>
          <p className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }
};

export default Page;
