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

interface ProjectDetailContentProps {
  projectId: string;
  projectName?: string;
  projectDescription?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  isGroupProject?: boolean | null;
}

const ProjectDetailContent = ({
  projectId,
  projectName,
  projectDescription,
  department,
  startDate,
  endDate,
  isGroupProject: initialIsGroupProject,
}: ProjectDetailContentProps) => {
  const router = useRouter();
  const [isGroupProject, setIsGroupProject] = useState<boolean | null>(
    initialIsGroupProject ?? null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isHandlingSelectionRef = useRef(false);

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

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
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
          <Card className="shadow-lg border-border/60">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-semibold">
                Build your project plan
              </CardTitle>
              <CardDescription>
                Break the work down into actionable steps and track progress as
                you go.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pb-6 pt-2 sm:px-4">
              <AddStepsSection projectId={projectId} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetailContent;
