import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const departments = [
  "IT / Computer Science",
  "Architecture",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Business",
];
