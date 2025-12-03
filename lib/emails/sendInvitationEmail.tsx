import React from "react";
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
  console.log("📧 sendInvitationEmail called with:", {
    to,
    projectName,
    inviterName,
  });

  if (!process.env.RESEND_API_KEY) {
    const errorMsg =
      "RESEND_API_KEY is not configured. Please set it in your environment variables.";
    console.error("❌", errorMsg);
    throw new Error(errorMsg);
  }

  console.log("✅ RESEND_API_KEY is configured");

  // Get the base URL for invitation links
  // Priority: NEXTAUTH_URL > NEXT_PUBLIC_APP_URL > fallback to localhost
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  console.log("🌐 Base URL for invitation:", baseUrl);
  const inviteUrl = `${baseUrl}/invite/accept?token=${inviteToken}&project=${projectId}`;
  console.log("🔗 Invitation URL:", inviteUrl);

  let emailHtml: string;
  let emailText: string;

  try {
    // Render email HTML
    emailHtml = await render(
      <ProjectInvitationEmail
        projectName={projectName}
        inviterName={inviterName}
        inviteUrl={inviteUrl}
        recipientEmail={to}
      />
    );

    // Render email text version
    emailText = await render(
      <ProjectInvitationEmail
        projectName={projectName}
        inviterName={inviterName}
        inviteUrl={inviteUrl}
        recipientEmail={to}
      />,
      { plainText: true }
    );
  } catch (renderError) {
    console.error("Error rendering email template:", renderError);
    throw new Error(
      `Failed to render email template: ${
        renderError instanceof Error ? renderError.message : String(renderError)
      }`
    );
  }

  try {
    const resend = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    console.log(`📤 Sending email from ${fromEmail} to ${to}...`);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `Invitation to join ${projectName}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error("❌ Resend API error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      // Provide helpful error message for domain verification issues
      let errorMessage = error.message || JSON.stringify(error);
      if (errorMessage.includes("testing emails to your own email address")) {
        errorMessage = `You can only send testing emails to your own email address when using onboarding@resend.dev. To send emails to other recipients, please verify a domain at https://resend.com/domains and set RESEND_FROM_EMAIL to an email using that domain.`;
      }

      throw new Error(`Failed to send invitation email: ${errorMessage}`);
    }

    console.log("✅ Email sent successfully. Response:", data);
    return data;
  } catch (sendError) {
    console.error("Error sending invitation email:", sendError);
    if (sendError instanceof Error) {
      console.error("Send error stack:", sendError.stack);
      console.error("Send error message:", sendError.message);
    }
    throw sendError;
  }
}
