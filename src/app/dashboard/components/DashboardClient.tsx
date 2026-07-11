"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, MessageCircle } from "lucide-react";
import { AppFooter } from "@/components/app-footer";
import { PageIntro } from "@/components/page-intro";
import type { Profile, Connection } from "@/data/supabase/database.types";
import type { MatchResult } from "@/domain/profile-matching";
import DashboardNav from "./DashboardNav";
import RecommendedTab from "./RecommendedTab";
import AllParticipantsTab from "./AllParticipantsTab";
import ConnectionsTab from "./ConnectionsTab";
import CohortBanner from "./CohortBanner";

type Props = {
  currentUser: Profile;
  participants: Profile[];
  recommendedMatches: MatchResult[];
  connections: Connection[];
  connectionPartners: Profile[];
  cohort: Record<string, unknown> | null;
  sameCityCount: number;
};

export default function DashboardClient({
  currentUser,
  participants,
  recommendedMatches,
  connections,
  connectionPartners,
  cohort,
  sameCityCount,
}: Props) {
  const [activeTab, setActiveTab] = useState("recommended");

  const isOnWaitlist = !currentUser.is_indigenous && recommendedMatches.length === 0;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <DashboardNav user={currentUser} />

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        <PageIntro
          eyebrow="Your relationship journey"
          title={`Welcome, ${currentUser.first_name ?? "friend"}`}
          description="Discover thoughtful recommendations, connect at your own pace, and see reconciliation circles forming near you."
        />

        {/* Cohort banner for elected leaders */}
        {currentUser.participation_categories.includes("elected_leader") &&
          sameCityCount >= 5 &&
          !cohort && <CohortBanner city={currentUser.city ?? ""} count={sameCityCount} />}

        {/* Waitlist state */}
        {isOnWaitlist && (
          <Alert variant="info">
            <AlertDescription>
              <strong>You&apos;re on the waitlist.</strong> We&apos;ll notify you as soon as an
              Indigenous participant is matched with you. In the meantime, explore the participant
              community below.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="recommended" className="gap-2">
              Recommended
              {recommendedMatches.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                  {recommendedMatches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" />
              All participants
            </TabsTrigger>
            <TabsTrigger value="connections" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Connections
              {connections.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                  {connections.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="mt-6">
            <RecommendedTab
              matches={recommendedMatches}
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

          <TabsContent value="connections" className="mt-6">
            <ConnectionsTab
              connections={connections}
              partners={connectionPartners}
              currentUserId={currentUser.id}
            />
          </TabsContent>
        </Tabs>
      </main>
      <AppFooter />
    </div>
  );
}
