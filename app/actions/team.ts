// src/actions/team.ts

"use server";

import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { sendInvitationEmail } from "@/lib/emails/sendInvitationEmail";
import { auth } from "@/app/auth";

const supabase = createServerSupabaseServiceClient();

export async function processMultipleTeamMembersAction(
  projectId: string,
  emails: string[]
): Promise<{
  success: boolean;
  error?: string;
  results: Array<{
    success: boolean;
    error?: string;
    message?: string;
    isInvitation?: boolean;
  }>;
}> {
  const results = await Promise.all(
    emails.map((email) => processSingleTeamMemberAction(projectId, email))
  );

  const hasErrors = results.some((r) => !r.success);
  return {
    success: !hasErrors,
    results,
  };
}

export async function processSingleTeamMemberAction(
  projectId: string,
  email: string // <-- Now expects the email directly
): Promise<{
  success: boolean;
  error?: string;
  message?: string;
  isInvitation?: boolean;
}> {
  // We only expect one email input for now, based on your screenshot

  if (!email || !projectId) {
    return { success: false, error: "Email and Project ID are required." };
  }

  try {
    // 1. Get the current user (The Inviter) using NextAuth
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated." };
    }

    // Get the current user from the users table
    const { data: currentUserData, error: currentUserError } = await supabase
      .from("users")
      .select("id, user_email, username")
      .eq("user_email", session.user.email)
      .single();

    if (currentUserError || !currentUserData) {
      return {
        success: false,
        error: "User not found. Please ensure you are logged in.",
      };
    }

    // 2. Check if the user already exists in your app (public.users)
    // Normalize email to lowercase for consistent lookup
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Looking up user with email: ${normalizedEmail}`);

    const { data: existingUser, error: lookupError } = await supabase
      .from("users")
      .select("id, user_email, username, name")
      .ilike("user_email", normalizedEmail) // Use ilike for case-insensitive search
      .maybeSingle();

    if (lookupError) {
      console.error(`Error looking up user ${normalizedEmail}:`, lookupError);
    }

    console.log(
      `User lookup result for ${normalizedEmail}:`,
      existingUser ? "Found" : "Not found"
    );

    if (existingUser) {
      // --- PATH A: User Exists -> Add directly to Team ---
      console.log(
        `User ${email} exists in users table, adding directly to team...`
      );

      // Check for duplicates
      const { data: alreadyInTeam } = await supabase
        .from("team_members")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", existingUser.id)
        .maybeSingle();

      if (alreadyInTeam) {
        console.log(`User ${email} is already in this team.`);
        return { success: false, error: `${email} is already in this team.` };
      }

      // Add existing user directly to team_members
      console.log(
        `Adding user ${email} (ID: ${existingUser.id}) to team_members...`
      );
      const { error: insertError } = await supabase
        .from("team_members")
        .insert({
          project_id: projectId,
          user_id: existingUser.id,
          member_email: existingUser.user_email,
        });

      if (insertError) {
        console.error(`Failed to add user ${email} to team:`, insertError);
        throw insertError;
      }

      console.log(`✅ Successfully added user ${email} to team.`);
      return {
        success: true,
        message: `${email} added to team successfully.`,
        isInvitation: false,
      };
    } else {
      // --- PATH B: User Does NOT Exist -> Create Invitation ---

      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Check if invite is already pending (avoid sending duplicate emails)
      const { data: existingInvite } = await supabase
        .from("project_invitations")
        .select("id")
        .eq("email", email)
        .eq("project_id", projectId)
        .eq("status", "pending")
        .maybeSingle();

      if (existingInvite) {
        return {
          success: false,
          error: "Invitation already sent to this email.",
        };
      }

      // 3. Insert into project_invitations
      const { error: inviteError } = await supabase
        .from("project_invitations")
        .insert({
          project_id: projectId,
          email: email,
          token: token,
          invited_by: currentUserData.id,
          status: "pending",
          expires_at: expiresAt.toISOString(),
          accepted_at: null,
          created_at: new Date().toISOString(),
        });

      if (inviteError) throw inviteError;

      // 4. Send the email (Requires fetching project/inviter details)
      const { data: projectData } = await supabase
        .from("projects")
        .select("project_name")
        .eq("id", projectId)
        .single();

      // Use the username we already fetched
      const inviterName = currentUserData.username || "A team member";

      try {
        console.log(`Attempting to send invitation email to ${email}...`);
        await sendInvitationEmail({
          to: email,
          projectName: projectData?.project_name || "Project",
          inviterName: inviterName,
          inviteToken: token,
          projectId: projectId,
        });
        console.log(`✅ Invitation email sent successfully to ${email}`);
      } catch (emailError) {
        const errorMessage =
          emailError instanceof Error ? emailError.message : "Unknown error";
        console.error(
          `❌ Failed to send invitation email to ${email}:`,
          errorMessage
        );
        console.error("Full error:", emailError);

        // Even if email fails, the invitation is already in the database
        // So we return success but with a warning message
        return {
          success: true,
          message: `Invitation created but email failed to send: ${errorMessage}`,
          isInvitation: true,
          error: `Email sending failed: ${errorMessage}`, // Also include in error field
        };
      }

      return {
        success: true,
        message: "Invitation sent successfully.",
        isInvitation: true,
      };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}
