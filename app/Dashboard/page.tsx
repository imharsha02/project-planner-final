import React from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex gap-4">
        {projects.map((project) => (
          <div key={project.id} className="w-max mx-auto">
            <Card className="w-max p-4">
              <CardHeader>
                <CardTitle>{project.project_name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p>{project.department}</p>
                <p>{project.start_date}</p>
                <p>{project.end_date}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardPage;
