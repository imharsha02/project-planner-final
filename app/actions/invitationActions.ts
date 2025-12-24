"use server";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { auth } from "@/app/auth";

const supabase = createServerSupabaseServiceClient();
/**
 * Accept an invitation by token
 * This automatically accepts the invitation after OAuth sign-in
 * The user is automatically registered during OAuth sign-in
 */
export async function acceptInvitationAction(
  token: string
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  try {
    // Find the invitation
    const { data: invitation, error: inviteError } = await supabase
      .from("project_invitations")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .single();

    if (inviteError || !invitation) {
      return {
        success: false,
        error: "Invalid or expired invitation.",
      };
    }

    // Check if invitation has expired
    const expiresAt = new Date(invitation.expires_at);
    if (expiresAt < new Date()) {
      return {
        success: false,
        error: "This invitation has expired.",
      };
    }

    // Get the current user's email from NextAuth session
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Not authenticated. Please sign in to accept this invitation.",
      };
    }

    const sessionEmail = session.user.email.toLowerCase();
    const invitationEmail = invitation.email.toLowerCase();

    // Verify the email matches the invitation
    if (sessionEmail !== invitationEmail) {
      return {
        success: false,
        error: `This invitation was sent to ${invitation.email}, but you are signed in as ${session.user.email}. Please sign out and sign in with the email address the invitation was sent to.`,
      };
    }

    // Get user from users table by email (user should exist after OAuth sign-in)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, user_email, username")
      .eq("user_email", sessionEmail)
      .single();

    if (userError || !user) {
      return {
        success: false,
        error: "User account not found. Please try signing in again.",
      };
    }

    // Check if user is already a team member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("project_id", invitation.project_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMember) {
      // User is already a member, just mark invitation as accepted
      await supabase
        .from("project_invitations")
        .update({ status: "accepted", accepted_at: new Date().toISOString() })
        .eq("token", token);

      return {
        success: true,
        projectId: invitation.project_id,
      };
    }

    // Add user to team_members
    const { error: insertError } = await supabase.from("team_members").insert({
      id: randomUUID(),
      project_id: invitation.project_id,
      member_email: user.user_email,
      user_id: user.id,
    });

    if (insertError) {
      console.error("Error adding team member:", insertError);
      return {
        success: false,
        error: "Failed to add you to the team.",
      };
    }

    // Mark invitation as accepted
    await supabase
      .from("project_invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        accepted_by: user.id,
      })
      .eq("token", token);

    return {
      success: true,
      projectId: invitation.project_id,
    };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

/**
 * Get invitation details by token
 */
export async function getInvitationAction(token: string) {
  try {
    const { data: invitation, error } = await supabase
      .from("project_invitations")
      .select("*, projects(project_name)")
      .eq("token", token)
      .eq("status", "pending")
      .single();

    if (error || !invitation) {
      return {
        success: false,
        error: "Invalid or expired invitation.",
      };
    }

    // Check if invitation has expired
    const expiresAt = new Date(invitation.expires_at);
    if (expiresAt < new Date()) {
      return {
        success: false,
        error: "This invitation has expired.",
      };
    }

    return {
      success: true,
      invitation: {
        email: invitation.email,
        projectId: invitation.project_id,
        projectName: (invitation.projects as any)?.project_name || "Project",
        expiresAt: invitation.expires_at,
      },
    };
  } catch (error) {
    console.error("Error getting invitation:", error);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}
