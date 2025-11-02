"use server";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { randomUUID } from "crypto";

export async function createProjectAction(formData: FormData) {
  const projectDepartment = formData.get("department") as string | null;
  const projectName = formData.get("projectName") as string | null;
  const startDate = formData.get("startDate") as string | null;
  const endDate = formData.get("endDate") as string | null;
  const thumbnail = formData.get("thubmnail") as File | null;
  const projectDetails = formData.get("projectDetails") as string | null;
  // Check if user is authenticated
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a project.");
  }

  // Validate required fields
  if (!projectDepartment || !projectName) {
    throw new Error("Department and project name are required.");
  }

  const supabase = createServerSupabaseServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        id: randomUUID(),
        department: projectDepartment,
        project_name: projectName,
        start_date: startDate || null,
        end_date: endDate || null,
        thumbnail_url: thumbnail ? thumbnail.name : null,
        user_id: session.user.id,
        project_description: projectDetails || null,
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
