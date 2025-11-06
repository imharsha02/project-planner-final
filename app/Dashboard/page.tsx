import React from "react";
import { getProjects } from "../lib/getProjects";
import DashboardContent from "./DashboardContent";

const DashboardPage = async () => {
  const projects = await getProjects();
  return <DashboardContent projects={projects || []} />;
};

export default DashboardPage;
