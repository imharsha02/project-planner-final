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
} from "@/app/actions/projectaActions";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AddStepsSection({ projectId }: { projectId: string }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [stepName, setStepName] = useState("");
  const [steps, setSteps] = useState<Array<{ id: string; step: string }>>([]);
  const [stepCompletion, setStepCompletion] = useState<Record<string, number>>(
    {}
  );
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completionInputs, setCompletionInputs] = useState<
    Record<string, string>
  >({});

  // Fetch existing steps when component mounts
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const data = await getStepsAction(projectId);
        setSteps(data || []);
        // Show dialog if there are steps
        if (data && data.length > 0) {
          // Check if we've already asked (using sessionStorage)
          const hasAsked = sessionStorage.getItem(
            `completion-asked-${projectId}`
          );
          if (!hasAsked) {
            setShowCompletionDialog(true);
          }
        }
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

  const handleCompletionSubmit = () => {
    const newCompletion: Record<string, number> = {};
    steps.forEach((step) => {
      const inputValue = completionInputs[step.id] || "0";
      const percentage = Math.min(100, Math.max(0, parseInt(inputValue) || 0));
      newCompletion[step.id] = percentage;
    });
    setStepCompletion(newCompletion);
    setShowCompletionDialog(false);
    sessionStorage.setItem(`completion-asked-${projectId}`, "true");
  };

  return (
    <>
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent onClose={() => setShowCompletionDialog(false)}>
          <DialogHeader>
            <DialogTitle>Step Completion Status</DialogTitle>
            <DialogDescription>
              Please let us know how far each step has been completed (0-100%).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="space-y-2">
                <Label htmlFor={`completion-${step.id}`}>
                  {index + 1}. {step.step}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`completion-${step.id}`}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={completionInputs[step.id] || ""}
                    onChange={(e) => {
                      setCompletionInputs((prev) => ({
                        ...prev,
                        [step.id]: e.target.value,
                      }));
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                // Set all to 0 if skipped
                const defaultCompletion: Record<string, number> = {};
                steps.forEach((step) => {
                  defaultCompletion[step.id] = 0;
                });
                setStepCompletion(defaultCompletion);
                setShowCompletionDialog(false);
                sessionStorage.setItem(`completion-asked-${projectId}`, "true");
              }}
            >
              Skip
            </Button>
            <Button onClick={handleCompletionSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        steps.map((step, index) => (
          <div
            key={step.id}
            className="flex my-2 items-center pb-3 border-b w-md gap-2"
          >
            <TypographyP className="py-2">
              {index + 1}. {step.step}
            </TypographyP>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="cursor-pointer">
                <PencilIcon className="w-4 h-4" /> Edit
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => deleteStep(step.id)}
              >
                <TrashIcon className="w-4 h-4" /> Delete
              </Button>

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
        ))}
    </>
  );
}
