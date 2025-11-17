"use server";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { randomUUID } from "crypto";

// Create Supabase client once at module level (cached by Next.js)
// The helper function also has internal caching, so this is safe and optimal
const supabase = createServerSupabaseServiceClient();

export async function createProjectAction(formData: FormData) {
  const projectDepartment = formData.get("department") as string | null;
  const projectName = formData.get("projectName") as string | null;
  const startDate = formData.get("startDate") as string | null;
  const endDate = formData.get("endDate") as string | null;
  const thumbnail = formData.get("thubmnail") as File | null;
  const projectDetails = formData.get("projectDetails") as string | null;
  // Check if user is authenticated
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a project.");
  }

  // Validate required fields
  if (!projectDepartment || !projectName) {
    throw new Error("Department and project name are required.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        id: randomUUID(),
        department: projectDepartment,
        project_name: projectName,
        start_date: startDate || null,
        end_date: endDate || null,
        thumbnail_url: thumbnail ? thumbnail.name : null,
        user_id: session.user.id,
        project_description: projectDetails || null,
      },
    ])
    .select();
  if (error) {
    console.error("Supabase Insertion Error:", error);
    // You can handle specific error types here (e.g., if RLS blocks it)
    throw new Error(
      "Failed to create project. Check if you are logged in and registered."
    );
  }

  // 4. On success, redirect the user

  redirect("/Dashboard");
}

