"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TypographyH2 } from "@/app/components/Typography/TypographyH2";
import { PlusIcon } from "lucide-react";
import { TypographyP } from "./Typography/TypographyP";
import { createStepAction } from "@/app/actions/projectaActions";

export default function AddStepsSection({ projectId }: { projectId: string }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [stepName, setStepName] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
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
                        const newSteps = [...steps, stepName];
                        setSteps(newSteps);
                        console.log("Submit:", newSteps);
                        const formData = new FormData();
                        formData.append("stepName", stepName);
                        formData.append("projectId", projectId);
                        await createStepAction(formData);
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
          <TypographyP key={index}>
            {index + 1}. {step}
          </TypographyP>
        ))}
    </>
  );
}
