import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import ProjectInvitationEmail from "@/app/emails/ProjectInvitationEmail";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, projectName, inviterName, inviteToken, projectId } = body;

    // Validate required fields
    if (!to || !projectName || !inviterName || !inviteToken || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const inviteUrl = `${baseUrl}/invite/accept?token=${inviteToken}&project=${projectId}`;

    // Render email HTML
    const emailHtml = await render(
      React.createElement(ProjectInvitationEmail, {
        projectName,
        inviterName,
        inviteUrl,
        recipientEmail: to,
      })
    );

    // Render email text version
    const emailText = await render(
      React.createElement(ProjectInvitationEmail, {
        projectName,
        inviterName,
        inviteUrl,
        recipientEmail: to,
      }),
      { plainText: true }
    );

    // Send email
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
      return NextResponse.json(
        { error: `Failed to send invitation email: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in send-invitation API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
