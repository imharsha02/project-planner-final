"use client";
import React, { useEffect, useRef, useState } from "react";
import AddStepsSection from "@/app/components/AddStepsSection";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
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
import {
  Building2,
  Calendar,
  Users,
  Settings,
  Mail,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

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
    try {
      setTeamMembersError(null);
      setIsAddingTeamMembers(true);
      // 1. Call the server action that handles multiple emails
      const result = await processMultipleTeamMembersAction(
        projectId,
        normalizedEmails
      );

      // 2. Aggregate Results
      let invitationsSent = 0;
      let membersAddedCount = 0;

      // Process the results from the server action
      const errors: string[] = [];
      const warnings: string[] = [];
      result.results.forEach((item) => {
        if (item.success) {
          if (item.isInvitation) {
            invitationsSent++;
            // Check if there's an error message indicating email failure
            if (item.error && item.error.includes("Email sending failed")) {
              warnings.push(item.error);
            }
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
        toast.error("Failed to add some team members", {
          description: errors.join(". "),
        });
      } else if (warnings.length > 0) {
        // Show warnings if emails failed but invitations were created
        const warningMessage = `${warnings.length} invitation(s) created but email(s) failed to send: ${warnings.join(". ")}`;
        setTeamMembersError(`⚠️ ${warningMessage}`);
        toast.warning("Invitations created but emails failed", {
          description: warnings.join(". "),
        });
      } else {
        // Show success toast notifications
        if (invitationsSent > 0 && membersAddedCount > 0) {
          toast.success("Team members added successfully!", {
            description: `${membersAddedCount} member(s) added and ${invitationsSent} invitation(s) sent.`,
          });
        } else if (invitationsSent > 0) {
          toast.success("Invitation(s) sent successfully!", {
            description: `${invitationsSent} invitation email(s) sent. Users will receive an email to join the project.`,
          });
        } else if (membersAddedCount > 0) {
          toast.success("Team member(s) added successfully!", {
            description: `${membersAddedCount} member(s) added to the project.`,
          });
        }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl flex flex-col space-y-8 px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Back Button and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/Dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Project Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    {projectName || "Project"}
                  </CardTitle>
                  {projectDescription && (
                    <CardDescription className="text-base leading-relaxed max-w-3xl">
                      {projectDescription}
                    </CardDescription>
                  )}
                </div>
                <CardAction className="flex flex-col items-start sm:items-end gap-3">
                  <Badge
                    variant={projectStatusVariant}
                    className="px-3 py-1.5 text-sm"
                  >
                    {projectStatusLabel}
                  </Badge>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogOpen(true)}
                      className="w-full sm:w-auto"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Update Status
                    </Button>
                  </motion.div>
                </CardAction>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Department
                    </p>
                    <p className="text-base font-semibold truncate">
                      {department || "Not specified"}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Start Date
                    </p>
                    <p className="text-base font-semibold">
                      {formatDate(startDate) || "Not set"}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      End Date
                    </p>
                    <p className="text-base font-semibold">
                      {formatDate(endDate) || "Not set"}
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {/* Team Members Section */}
          <AnimatePresence>
            {isGroupProject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle>Team Members</CardTitle>
                    </div>
                    <CardDescription>
                      Invite team members to collaborate on this project.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Team Members Form */}
                    <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <Label
                          htmlFor="team-member-count"
                          className="text-sm font-medium"
                        >
                          Number of Team Members
                        </Label>
                        <Input
                          id="team-member-count"
                          type="number"
                          min={0}
                          max={10}
                          className="w-full sm:w-32"
                          value={noOfTeamMembers}
                          onChange={(e) =>
                            handleTeamMemberCountChange(e.target.value)
                          }
                        />
                      </div>
                      <AnimatePresence>
                        {teamMemberEmails.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3"
                          >
                            {teamMemberEmails.map((member, index) => (
                              <motion.div
                                key={`team-member-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
                              >
                                <Label
                                  htmlFor={`team-member-${index}`}
                                  className="text-sm font-medium sm:w-40"
                                >
                                  Email {index + 1}
                                </Label>
                                <Input
                                  id={`team-member-${index}`}
                                  type="email"
                                  value={member}
                                  placeholder="team.member@example.com"
                                  onChange={(e) =>
                                    handleTeamMemberEmailChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  className="sm:flex-1"
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {teamMembersError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium text-destructive p-3 rounded-md bg-destructive/10 border border-destructive/20"
                        >
                          {teamMembersError}
                        </motion.p>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          disabled={
                            noOfTeamMembers === 0 || isAddingTeamMembers
                          }
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={handleAddTeamMembers}
                        >
                          {isAddingTeamMembers ? (
                            "Adding..."
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Team Members
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>

                    {/* Existing Team Members List */}
                    {existingTeamMembers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">
                            Current Team ({existingTeamMembers.length})
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {existingTeamMembers.map((member, index) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge
                                variant="secondary"
                                className="px-3 py-1.5 text-sm flex items-center gap-2"
                              >
                                <Mail className="h-3 w-3" />
                                {member.member_email}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Project Steps Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Project Steps
                </CardTitle>
                <CardDescription>
                  Break your project into actionable steps and track progress as
                  you go.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddStepsSection
                  projectId={projectId}
                  teamMembers={existingTeamMembers}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailContent;
