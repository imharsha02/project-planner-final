"use server";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { randomUUID } from "crypto";

// Create Supabase client once at module level (cached by Next.js)
// The helper function also has internal caching, so this is safe and optimal
const supabase = createServerSupabaseServiceClient();

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

export async function createStepAction(formData: FormData) {
  const stepName = formData.get("stepName") as string | null;
  const projectId = formData.get("projectId") as string | null;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a step.");
  }
  if (!stepName || !projectId) {
    throw new Error("Step name and project ID are required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .insert([
      {
        id: randomUUID(),
        step: stepName,
        project_id: projectId,
      },
    ])
    .select();
  if (error) {
    console.error("Supabase Insertion Error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error(
      `Failed to create step: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function getStepsAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to fetch steps.");
  }
  if (!projectId) {
    throw new Error("Project ID is required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .select("*")
    .eq("project_id", projectId);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to fetch steps: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function updateStepAction(formData: FormData) {
  const stepId = formData.get("stepId") as string | null;
  const stepName = formData.get("stepName") as string | null;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a step.");
  }
  if (!stepId || !stepName) {
    throw new Error("Step ID and step name are required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .update({ step: stepName })
    .eq("id", stepId)
    .select();
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to update step: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function deleteStepAction(stepId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a step.");
  }
  if (!stepId) {
    throw new Error("Step ID is required.");
  }
  const { data, error } = await supabase
    .from("custom_steps_table")
    .delete()
    .eq("id", stepId);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to delete step: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}

export async function deleteProjectAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a project.");
  }
  if (!projectId) {
    throw new Error("Project ID is required.");
  }
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(
      `Failed to delete project: ${
        error.message ||
        "Unknown error. Check if you are logged in and registered."
      }`
    );
  }
  return data;
}
