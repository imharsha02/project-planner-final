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
    const projects = await getProjects().catch((error) => {
      console.error("Error fetching projects:", error);
      return null;
    });

    const currentProject = projects?.find((project) => project.id === id);

    // If project not found in user's projects, check if user is a team member
    let projectData = currentProject;
    if (!projectData) {
      const supabase = createServerSupabaseServiceClient();
      // Get user's database ID
      const normalizedEmail = session?.user?.email?.toLowerCase().trim();
      if (normalizedEmail) {
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("user_email", normalizedEmail)
          .single();

        if (user) {
          // Check if user is a team member of this project
          const { data: teamMember } = await supabase
            .from("team_members")
            .select("project_id")
            .eq("project_id", id)
            .eq("user_id", user.id)
            .maybeSingle();

          if (teamMember) {
            // Fetch the project data
            const { data: project } = await supabase
              .from("projects")
              .select("*")
              .eq("id", id)
              .single();
            projectData = project;
          }
        }
      }
    }

    // Check if user is the owner
    const isOwner = projectData?.user_id === session?.user?.id;

    // If project not found and user is not a team member, show error
    if (!projectData) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-600">
              You don't have access to this project.
            </p>
          </div>
        </div>
      );
    }

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
        projectName={projectData?.project_name}
        projectDescription={projectData?.project_description}
        department={projectData?.department}
        startDate={projectData?.start_date || undefined}
        endDate={projectData?.end_date || undefined}
        isGroupProject={projectData?.is_group_project ?? null}
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
