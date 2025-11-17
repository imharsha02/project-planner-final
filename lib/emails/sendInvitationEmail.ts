import { render } from "@react-email/render";
import { Resend } from "resend";
import ProjectInvitationEmail from "@/app/emails/ProjectInvitationEmail";

let resendClient: Resend | null = null;
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured. Set it in your environment and restart the server."
    );
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

interface SendInvitationEmailParams {
  to: string;
  projectName: string;
  inviterName: string;
  inviteToken: string;
  projectId: string;
}

export async function sendInvitationEmail({
  to,
  projectName,
  inviterName,
  inviteToken,
  projectId,
}: SendInvitationEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const inviteUrl = `${baseUrl}/invite/accept?token=${inviteToken}&project=${projectId}`;

  const emailHtml = render(
    ProjectInvitationEmail({
      projectName,
      inviterName,
      inviteUrl,
      recipientEmail: to,
    })
  );

  const emailText = render(
    ProjectInvitationEmail({
      projectName,
      inviterName,
      inviteUrl,
      recipientEmail: to,
    }),
    { plainText: true }
  );

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject: `Invitation to join ${projectName}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error("Failed to send invitation email:", error);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error sending invitation email:", error);
    throw error;
  }
}
