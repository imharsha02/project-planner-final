import { auth } from "@/app/auth";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export async function getProjects() {
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
  }

  return projects;
}
