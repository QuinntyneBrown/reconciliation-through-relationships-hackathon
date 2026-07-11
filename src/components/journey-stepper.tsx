import { cn } from "@/lib/utils";

export function JourneyStepper({
  steps,
  currentStep,
  className,
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  return (
    <ol
      className={cn("rtr-stepper", className)}
      aria-label={`Step ${currentStep + 1} of ${steps.length}`}
    >
      {steps.map((step, index) => (
        <li
          key={step}
          className="rtr-stepper-step"
          data-state={index < currentStep ? "done" : index === currentStep ? "current" : "upcoming"}
          aria-current={index === currentStep ? "step" : undefined}
        >
          {step}
        </li>
      ))}
    </ol>
  );
}
