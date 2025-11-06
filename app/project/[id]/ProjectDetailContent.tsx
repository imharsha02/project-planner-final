"use client";
import React from "react";
import AddStepsSection from "@/app/components/AddStepsSection";
import { motion } from "motion/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [isGroupProject, setIsGroupProject] = useState(false);
  const handleGroupProject = (value: string) => {
    setIsGroupProject(value === "yes");
  };
  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-4 text-center space-y-3"
      >
        <h2 className="scroll-m-20 text-center tracking-wide text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-4">
          {projectName || "Project"}
        </h2>
        {projectDescription && (
          <p className="text-center tracking-wide text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            {projectDescription}
          </p>
        )}
        {(department || startDate || endDate) && (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-4 text-xs sm:text-sm text-muted-foreground px-4">
            {department && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted/50 border border-border/50">
                <span className="font-semibold">Department:</span> {department}
              </span>
            )}
            {startDate && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted/50 border border-border/50">
                <span className="font-semibold">Start:</span> {startDate}
              </span>
            )}
            {endDate && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-muted/50 border border-border/50">
                <span className="font-semibold">End:</span> {endDate}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* page content */}
      <AddStepsSection projectId={projectId} />
      {/* If the number of steps is more than 5, ask if it's a group project */}
    </div>
  );
};

export default ProjectDetailContent;
