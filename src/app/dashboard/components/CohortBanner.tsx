"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CohortCircle } from "@/components/cohort-circle";

type Props = {
  city: string;
  count: number;
};

export default function CohortBanner({ city, count }: Props) {
  return (
    <Alert variant="caution" className="grid-cols-[auto_1fr] items-center gap-x-5">
      <CohortCircle count={count} size="sm" />
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          <strong>A reconciliation cohort is forming in {city}!</strong> There are {count} eligible
          participants in your area. As an elected leader, you can help bring this group together.
        </span>
        <Button size="sm" variant="secondary" className="shrink-0">
          Create cohort
        </Button>
      </AlertDescription>
    </Alert>
  );
}
