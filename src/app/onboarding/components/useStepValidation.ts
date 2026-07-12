"use client";

import { useRef, useState, type FormEvent } from "react";
import type { OnboardingFieldError } from "../validation";

type Options<T> = {
  data: T;
  validate: (data: T) => OnboardingFieldError[];
  onValidSubmit: () => void;
};

export function useStepValidation<T>({ data, validate, onValidSubmit }: Options<T>) {
  const [attempted, setAttempted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const errors = attempted ? validate(data) : [];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentErrors = validate(data);

    if (currentErrors.length === 0) {
      onValidSubmit();
      return;
    }

    setAttempted(true);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  return { errors, onSubmit, summaryRef };
}
