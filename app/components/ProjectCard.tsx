"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/app/actions/projectaActions";
import { motion } from "motion/react";
import { TypographyP } from "./Typography/TypographyP";

interface ProjectCardProps {
  id: string;
  project_name: string;
  department: string;
  start_date: string | null;
  end_date: string | null;
  index?: number;
}

export function ProjectCard({
  id,
  project_name,
  department,
  start_date,
  end_date,
  index = 0,
}: ProjectCardProps) {
  const router = useRouter();

  const deleteProject = async (projectId: string) => {
    await deleteProjectAction(projectId);
    router.refresh();
  };

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="w-full max-w-sm"
    >
      <Card className="w-full h-full px-0 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group overflow-hidden">
        <CardHeader className="flex items-center border-b px-4 py-3 justify-between relative z-10 bg-gradient-to-r from-card to-card/95">
          <CardTitle className="group-hover:text-primary transition-colors duration-200">
            {project_name}
          </CardTitle>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              className="cursor-pointer rounded-full w-8 h-8 p-0 hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(id);
              }}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </motion.div>
        </CardHeader>
        <CardContent
          onClick={() => router.push(`/project/${id}`)}
          className="flex flex-col gap-3 cursor-pointer p-4 relative z-10"
        >
          <TypographyP>
            <span className="font-semibold text-muted-foreground">
              Department:
            </span>{" "}
            <span className="text-foreground">{department}</span>
          </TypographyP>
          <TypographyP>
            <span className="font-semibold text-muted-foreground">
              Start Date:
            </span>{" "}
            <span className="text-foreground">{start_date || "Not set"}</span>
          </TypographyP>
          <TypographyP>
            <span className="font-semibold text-muted-foreground">
              End Date:
            </span>{" "}
            <span className="text-foreground">{end_date || "Not set"}</span>
          </TypographyP>
        </CardContent>
      </Card>
    </motion.div>
  );
}
