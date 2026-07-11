"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

type Props = {
  city: string;
  count: number;
};

export default function CohortBanner({ city, count }: Props) {
  return (
    <Alert className="border-accent/30 bg-accent/10">
      <Users className="h-4 w-4 text-accent" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span>
          <strong>A reconciliation cohort is forming in {city}!</strong>{" "}
          There are {count} eligible participants in your area. As an elected leader, you can
          help bring this group together.
        </span>
        <Button size="sm" variant="outline" className="shrink-0 border-accent/40 text-accent-foreground hover:bg-accent/20">
          Create cohort
        </Button>
      </AlertDescription>
    </Alert>
  );
}
