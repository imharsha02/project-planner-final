import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import {
  getInvitationAction,
  acceptInvitationAction,
} from "@/app/actions/invitationActions";
import InviteAcceptContent from "./InviteAcceptContent";

interface InviteAcceptPageProps {
  searchParams: Promise<{ token?: string; project?: string }>;
}

export default async function InviteAcceptPage({
  searchParams,
}: InviteAcceptPageProps) {
  const params = await searchParams;
  const token = params.token;
  const projectId = params.project;

  if (!token) {
    redirect("/");
  }

  // Get invitation details
  const invitationResult = await getInvitationAction(token);

  if (!invitationResult.success || !invitationResult.invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-red-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Invitation
            </h1>
            <p className="text-gray-600">{invitationResult.error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  const session = await auth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteAcceptContent
        token={token}
        projectId={projectId || invitationResult.invitation.projectId}
        invitation={invitationResult.invitation}
        isAuthenticated={!!session?.user?.id}
        userId={session?.user?.id}
      />
    </Suspense>
  );
}
