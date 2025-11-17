"use server";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

const supabase = createServerSupabaseServiceClient();
/**
 * Accept an invitation by token
 * This should be called after the user has authenticated
 */
export async function acceptInvitationAction(
  token: string,
  userId: string
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

    // Get user's email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_email, username")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    // Verify the email matches the invitation
    if (user.user_email.toLowerCase() !== invitation.email.toLowerCase()) {
      return {
        success: false,
        error: "This invitation was sent to a different email address.",
      };
    }

    // Check if user is already a team member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("project_id", invitation.project_id)
      .eq("user_id", userId)
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
      user_id: userId,
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
        accepted_by: userId,
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
