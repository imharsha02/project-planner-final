import React from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { ProjectCard } from "../components/ProjectCard";
const DashboardPage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }
  const supabase = createServerSupabaseServiceClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id);
  if (error) {
    console.error("Supabase Error:", error);
    return <div>Error loading projects</div>;
  }
  return (
    <>
      {projects.length > 0 ? (
        <div className="flex gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              project_name={project.project_name}
              department={project.department}
              start_date={project.start_date}
              end_date={project.end_date}
            />
          ))}
        </div>
      ) : (
        <div>
          <p>No projects yet</p>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
