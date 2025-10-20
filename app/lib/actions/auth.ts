"use server";
import { signIn, signOut } from "../../auth";

export const login = async () => {
  await signIn("github", { redirectTo: "/Home" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/Home" });
};
