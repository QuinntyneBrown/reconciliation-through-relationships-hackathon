"use client";

import type { RefObject } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { OnboardingFieldError } from "../validation";

export function ErrorSummary({
  errors,
  summaryRef,
}: {
  errors: OnboardingFieldError[];
  summaryRef: RefObject<HTMLDivElement | null>;
}) {
  if (errors.length === 0) return null;

  const heading = `Please fix ${errors.length} ${errors.length === 1 ? "error" : "errors"} to continue`;

  return (
    <Alert
      ref={summaryRef}
      variant="destructive"
      tabIndex={-1}
      aria-labelledby="onboarding-error-summary-title"
      className="focus-visible:outline-ring scroll-mt-4 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <AlertTitle>
        <h3
          id="onboarding-error-summary-title"
          className="font-sans text-base font-bold text-current"
        >
          {heading}
        </h3>
      </AlertTitle>
      <AlertDescription>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {errors.map((item) => (
            <li key={item.fieldId}>
              <a href={`#${item.fieldId}`}>{item.message}</a>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export function FieldErrorMessage({ error }: { error?: OnboardingFieldError }) {
  if (!error) return null;

  return (
    <p id={error.errorId} className="text-destructive mt-1.5 text-sm font-medium">
      {error.message}
    </p>
  );
}
