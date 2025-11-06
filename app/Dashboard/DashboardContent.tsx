"use client";
import React from "react";
import { ProjectCard } from "../components/ProjectCard";
import { motion } from "motion/react";

interface Project {
  id: string;
  project_name: string;
  department: string;
  start_date: string | null;
  end_date: string | null;
}

interface DashboardContentProps {
  projects: Project[];
}

const DashboardContent = ({ projects }: DashboardContentProps) => {
  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Your Projects
        </h1>
        <p className="text-muted-foreground">Manage and track all your projects</p>
      </motion.div>
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              project_name={project.project_name}
              department={project.department}
              start_date={project.start_date}
              end_date={project.end_date}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground max-w-md">
            Get started by creating your first project. Click "Add a Project" to begin organizing your work.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardContent;

