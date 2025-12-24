"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { acceptInvitationAction } from "@/app/actions/invitationActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

interface InviteAcceptContentProps {
  token: string;
  projectId: string;
  invitation: {
    email: string;
    projectName: string;
    expiresAt: string;
  };
  isAuthenticated: boolean;
}

export default function InviteAcceptContent({
  token,
  projectId,
  invitation,
  isAuthenticated,
}: InviteAcceptContentProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    // If user is authenticated, automatically accept the invitation
    // User is automatically registered during OAuth sign-in
    if (isAuthenticated && status === "pending") {
      handleAcceptInvitation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleAcceptInvitation = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await acceptInvitationAction(token);

      if (result.success) {
        setStatus("success");
        // Redirect to project page after a short delay
        setTimeout(() => {
          router.push(`/project/${projectId}`);
        }, 2000);
      } else {
        setStatus("error");
        setError(result.error || "Failed to accept invitation");
      }
    } catch (error) {
      setStatus("error");
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignIn = async (provider: "google" | "github") => {
    // Store the invitation token in sessionStorage so we can use it after OAuth
    if (typeof window !== "undefined") {
      sessionStorage.setItem("invitation_token", token);
      sessionStorage.setItem("invitation_project_id", projectId);
    }

    // Redirect to sign in with the provider
    await signIn(provider, {
      callbackUrl: `/invite/accept?token=${token}&project=${projectId}`,
    });
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="shadow-lg border-green-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-600">
                Invitation Accepted!
              </CardTitle>
              <CardDescription>
                You&apos;ve been successfully added to the project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Redirecting you to the project page...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (status === "error") {
    const isEmailMismatch = error?.includes("invitation was sent to");
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600">
                Error
              </CardTitle>
              <CardDescription className="whitespace-pre-line">
                {error || "Failed to accept invitation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEmailMismatch && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Make sure you sign in with the email address shown in the invitation ({invitation.email}).
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {isEmailMismatch && isAuthenticated && (
                  <Button
                    onClick={() => signOut({ callbackUrl: `/invite/accept?token=${token}&project=${projectId}` })}
                    variant="default"
                    className="w-full"
                  >
                    Sign Out & Try Again
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Accepting Invitation...
              </CardTitle>
              <CardDescription>Please wait while we add you to the project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              You&apos;ve been invited!
            </CardTitle>
            <CardDescription>
              Sign in to automatically register and accept the invitation to join{" "}
              <strong>{invitation.projectName}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Project:</strong> {invitation.projectName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {invitation.email}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => handleSignIn("google")}
                className="w-full"
                disabled={isProcessing}
              >
                Sign in with Google
              </Button>
              <Button
                onClick={() => handleSignIn("github")}
                variant="outline"
                className="w-full"
                disabled={isProcessing}
              >
                Sign in with GitHub
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-4">{error}</p>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
              <p className="text-xs text-blue-800">
                <strong>Important:</strong> Please sign in with the email address <strong>{invitation.email}</strong> to accept this invitation.
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By signing in, your account will be automatically created (if new) and you&apos;ll be added to this project.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

