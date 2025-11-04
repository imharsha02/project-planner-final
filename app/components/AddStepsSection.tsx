"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TypographyH2 } from "@/app/components/Typography/TypographyH2";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { TypographyP } from "./Typography/TypographyP";
import {
  createStepAction,
  getStepsAction,
} from "@/app/actions/projectaActions";

export default function AddStepsSection({ projectId }: { projectId: string }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [stepName, setStepName] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  // Fetch existing steps when component mounts
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const data = await getStepsAction(projectId);
        setSteps(data?.map((step: any) => step.step) || []);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };
    fetchSteps();
  }, [projectId]);
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
                        setSteps(allSteps?.map((step: any) => step.step) || []);
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
          <div key={index} className="flex my-2 items-center pb-3 border-b w-md gap-2">
            <TypographyP className="py-2">
              {index + 1}. {step}
            </TypographyP>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="cursor-pointer">
                <PencilIcon className="w-4 h-4" /> Edit
              </Button>
              <Button variant="outline" className="cursor-pointer">
                <TrashIcon className="w-4 h-4" /> Delete
              </Button>
            </div>
          </div>
        ))}
    </>
  );
}