export async function createStepAction(formData: FormData) {
  const stepName = formData.get("stepName") as string | null;
  const projectId = formData.get("projectId") as string | null;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a step.");
  }
  if (!stepName || !projectId) {
    throw new Error("Step name and project ID are required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .insert([
      {
        id: randomUUID(),
        step: stepName,
        project_id: projectId,
      },
    ])
    .select();
  if (error) {
    console.error("Supabase Insertion Error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error(
      `Failed to create step: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function getStepsAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to fetch steps.");
  }
  if (!projectId) {
    throw new Error("Project ID is required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .select("*")
    .eq("project_id", projectId);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to fetch steps: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function updateStepAction(formData: FormData) {
  const stepId = formData.get("stepId") as string | null;
  const stepName = formData.get("stepName") as string | null;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a step.");
  }
  if (!stepId || !stepName) {
    throw new Error("Step ID and step name are required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .update({ step: stepName })
    .eq("id", stepId)
    .select();
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to update step: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function deleteStepAction(stepId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a step.");
  }
  if (!stepId) {
    throw new Error("Step ID is required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .delete()
    .eq("id", stepId);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to delete step: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function deleteProjectAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a project.");
  }
  if (!projectId) {
    throw new Error("Project ID is required.");
  }
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to delete project: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function updateProjectTeamStatusAction(
  projectId: string,
  isGroupProject: boolean
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a project.");
  }
  if (!projectId) {
    throw new Error("Project ID is required.");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ is_group_project: isGroupProject })
    .eq("id", projectId)
    .select();

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to update project: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }

  return data;
}

export async function addTeamMembersAction(
  projectId: string,
  emails: string[]
): Promise<{
  addedMembers: Array<{
    id: string;
    member_email: string | null;
    user_id: string | null;
  }>;
  invitationsSent: number;
}> {
  const session = await auth();
  const inviterUserId = session?.user?.id;
  if (!inviterUserId) {
    throw new Error("You must be logged in to add team members.");
  }

  if (!projectId) {
    throw new Error("Project ID is required to add team members.");
  }

  // Get inviter's name and project name
  const { data: inviterData } = await supabase
    .from("users")
    .select("username")
    .eq("id", inviterUserId)
    .single();

  const { data: projectData } = await supabase
    .from("projects")
    .select("project_name")
    .eq("id", projectId)
    .single();

  const inviterName = inviterData?.username || "A team member";
  const projectName = projectData?.project_name || "the project";

  // Normalize emails
  const normalizedEmails = emails
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);

  if (normalizedEmails.length === 0) {
    throw new Error("Please provide at least one team member email.");
  }

  // Check which emails exist in users table
  const { data: existingUsers, error: usersError } = await supabase
    .from("users")
    .select("id, user_email, username")
    .in("user_email", normalizedEmails);

  if (usersError) {
    console.error("Error checking existing users:", usersError);
    throw new Error("Failed to check existing users.");
  }

  // Normalize existing user emails for comparison
  const existingEmails = new Set(
    (existingUsers || []).map((user) => user.user_email.toLowerCase())
  );
  const newEmails = normalizedEmails.filter(
    (email) => !existingEmails.has(email)
  );

  // Debug logging
  console.log("Normalized emails:", normalizedEmails);
  console.log("Existing users found:", existingUsers?.length || 0);
  console.log("New emails to invite:", newEmails.length);

  // Add existing users to team_members
  const addedMembers: Array<{
    id: string;
    member_email: string | null;
    user_id: string | null;
  }> = [];

  if (existingUsers && existingUsers.length > 0) {
    // Check which users are already team members to avoid duplicates
    const existingUserIds = existingUsers.map((user) => user.id);
    const { data: existingTeamMembers } = await supabase
      .from("team_members")
      .select("user_id, member_email")
      .eq("project_id", projectId)
      .in("user_id", existingUserIds);

    const existingMemberUserIds = new Set(
      existingTeamMembers?.map((tm) => tm.user_id) || []
    );

    // Filter out users who are already team members
    const usersToAdd = existingUsers.filter(
      (user) => !existingMemberUserIds.has(user.id)
    );

    if (usersToAdd.length > 0) {
      const teamMemberRows = usersToAdd.map((user) => ({
        id: randomUUID(),
        project_id: projectId,
        member_email: user.user_email,
        user_id: user.id,
      }));

      const { data: insertedMembers, error: insertError } = await supabase
        .from("team_members")
        .insert(teamMemberRows)
        .select("id, member_email, user_id");

      if (insertError) {
        console.error("Error adding existing team members:", insertError);
        console.error(
          "Insert error details:",
          JSON.stringify(insertError, null, 2)
        );
        throw new Error(
          `Failed to add existing team members: ${insertError.message || "Unknown error"}`
        );
      }

      if (insertedMembers) {
        addedMembers.push(...insertedMembers);
      }
    }
  }

  // Create invitations for new emails
  let invitationsSent = 0;
  if (newEmails.length > 0) {
    const invitationRows = newEmails.map((email) => {
      const inviteToken = randomUUID();
      return {
        id: randomUUID(),
        project_id: projectId,
        email: email,
        token: inviteToken,
        invited_by: inviterUserId,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days from now
        status: "pending",
      };
    });

    // First, try to send emails before creating invitation records
    // This ensures we don't create orphaned invitations if email sending fails
    console.log(
      `Attempting to send ${newEmails.length} invitation email(s)...`
    );
    const { sendInvitationEmail } = await import(
      "@/lib/emails/sendInvitationEmail"
    );

    const emailErrors: Array<{ email: string; error: string }> = [];

    for (const email of newEmails) {
      try {
        const invitation = invitationRows.find((inv) => inv.email === email);
        if (invitation) {
          console.log(`Sending invitation email to: ${email}`);
          await sendInvitationEmail({
            to: email,
            projectName,
            inviterName,
            inviteToken: invitation.token,
            projectId,
          });
          console.log(`Successfully sent invitation email to: ${email}`);
          invitationsSent++;
        } else {
          const errorMsg = `Invitation not found for email: ${email}`;
          console.error(errorMsg);
          emailErrors.push({ email, error: errorMsg });
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`Failed to send invitation to ${email}:`, error);
        emailErrors.push({ email, error: errorMsg });
      }
    }

    // If no emails were sent successfully, throw an error
    if (invitationsSent === 0 && newEmails.length > 0) {
      const errorMessages = emailErrors
        .map((e) => `${e.email}: ${e.error}`)
        .join("; ");
      throw new Error(
        `Failed to send any invitation emails. Errors: ${errorMessages}`
      );
    }

    // Only create invitation records if at least one email was sent successfully
    if (invitationsSent > 0) {
      // Filter to only include invitations for emails that were successfully sent
      const successfulEmails = newEmails.filter((email) => {
        return !emailErrors.some((e) => e.email === email);
      });
      const successfulInvitations = invitationRows.filter((inv) =>
        successfulEmails.includes(inv.email)
      );

      const { error: invitationError } = await supabase
        .from("project_invitations")
        .insert(successfulInvitations);

      if (invitationError) {
        console.error("Error creating invitations:", invitationError);
        throw new Error(
          `Failed to create invitations: ${invitationError.message || "Unknown error"}`
        );
      }

      // If some emails failed, log warnings but don't fail the entire operation
      if (emailErrors.length > 0) {
        console.warn(
          `Successfully sent ${invitationsSent} invitation(s), but ${emailErrors.length} failed:`,
          emailErrors
        );
      }
    }
  }

  return {
    addedMembers,
    invitationsSent,
  };
}

export async function updateStepAssignmentAction(
  stepId: string,
  memberId: string | null
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update assignments.");
  }

  if (!stepId) {
    throw new Error("Step ID is required to update assignments.");
  }

  const { data, error } = await supabase
    .from("custom_steps_table")
    .update({ assigned_member_id: memberId })
    .eq("id", stepId)
    .select();

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to update assignment: ${
        error.message || "Unknown error. Please try again."
      }`
    );
  }

  return data;
}
