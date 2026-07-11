"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users } from "lucide-react";
import type { Profile, Match, Connection } from "@/types/database";
import type { MatchResult } from "@/lib/matching";
import DashboardNav from "./DashboardNav";
import RecommendedTab from "./RecommendedTab";
import AllParticipantsTab from "./AllParticipantsTab";
import CohortBanner from "./CohortBanner";

type Props = {
  currentUser: Profile;
  participants: Profile[];
  recommendedMatches: MatchResult[];
  approvedMatches: Match[];
  connections: Connection[];
  cohort: Record<string, unknown> | null;
  sameCityCount: number;
};

export default function DashboardClient({
  currentUser,
  participants,
  recommendedMatches,
  approvedMatches,
  connections,
  cohort,
  sameCityCount,
}: Props) {
  const [activeTab, setActiveTab] = useState("recommended");

  const isOnWaitlist =
    !currentUser.is_indigenous && recommendedMatches.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={currentUser} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* Cohort banner for elected leaders */}
        {currentUser.participation_categories.includes("elected_leader") &&
          sameCityCount >= 5 &&
          !cohort && (
            <CohortBanner city={currentUser.city ?? ""} count={sameCityCount} />
          )}

        {/* Waitlist state */}
        {isOnWaitlist && (
          <Alert className="border-primary/20 bg-primary/5">
            <AlertDescription>
              <strong>You&apos;re on the waitlist.</strong> We&apos;ll notify you as soon as an
              Indigenous participant is matched with you. In the meantime, explore the participant
              community below.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="recommended" className="gap-2">
              Recommended
              {recommendedMatches.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                  {recommendedMatches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" />
              All participants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="mt-6">
            <RecommendedTab
              matches={recommendedMatches}
              approvedMatches={approvedMatches}
              connections={connections}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <AllParticipantsTab
              participants={participants}
              currentUser={currentUser}
              connections={connections}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
