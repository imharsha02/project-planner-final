import React from "react";
import { getProjects } from "../lib/getProjects";
import { ProjectCard } from "../components/ProjectCard";
const DashboardPage = async () => {
  const projects = await getProjects();
  return (
    <>
      {projects && projects.length > 0 ? (
        <div className="flex gap-4 flex-wrap py-4">
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
