"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { TypographyH2 } from "@/app/components/Typography/TypographyH2";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { TypographyP } from "./Typography/TypographyP";
import {
  createStepAction,
  getStepsAction,
  deleteStepAction,
  updateStepAction,
  updateStepAssignmentAction,
} from "@/app/actions/projectaActions";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TeamMember = { id: string; member_email: string };
type StepWithAssignment = {
  id: string;
  step: string;
  assigned_member_id: string | null;
};

const parseSteps = (
  data: Array<any> | null | undefined
): StepWithAssignment[] =>
  (data ?? []).map((step) => ({
    id: step.id,
    step: step.step,
    assigned_member_id:
      typeof step.assigned_member_id === "string" &&
      step.assigned_member_id.length > 0
        ? step.assigned_member_id
        : null,
  }));

export default function AddStepsSection({
  projectId,
  teamMembers = [],
}: {
  projectId: string;
  teamMembers?: TeamMember[];
}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [stepName, setStepName] = useState("");
  const [steps, setSteps] = useState<StepWithAssignment[]>([]);
  const [stepCompletion, setStepCompletion] = useState<Record<string, number>>(
    {}
  );
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingStepName, setEditingStepName] = useState<string>("");

  // Debug: Log when editingStepId changes
  useEffect(() => {
    console.log("editingStepId changed to:", editingStepId);
  }, [editingStepId]);

  // Fetch existing steps when component mounts
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const data = await getStepsAction(projectId);
        console.log("Fetched steps data:", data);
        setSteps(parseSteps(data));
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };
    fetchSteps();
  }, [projectId]);
  const deleteStep = async (stepId: string) => {
    try {
      await deleteStepAction(stepId);
      const allSteps = await getStepsAction(projectId);
      setSteps(parseSteps(allSteps));
    } catch (error) {
      console.error("Error deleting step:", error);
    }
  };

  const handleEdit = (stepId: string, currentStepName: string) => {
    console.log("handleEdit called with:", stepId, currentStepName);
    setEditingStepId(stepId);
    setEditingStepName(currentStepName);
  };

  const handleCancelEdit = () => {
    setEditingStepId(null);
    setEditingStepName("");
  };

  const handleUpdateStep = async (stepId: string) => {
    if (!editingStepName.trim()) {
      alert("Step name cannot be empty");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("stepId", stepId);
      formData.append("stepName", editingStepName);
      await updateStepAction(formData);
      // Update the step in place to maintain position
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, step: editingStepName } : step
        )
      );
      setEditingStepId(null);
      setEditingStepName("");
    } catch (error) {
      console.error("Error updating step:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleAssignmentChange = async (
    stepId: string,
    memberId: string | null
  ) => {
    try {
      await updateStepAssignmentAction(stepId, memberId);
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, assigned_member_id: memberId } : step
        )
      );
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert(
        `Failed to update assignment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Table className="hover:bg-none">
          <TableBody>
            <TableRow className="border-none">
              <TableCell>
                <TypographyH2 className="text-center border-none tracking-wide mb-6">
                  Add custom steps
                </TypographyH2>
                <div className="flex flex-col gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setIsEnabled(!isEnabled)}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md"
                    >
                      {isEnabled ? "Cancel" : "Add steps"}
                    </Button>
                  </motion.div>
                  <AnimatePresence>
                    {isEnabled && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4 overflow-hidden"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (stepName) {
                            try {
                              const formData = new FormData();
                              formData.append("stepName", stepName);
                              formData.append("projectId", projectId);
                              await createStepAction(formData);
                              // Fetch all steps again after adding a new one
                              const allSteps = await getStepsAction(projectId);
                              setSteps(parseSteps(allSteps));
                              setStepName("");
                            } catch (error) {
                              console.error("Error creating step:", error);
                              alert(
                                `Error: ${
                                  error instanceof Error
                                    ? error.message
                                    : "Unknown error"
                                }`
                              );
                            }
                          }
                        }}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Label
                            htmlFor="step-name"
                            className="text-sm sm:text-base"
                          >
                            Step:
                          </Label>
                          <Input
                            id="step-name"
                            placeholder="Enter step name"
                            value={stepName}
                            onChange={(e) => setStepName(e.target.value)}
                            disabled={!isEnabled}
                            className="w-full sm:w-1/2 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            className="w-2/3 cursor-pointer transition-all duration-200 hover:shadow-md"
                            disabled={!isEnabled}
                          >
                            <PlusIcon className="w-4 h-4" />
                            Add Step
                          </Button>
                        </motion.div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </TableCell>
              <TableCell className="text-center align-top">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    title="Generate with AI"
                    className="cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    <span className="hidden sm:inline">Generate with AI</span>
                    <span className="sm:hidden">AI</span>
                  </Button>
                </motion.div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </motion.div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {steps.length > 0 &&
            steps.map((step, index) => {
              if (!step || !step.id) {
                console.warn("Invalid step data:", step);
                return null;
              }
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.21, 1.11, 0.81, 0.99],
                  }}
                  layout
                  className="flex flex-col sm:flex-row my-2 items-start sm:items-center pb-4 border-b border-border/50 w-full gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-card/50 hover:bg-card transition-all duration-200 group"
                >
                  {editingStepId === step.id ? (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="flex-1 w-full sm:w-auto"
                    >
                      <Input
                        value={editingStepName}
                        onChange={(e) => setEditingStepName(e.target.value)}
                        className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                        placeholder="Enter step name"
                        autoFocus
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="flex-1 w-full sm:w-auto"
                    >
                      <TypographyP className="py-2 text-base sm:text-lg">
                        <span className="font-semibold text-primary">
                          {index + 1}.
                        </span>{" "}
                        {step.step}
                      </TypographyP>
                    </motion.div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[220px]">
                      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Assigned to
                      </Label>
                      <Select
                        value={step.assigned_member_id ?? "unassigned"}
                        onValueChange={(value) =>
                          handleAssignmentChange(
                            step.id,
                            value === "unassigned" ? null : value
                          )
                        }
                        disabled={teamMembers.length === 0}
                      >
                        <SelectTrigger className="w-full sm:w-44">
                          <SelectValue placeholder="Assign member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Self">Self</SelectItem>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.member_email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {editingStepId === step.id ? (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleUpdateStep(step.id)}
                          >
                            Done
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer transition-all duration-200 hover:bg-destructive/10 hover:border-destructive/30"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer transition-all duration-200 hover:shadow-md"
                            onClick={() => {
                              console.log(
                                "Edit button clicked for step:",
                                step
                              );
                              handleEdit(step.id, step.step);
                            }}
                          >
                            <PencilIcon className="w-4 h-4" /> Edit
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer transition-all duration-200 hover:bg-destructive/10 hover:border-destructive/30 hover:shadow-md"
                            onClick={() => deleteStep(step.id)}
                          >
                            <TrashIcon className="w-4 h-4" /> Delete
                          </Button>
                        </motion.div>
                      </>
                    )}

                    <motion.div
                      className="relative flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px]">
                        <PieChart
                          width={100}
                          height={100}
                          className="w-full h-full"
                        >
                          <Pie
                            data={[
                              {
                                name: "completed",
                                value: stepCompletion[step.id] || 0,
                              },
                              {
                                name: "remaining",
                                value: 100 - (stepCompletion[step.id] || 0),
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={40}
                            innerRadius={24}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            <Cell key="completed" fill="#8884d8" />
                            <Cell key="remaining" fill="#e0e0e0" />
                          </Pie>
                          <Tooltip
                            content={({ active }) => {
                              if (active) {
                                const completion = stepCompletion[step.id] || 0;
                                return (
                                  <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                                    <p className="font-semibold">
                                      {completion}%
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs sm:text-sm font-semibold">
                          {stepCompletion[step.id] || 0}%
                        </span>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Checkbox
                        id={step.id}
                        checked={(stepCompletion[step.id] || 0) === 100}
                        onCheckedChange={(checked) => {
                          setStepCompletion((prev) => ({
                            ...prev,
                            [step.id]: checked === true ? 100 : 0,
                          }));
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
