"use server";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

const supabase = createServerSupabaseServiceClient();

export async function getProfileAction() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, user_email")
    .eq("user_email", session.user.email)
    .single();
  if (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile.");
  }
  console.log(user);
  console.log(error);
  console.log(session.user.email);
  console.log(session.user.id);
  console.log(session.user.name);
  return user;
}

export async function updateUsernameAction(username: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to update your username.");
  }

  if (!username || username.trim().length === 0) {
    throw new Error("Username cannot be empty.");
  }

  // Normalize email to lowercase
  const normalizedEmail = session.user.email.toLowerCase().trim();

  const { data, error } = await supabase
    .from("users")
    .update({ username: username.trim() })
    .eq("user_email", normalizedEmail)
    .select()
    .single();

  if (error) {
    console.error("Error updating username:", error);
    throw new Error(
      `Failed to update username: ${error.message || "Unknown error"}`
    );
  }

  return data;
}
