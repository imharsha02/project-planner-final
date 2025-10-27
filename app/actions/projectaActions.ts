"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";

export async function createProjectAction(formData: FormData) {
  const projectDepartment = formData.get("department");
  const projectName = formData.get("projectName");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const thumbnail = formData.get("thubmnail");

  // Check if user is authenticated
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a project.");
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        department: projectDepartment,
        project_name: projectName,
        start_date: startDate,
        end_date: endDate,
        thumbnail_url: thumbnail,
      },
    ])
    .select();
  if (error) {
    console.error("Supabase Insertion Error:", error);
    // You can handle specific error types here (e.g., if RLS blocks it)
    throw new Error(
      "Failed to create project. Check if you are logged in and registered."
    );
  }

  // 4. On success, redirect the user

  redirect("/Dashboard");
}
