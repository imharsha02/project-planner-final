"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datePicker";
import { departments } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createProjectAction } from "../actions/projectaActions";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  department: z.string().nonempty(),
  projectName: z.string().nonempty(),
  startDate: z.string(),
  endDate: z.string(),
  thumbnail: z.string().optional(),
  projectDetails: z.string(),
});

interface ProjectDetailsFormProps {
  initialData?: {
    department?: string;
    project_name?: string;
    start_date?: string;
    end_date?: string;
    project_description?: string;
  };
  buttonText?: string;
}

const ProjectDetailsForm = ({
  initialData,
  buttonText,
}: ProjectDetailsFormProps) => {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: initialData?.department || "",
      projectName: initialData?.project_name || "",
      startDate: initialData?.start_date || "",
      endDate: initialData?.end_date || "",
      thumbnail: "",
      projectDetails: initialData?.project_description || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("department", values.department);
      formData.append("projectName", values.projectName);
      formData.append("startDate", values.startDate || "");
      formData.append("endDate", values.endDate || "");
      if (values.thumbnail) {
        formData.append("thubmnail", values.thumbnail);
      }
      formData.append("projectDetails", values.projectDetails);
      await createProjectAction(formData);
      router.push("/Dashboard");
      router.refresh();
    } catch (error) {
      // Handle errors from server action
      console.error("Error creating project:", error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="min-w-[120px] font-semibold">
                        Project Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name your project"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="min-w-[120px] font-semibold">
                        Department
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectGroup key={department}>
                                <SelectItem value={department}>
                                  {department}
                                </SelectItem>
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="min-w-[120px] font-semibold">
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="min-w-[120px] font-semibold">
                        End Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="min-w-[120px] font-semibold">
                        Thumbnail
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <FormField
                  control={form.control}
                  name="projectDetails"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-4">
                      <FormLabel className="min-w-[120px] font-semibold pt-2">
                        Project Details
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short description of your project"
                          {...field}
                          className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="submit"
                  className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  {buttonText || "Add Project"}
                </Button>
              </motion.div>
            </motion.form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectDetailsForm;
