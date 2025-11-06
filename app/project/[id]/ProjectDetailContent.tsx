"use client";
import React from "react";
import AddStepsSection from "@/app/components/AddStepsSection";
import { motion } from "motion/react";

interface ProjectDetailContentProps {
  projectId: string;
  projectName?: string;
  projectDescription?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
}

const ProjectDetailContent = ({
  projectId,
  projectName,
  projectDescription,
  department,
  startDate,
  endDate,
}: ProjectDetailContentProps) => {
  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 text-center space-y-3"
      >
        <h2 className="scroll-m-20 text-center tracking-wide text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {projectName || "Project"}
        </h2>
        {projectDescription && (
          <p className="text-center tracking-wide text-muted-foreground max-w-2xl mx-auto text-lg">
            {projectDescription}
          </p>
        )}
        {(department || startDate || endDate) && (
          <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
            {department && (
              <span className="px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                <span className="font-semibold">Department:</span> {department}
              </span>
            )}
            {startDate && (
              <span className="px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                <span className="font-semibold">Start:</span> {startDate}
              </span>
            )}
            {endDate && (
              <span className="px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                <span className="font-semibold">End:</span> {endDate}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* page content */}
      <AddStepsSection projectId={projectId} />
    </div>
  );
};

export default ProjectDetailContent;
