"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Building2, ArrowRight } from "lucide-react";
import { deleteProjectAction } from "@/app/actions/projectaActions";
import { motion } from "motion/react";

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
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
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
        <motion.div
          whileHover={{
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Card className="h-full flex flex-col cursor-pointer border-border/50 group shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="space-y-1 flex-1">
            <motion.div
              whileHover={{ color: "hsl(var(--primary))" }}
              transition={{ duration: 0.2 }}
            >
              <CardTitle className="text-lg line-clamp-2">
                {project_name}
              </CardTitle>
            </motion.div>
            <Badge variant="secondary" className="mt-1">
              <Building2 className="mr-1 h-3 w-3" />
              {department}
            </Badge>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardHeader>
        
        <CardContent 
          className="flex-1"
          onClick={() => router.push(`/project/${id}`)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="space-y-3"
          >
            <motion.div
              className="flex items-start gap-2 text-sm"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">Start Date</p>
                <p className="font-medium">{formatDate(start_date)}</p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-start gap-2 text-sm"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">End Date</p>
                <p className="font-medium">{formatDate(end_date)}</p>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>

        <CardFooter 
          className="pt-4 border-t"
          onClick={() => router.push(`/project/${id}`)}
        >
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Button variant="ghost" className="w-full justify-between" size="sm">
              View Details
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <ArrowRight className="h-4 w-4 ml-2" />
              </motion.div>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
        </motion.div>
    </motion.div>
  );
}
