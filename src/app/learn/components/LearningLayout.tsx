"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Circle, Clock, ChevronRight, BookOpen, LogOut } from "lucide-react";
import { toast } from "sonner";
import type { LearningModule, LearningProgress, Profile } from "@/data/supabase/database.types";
import ModuleContent from "./ModuleContent";

type Props = {
  modules: LearningModule[];
  progress: LearningProgress[];
  userId: string;
  isIndigenous: boolean;
  profile: Pick<Profile, "first_name" | "last_name">;
};

export default function LearningLayout({ modules, progress, userId, isIndigenous, profile }: Props) {
  const [activeModuleId, setActiveModuleId] = useState<string>(
    modules.find(
      (m) => !progress.find((p) => p.module_id === m.id && p.completed)
    )?.id ?? modules[0]?.id
  );
  const [localProgress, setLocalProgress] = useState<LearningProgress[]>(progress);
  const [completing, setCompleting] = useState(false);
  const router = useRouter();

  const activeModule = modules.find((m) => m.id === activeModuleId);
  const completedCount = localProgress.filter((p) => p.completed).length;
  const totalRequired = modules.filter((m) => m.is_required).length;
  const requiredCompleted = localProgress.filter(
    (p) => p.completed && modules.find((m) => m.id === p.module_id)?.is_required
  ).length;
  const overallPercent = totalRequired > 0 ? Math.round((requiredCompleted / totalRequired) * 100) : 0;
  const allComplete = requiredCompleted >= totalRequired;

  function isCompleted(moduleId: string) {
    return localProgress.some((p) => p.module_id === moduleId && p.completed);
  }

  async function markComplete(moduleId: string) {
    if (isCompleted(moduleId)) return;
    setCompleting(true);

    const supabase = createSupabaseBrowserClient();
    const now = new Date().toISOString();

    const { error } = await supabase.from("learning_progress").upsert({
      user_id: userId,
      module_id: moduleId,
      completed: true,
      completed_at: now,
      time_spent_seconds: 0,
    });

    if (error) {
      toast.error("Failed to save progress. Please try again.");
      setCompleting(false);
      return;
    }

    setLocalProgress((prev) => {
      const existing = prev.find((p) => p.module_id === moduleId);
      if (existing) {
        return prev.map((p) =>
          p.module_id === moduleId ? { ...p, completed: true, completed_at: now } : p
        );
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          user_id: userId,
          module_id: moduleId,
          completed: true,
          completed_at: now,
          time_spent_seconds: 0,
          created_at: now,
        },
      ];
    });

    // Check if all required modules now complete
    const newCompleted = localProgress.filter((p) => p.completed).length + 1;
    if (newCompleted >= totalRequired) {
      await supabase
        .from("profiles")
        .update({ learning_completed: true })
        .eq("id", userId);

      toast.success("Learning journey complete! Taking you to your dashboard.");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      toast.success("Module complete!");
      const nextModule = modules.find(
        (m) =>
          !localProgress.find((p) => p.module_id === m.id && p.completed) &&
          m.id !== moduleId
      );
      if (nextModule) setActiveModuleId(nextModule.id);
    }

    setCompleting(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-4 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Learning Journey</span>
            <Badge variant="secondary" className="text-xs">
              {isIndigenous ? "Indigenous track" : "Non-Indigenous track"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <Progress value={overallPercent} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {requiredCompleted}/{totalRequired} complete
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {`${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
                <p className="text-xs text-muted-foreground">Learning journey</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await createSupabaseBrowserClient().auth.signOut();
                  router.push("/auth/login");
                }}
                className="gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border bg-card shrink-0 hidden sm:flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Modules
            </h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {modules.map((module, i) => {
              const done = isCompleted(module.id);
              const active = module.id === activeModuleId;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModuleId(module.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 flex items-start gap-3 transition-colors ${
                    active
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    ) : (
                      <Circle className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${active ? "text-primary" : ""}`}>
                      {i + 1}. {module.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {module.duration_minutes} min
                      </span>
                      {!module.is_required && (
                        <Badge variant="outline" className="text-xs py-0 h-4 ml-1">Optional</Badge>
                      )}
                    </div>
                  </div>
                  {active && <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeModule ? (
            <ModuleContent
              module={activeModule}
              isCompleted={isCompleted(activeModule.id)}
              onMarkComplete={() => markComplete(activeModule.id)}
              completing={completing}
              allComplete={allComplete}
            />
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              Select a module from the sidebar to begin.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
