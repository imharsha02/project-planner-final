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
    } catch (error) {
      // Handle errors from server action
      console.error("Error creating project:", error);
      if (error instanceof Error) {
        // Display error to user (you might want to use a toast or form error state instead)
        alert(error.message);
      } else {
        alert("Failed to create project. Please try again.");
      }
    }
  }

  return (
    <Card className="w-max mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name your poject" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Slect a department" />
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

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem className="flex items-center">
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDetails"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel>Project Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short discription of your project"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full cursor-pointer">
              {buttonText || "Add Project"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectDetailsForm;
