"use client";
import React, { useEffect, useRef, useState } from "react";
import AddStepsSection from "@/app/components/AddStepsSection";
import { motion } from "motion/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateProjectTeamStatusAction } from "@/app/actions/projectaActions";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { processMultipleTeamMembersAction } from "@/app/actions/team";

type TeamMember = { id: string; member_email: string; user_id?: string | null };

interface ProjectDetailContentProps {
  projectId: string;
  projectName?: string;
  projectDescription?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  isGroupProject?: boolean | null;
  initialTeamMembers?: TeamMember[];
}

const ProjectDetailContent = ({
  projectId,
  projectName,
  projectDescription,
  department,
  startDate,
  endDate,
  isGroupProject: initialIsGroupProject,
  initialTeamMembers = [],
}: ProjectDetailContentProps) => {
  const router = useRouter();
  const [isGroupProject, setIsGroupProject] = useState<boolean | null>(
    initialIsGroupProject ?? null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isHandlingSelectionRef = useRef(false);
  const [noOfTeamMembers, setNoOfTeamMembers] = useState<number>(0);
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>([]);
  const [existingTeamMembers, setExistingTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);
  const [isAddingTeamMembers, setIsAddingTeamMembers] = useState(false);
  const [teamMembersError, setTeamMembersError] = useState<string | null>(null);
  const currentProjectId = projectId; // Get the ID from props or params
  // const inviteActionWithId = processTeamMemberAction.bind(
  //   null,
  //   currentProjectId
  // );
  const handleTeamMemberCountChange = (value: string) => {
    const parsedValue = Number(value);
    const sanitizedCount = Number.isNaN(parsedValue)
      ? 0
      : Math.floor(parsedValue);
    const clampedCount = Math.max(0, Math.min(10, sanitizedCount));

    setTeamMembersError(null);
    setNoOfTeamMembers(clampedCount);
    setTeamMemberEmails((prev) => {
      if (clampedCount > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: clampedCount - prev.length }, () => ""),
        ];
      }

      if (clampedCount < prev.length) {
        return prev.slice(0, clampedCount);
      }

      return prev;
    });
  };

  const handleTeamMemberEmailChange = (index: number, email: string) => {
    setTeamMembersError(null);
    setTeamMemberEmails((prev) =>
      prev.map((member, memberIndex) =>
        memberIndex === index ? email : member
      )
    );
  };

  const handleAddTeamMembers = async () => {
    const normalizedEmails = teamMemberEmails
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);

    if (normalizedEmails.length === 0) {
      setTeamMembersError("Please provide at least one team member email.");
      return;
    }

    const invalidEmails = normalizedEmails.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (invalidEmails.length > 0) {
      setTeamMembersError(
        `Invalid email address${
          invalidEmails.length > 1 ? "es" : ""
        }: ${invalidEmails.join(", ")}`
      );
      return;
    }

    // try {
    //   setTeamMembersError(null);
    //   setIsAddingTeamMembers(true);
    //   //const result = await addTeamMembersAction(projectId, normalizedEmails);
    //   const results = await Promise.all(
    //     normalizedEmails.map((email) =>
    //       processSingleTeamMemberAction(projectId, email)
    //     )
    //   );
    //   const addedMembers: TeamMember[] = []; // We can't easily track the IDs added in a loop like this
    //   let invitationsSent = 0;
    //   let membersAddedCount = 0;
    //   results.forEach((result) => {
    //     if (result.success) {
    //       membersAddedCount++;
    //     } else {
    //       setTeamMembersError(result.error || "Failed to add team member.");
    //     }
    //   });
    //   if (result.addedMembers && result.addedMembers.length > 0) {
    //     const sanitizedMembers: TeamMember[] = result.addedMembers
    //       .filter(
    //         (
    //           member
    //         ): member is {
    //           id: string;
    //           member_email: string | null;
    //           user_id: string | null;
    //         } => Boolean(member?.id)
    //       )
    //       .map((member) => ({
    //         id: member.id,
    //         member_email: member.member_email ?? "Unknown email",
    //         user_id: member.user_id ?? null,
    //       }));

    //     if (sanitizedMembers.length > 0) {
    //       setExistingTeamMembers((prev) => [...prev, ...sanitizedMembers]);
    //     }
    //   }

    //   // Show success message with invitation count
    //   if (result.invitationsSent > 0 || result.addedMembers.length > 0) {
    //     const addedCount = result.addedMembers.length;
    //     const invitedCount = result.invitationsSent;
    //     let message = "";
    // if (addedCount > 0 && invitedCount > 0) {
    //   message = `${addedCount} team member(s) added and ${invitedCount} invitation(s) sent.`;
    // } else if (addedCount > 0) {
    //   message = `${addedCount} team member(s) added.`;
    // } else if (invitedCount > 0) {
    //   message = `${invitedCount} invitation(s) sent. Users will receive an email to join the project.`;
    // }
    //     // Display success message
    //     setTeamMembersError(null);
    //     // Show toast notification
    //     if (typeof window !== "undefined") {
    //       const toast = document.createElement("div");
    //       toast.className =
    //         "fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    //       toast.textContent = message;
    //       document.body.appendChild(toast);
    //       setTimeout(() => {
    //         toast.remove();
    //       }, 3500);
    //     }
    //   }

    //   setNoOfTeamMembers(0);
    //   setTeamMemberEmails([]);
    //   router.refresh();
    // }
    // try {
    //   setTeamMembersError(null);
    //   setIsAddingTeamMembers(true);
    //   const results = await Promise.all(
    //     normalizedEmails.map((email) =>
    //       processSingleTeamMemberAction(projectId, email)
    //     )
    //   );
    //   let invitationsSent = 0;
    //   let membersAddedCount = 0;
    //   const addedMembers: TeamMember[] = [];
    //   results.forEach((result) => {
    //     if (result.success) {
    //       if(result.isInvitation) {
    //         invitationsSent++;
    //       } else {
    //         membersAddedCount++;
    //       }
    //     }
    //   });
    //   if (membersAddedCount > 0) {
    //     setTeamMembersError(null);
    //     router.refresh();
    // }
    // catch (error) {
    //   console.error("Failed to add team members:", error);
    //   setTeamMembersError(
    //     error instanceof Error
    //       ? error.message
    //       : "Failed to add team members. Please try again."
    //   );
    // } finally {
    //   setIsAddingTeamMembers(false);
    // }
    try {
      setTeamMembersError(null);
      setIsAddingTeamMembers(true);
      // 1. Call the server action that handles multiple emails
      const result = await processMultipleTeamMembersAction(
        projectId,
        normalizedEmails
      );

      // 2. Aggregate Results
      const addedMembers: TeamMember[] = [];
      let invitationsSent = 0;
      let membersAddedCount = 0;

      // Process the results from the server action
      const errors: string[] = [];
      result.results.forEach((item) => {
        if (item.success) {
          if (item.isInvitation) {
            invitationsSent++;
          } else {
            membersAddedCount++;
          }
        } else if (item.error) {
          errors.push(item.error);
        }
      });

      // Display any errors that occurred
      if (errors.length > 0) {
        setTeamMembersError(errors.join(". "));
      }

      // Since tracking the new ID is complicated, rely on router.refresh() for the list update.

      // 3. Success - counts are tracked (membersAddedCount and invitationsSent)

      setNoOfTeamMembers(0);
      setTeamMemberEmails([]);
      router.refresh(); // Crucial for updating the existingTeamMembers list
    } catch (error) {
      console.error("Error adding team members:", error);
      setTeamMembersError(
        error instanceof Error
          ? error.message
          : "Failed to add team members. Please try again."
      );
    } finally {
      setIsAddingTeamMembers(false);
    }
  };

  useEffect(() => {
    if (initialIsGroupProject === null || initialIsGroupProject === undefined) {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [initialIsGroupProject]);

  const handleSelection = async (value: boolean) => {
    isHandlingSelectionRef.current = true;
    setIsSaving(true);
    setIsGroupProject(value);
    setDialogOpen(false);

    try {
      await updateProjectTeamStatusAction(projectId, value);
      router.refresh();
    } catch (error) {
      console.error("Failed to update project team status:", error);
    } finally {
      setIsSaving(false);
      isHandlingSelectionRef.current = false;
    }
  };

  const projectStatusLabel =
    isGroupProject === null
      ? "Awaiting confirmation"
      : isGroupProject
        ? "Team project"
        : "Individual project";

  const projectStatusVariant =
    isGroupProject === null
      ? "outline"
      : isGroupProject
        ? "default"
        : "secondary";

  useEffect(() => {
    setExistingTeamMembers([...initialTeamMembers]);
  }, [initialTeamMembers]);

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col space-y-10 px-4 sm:px-6 lg:px-8">
        <AlertDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            const hasStoredValue =
              initialIsGroupProject !== null &&
              initialIsGroupProject !== undefined;

            if (
              !open &&
              !isHandlingSelectionRef.current &&
              !hasStoredValue &&
              isGroupProject === null
            ) {
              return;
            }

            setDialogOpen(open);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Is this a team project?</AlertDialogTitle>
              <AlertDialogDescription>
                Let us know whether you&apos;re working on this project on your
                own or with a team. We&apos;ll remember your choice for next
                time.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => handleSelection(false)}
                disabled={isSaving}
              >
                No, individual project
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleSelection(true)}
                disabled={isSaving}
              >
                Yes, it&apos;s a team project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Card className="shadow-lg border-border/60">
            <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  {projectName || "Project"}
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-relaxed">
                  {projectDescription ||
                    "Define your project goals and start outlining the steps needed to make it happen."}
                </CardDescription>
              </div>
              <CardAction className="flex flex-col items-start gap-3 sm:items-end">
                <Badge
                  variant={projectStatusVariant}
                  className="px-3 py-1 text-sm"
                >
                  {projectStatusLabel}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  Update team status
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-muted/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Department
                  </p>
                  <p className="mt-2 text-base font-semibold">
                    {department || "Not specified"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Start date
                  </p>
                  <p className="mt-2 text-base font-semibold">
                    {startDate || "Planning"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    End date
                  </p>
                  <p className="mt-2 text-base font-semibold">
                    {endDate || "To be decided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-6">
            {isGroupProject && (
              <Card className="shadow-lg border-border/60">
                <CardHeader className="pb-0">
                  <CardTitle>Team members</CardTitle>
                  <CardDescription>
                    Add team members to your project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-6 pt-2 sm:px-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <Label htmlFor="team-member-count">
                        No. of Team Members
                      </Label>
                      <Input
                        id="team-member-count"
                        type="number"
                        min={0}
                        max={10}
                        className="w-max"
                        value={noOfTeamMembers}
                        onChange={(e) =>
                          handleTeamMemberCountChange(e.target.value)
                        }
                      />
                    </div>
                    {teamMemberEmails.length > 0 && (
                      <div className="space-y-3">
                        {teamMemberEmails.map((member, index) => (
                          <div
                            key={`team-member-${index}`}
                            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
                          >
                            <Label
                              htmlFor={`team-member-${index}`}
                              className="sm:w-40"
                            >
                              Team member email {index + 1}
                            </Label>
                            <Input
                              id={`team-member-${index}`}
                              value={member}
                              placeholder="Enter email"
                              onChange={(e) =>
                                handleTeamMemberEmailChange(
                                  index,
                                  e.target.value
                                )
                              }
                              className="sm:flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {teamMembersError && (
                      <p className="text-sm font-medium text-destructive">
                        {teamMembersError}
                      </p>
                    )}
                    <div className="flex justify-center">
                      <Button
                        disabled={noOfTeamMembers === 0 || isAddingTeamMembers}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto mx-auto"
                        onClick={handleAddTeamMembers}
                      >
                        {isAddingTeamMembers ? "Adding..." : "Add team members"}
                      </Button>
                    </div>
                  </div>

                  {/* Team members list */}
                  {existingTeamMembers.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Team members</h3>
                      <div className="flex flex-wrap gap-2">
                        {existingTeamMembers.map((member) => (
                          <Button
                            key={member.id}
                            variant="secondary"
                            size="sm"
                            className="rounded-full"
                          >
                            {member.member_email}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            <Card className="shadow-lg border-border/60">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl font-semibold">
                  Build your project plan
                </CardTitle>
                <CardDescription>
                  Break the work down into actionable steps and track progress
                  as you go.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-6 pt-2 sm:px-4">
                <AddStepsSection
                  projectId={projectId}
                  teamMembers={existingTeamMembers}
                />
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetailContent;
