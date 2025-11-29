// src/actions/team.ts

"use server";

import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { sendInvitationEmail } from "@/lib/emails/sendInvitationEmail";

const supabase = createServerSupabaseServiceClient();

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
    // 1. Get the current user (The Inviter)
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) return { success: false, error: "Not authenticated." };

    // 2. Check if the user already exists in your app (public.users)
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, user_email, username, name") // Select necessary fields
      .ilike("user_email", email) // Use ilike for case-insensitive search
      .maybeSingle();

    if (existingUser) {
      // --- PATH A: User Exists -> Add directly to Team ---

      // Check for duplicates
      const { data: alreadyInTeam } = await supabase
        .from("team_members")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", existingUser.id)
        .maybeSingle();

      if (alreadyInTeam) {
        return { success: false, error: `${email} is already in this team.` };
      }

      // 🛑 FIX: Ensure you are passing the required 'member_email' and 'user_id'
      const { error: insertError } = await supabase
        .from("team_members")
        .insert({
          project_id: projectId,
          user_id: existingUser.id,
          member_email: existingUser.user_email, // Required by your team_members schema
        });

      if (insertError) throw insertError;
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
          invited_by: currentUser.id,
          status: "pending",
          expires_at: expiresAt.toISOString(),
          accepted_at: null,
          created_at: new Date().toISOString(),
          // Ensure you set invited_by column if it exists and is required
        });

      if (inviteError) throw inviteError;

      // 4. Send the email (Requires fetching project/inviter details)
      const { data: projectData } = await supabase
        .from("projects")
        .select("project_name")
        .eq("id", projectId)
        .single();

      // Get inviter's username from users table
      const { data: inviterData } = await supabase
        .from("users")
        .select("username")
        .eq("user_email", currentUser.email)
        .single();

      const inviterName = inviterData?.username || "A team member";

      await sendInvitationEmail({
        to: email,
        projectName: projectData?.project_name || "Project",
        inviterName: inviterName,
        inviteToken: token,
        projectId: projectId,
      });

      return {
        success: true,
        message: "Invitation sent successfully.",
        isInvitation: true,
      };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
