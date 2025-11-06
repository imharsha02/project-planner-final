"use client";

import { TypographyH2 } from "../components/Typography/TypographyH2";
import ProjectDetailsForm from "../components/projectDetailsForm";
import { motion } from "motion/react";

const ProjectDetailsFormPage = () => {
  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <TypographyH2 className="text-center py-3 border-none tracking-wide w-full text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Add a project
        </TypographyH2>
        <p className="text-center text-muted-foreground mt-2">
          Create a new project and start organizing your work
        </p>
      </motion.div>
      <ProjectDetailsForm />
    </div>
  );
};
export default ProjectDetailsFormPage;
