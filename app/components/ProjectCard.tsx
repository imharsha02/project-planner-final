"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/app/actions/projectaActions";

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

  const deleteProject = async (projectId: string) => {
    await deleteProjectAction(projectId);
    router.refresh();
  };

  return (
    <div key={id} className="w-max mx-auto">
      <Card className="w-max p-4 px-0 hover:shadow-2xs transition">
        <CardHeader className="flex items-center justify-between border-b">
          <CardTitle>{project_name}</CardTitle>
          <Button
            variant="outline"
            className="cursor-pointer rounded-full w-max"
            onClick={() => deleteProject(id)}
          >
            <Trash2Icon />
          </Button>
        </CardHeader>
        <CardContent
          onClick={() => router.push(`/project/${id}`)}
          className="flex flex-col gap-2 cursor-pointer"
        >
          <p>{department}</p>
          <p>{start_date}</p>
          <p>{end_date}</p>
        </CardContent>
      </Card>
    </div>
  );
}
