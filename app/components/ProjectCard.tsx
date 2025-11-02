"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectCardProps {
  id: string;
  project_name: string;
  department: string;
  start_date: string | null;
  end_date: string | null;
}

export function ProjectCard({
  id,
  project_name,
  department,
  start_date,
  end_date,
}: ProjectCardProps) {
  const router = useRouter();

  return (
    <div key={id} className="w-max mx-auto">
      <Card
        className="w-max p-4 cursor-pointer hover:shadow-2xs transition"
        onClick={() => router.push(`/project/${id}`)}
      >
        <CardHeader>
          <CardTitle>{project_name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p>{department}</p>
          <p>{start_date}</p>
          <p>{end_date}</p>
        </CardContent>
      </Card>
    </div>
  );
}
