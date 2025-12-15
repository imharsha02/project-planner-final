import { auth } from "@/app/auth";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export async function getProjects() {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    redirect("/");
  }
  const supabase = createServerSupabaseServiceClient();

  // Get the database user ID from the users table (needed for team_members lookup)
  const normalizedEmail = session.user.email.toLowerCase().trim();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("user_email", normalizedEmail)
    .single();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return [];
  }

  const databaseUserId = user.id;
  const oauthUserId = session.user.id; // OAuth ID used in projects.user_id

  // Fetch projects where user is the owner (projects.user_id uses OAuth ID)
  const { data: ownedProjects, error: ownedError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", oauthUserId);

  if (ownedError) {
    console.error("Error fetching owned projects:", ownedError);
  }

  // Fetch projects where user is a team member (team_members.user_id uses database UUID)
  const { data: teamMemberships, error: teamError } = await supabase
    .from("team_members")
    .select("project_id")
    .eq("user_id", databaseUserId);

  if (teamError) {
    console.error("Error fetching team memberships:", teamError);
  }

  // Get project IDs where user is a team member
  const teamProjectIds = teamMemberships?.map((tm) => tm.project_id) || [];

  // Fetch projects where user is a team member
  let teamProjects: any[] = [];
  if (teamProjectIds.length > 0) {
    const { data: teamProjectsData, error: teamProjectsError } = await supabase
      .from("projects")
      .select("*")
      .in("id", teamProjectIds);

    if (teamProjectsError) {
      console.error("Error fetching team projects:", teamProjectsError);
    } else {
      teamProjects = teamProjectsData || [];
    }
  }

  // Combine owned and team projects, removing duplicates
  const allProjects = [
    ...(ownedProjects || []),
    ...teamProjects.filter(
      (tp) => !ownedProjects?.some((op) => op.id === tp.id)
    ),
  ];

  return allProjects;
}
