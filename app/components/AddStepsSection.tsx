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
} from "@/app/actions/projectaActions";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddStepsSection({ projectId }: { projectId: string }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [stepName, setStepName] = useState("");
  const [steps, setSteps] = useState<Array<{ id: string; step: string }>>([]);
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
        setSteps(data || []);
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
      setSteps(allSteps || []);
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

  return (
    <>
      <Table className="hover:bg-none">
        <TableBody>
          <TableRow className="border-none">
            <TableCell>
              <TypographyH2 className="text-center border-none tracking-wide mb-4">
                Add custom steps
              </TypographyH2>
              <div className="flex flex-col gap-4">
                <div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEnabled(!isEnabled)}
                    className="cursor-pointer"
                  >
                    {isEnabled ? "Cancel" : "Add steps"}
                  </Button>
                </div>
                <form
                  className="flex flex-col gap-4"
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
                        setSteps(allSteps || []);
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="step-name">Step:</Label>
                    <Input
                      id="step-name"
                      placeholder="Enter step name"
                      value={stepName}
                      onChange={(e) => setStepName(e.target.value)}
                      disabled={!isEnabled}
                      className="w-1/2"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-2/3 cursor-pointer"
                    disabled={!isEnabled}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Step
                  </Button>
                </form>
              </div>
            </TableCell>
            <TableCell className="text-center align-top">
              <Button
                variant="outline"
                title="Generate with AI"
                className="cursor-pointer"
              >
                Generate with AI
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {steps.length > 0 &&
        steps.map((step, index) => {
          if (!step || !step.id) {
            console.warn("Invalid step data:", step);
            return null;
          }
          return (
            <div
              key={step.id}
              className="flex my-2 items-center pb-3 border-b w-md gap-2"
            >
              {editingStepId === step.id ? (
                <Input
                  value={editingStepName}
                  onChange={(e) => setEditingStepName(e.target.value)}
                  className="flex-1"
                  placeholder="Enter step name"
                  autoFocus
                />
              ) : (
                <TypographyP className="py-2">
                  {index + 1}. {step.step}
                </TypographyP>
              )}
              <div className="flex items-center gap-2">
                {editingStepId === step.id ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleUpdateStep(step.id)}
                    >
                      Done
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        console.log("Edit button clicked for step:", step);
                        handleEdit(step.id, step.step);
                      }}
                    >
                      <PencilIcon className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => deleteStep(step.id)}
                    >
                      <TrashIcon className="w-4 h-4" /> Delete
                    </Button>
                  </>
                )}

                <div className="relative">
                  <PieChart width={100} height={100}>
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
                      outerRadius={50}
                      innerRadius={30}
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
                          return <p>{completion}%</p>;
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-sm font-semibold">
                      {stepCompletion[step.id] || 0}%
                    </span>
                  </div>
                </div>
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
              </div>
            </div>
          );
        })}
    </>
  );
}
