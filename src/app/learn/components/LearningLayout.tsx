"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/data/supabase/browser-client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { LearningModule, LearningProgress } from "@/data/supabase/database.types";
import ModuleContent from "./ModuleContent";
import { AppHeader } from "@/components/app-header";
import { EmptyState } from "@/components/empty-state";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/learn", label: "Learning" },
  { href: "/connections", label: "Connections" },
  { href: "/map", label: "Regional map" },
];

type Props = {
  modules: LearningModule[];
  progress: LearningProgress[];
  userId: string;
  isIndigenous: boolean;
};

export default function LearningLayout({ modules, progress, userId, isIndigenous }: Props) {
  const [activeModuleId, setActiveModuleId] = useState<string>(
    modules.find((m) => !progress.find((p) => p.module_id === m.id && p.completed))?.id ??
      modules[0]?.id,
  );
  const [localProgress, setLocalProgress] = useState<LearningProgress[]>(progress);
  const [completing, setCompleting] = useState(false);
  const router = useRouter();

  const activeModule = modules.find((m) => m.id === activeModuleId);
  const totalRequired = modules.filter((m) => m.is_required).length;
  const requiredCompleted = localProgress.filter(
    (p) => p.completed && modules.find((m) => m.id === p.module_id)?.is_required,
  ).length;
  const overallPercent =
    totalRequired > 0 ? Math.round((requiredCompleted / totalRequired) * 100) : 0;
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
          p.module_id === moduleId ? { ...p, completed: true, completed_at: now } : p,
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
      await supabase.from("profiles").update({ learning_completed: true }).eq("id", userId);

      toast.success("Learning journey complete! Taking you to your dashboard.");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      toast.success("Module complete!");
      const nextModule = modules.find(
        (m) => !localProgress.find((p) => p.module_id === m.id && p.completed) && m.id !== moduleId,
      );
      if (nextModule) setActiveModuleId(nextModule.id);
    }

    setCompleting(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        homeHref="/dashboard"
        subtitle="Learning journey"
        navItems={NAV_ITEMS}
        roleLabel={isIndigenous ? "Indigenous track" : "Non-Indigenous track"}
        actions={
          <div className="hidden w-56 items-center gap-3 xl:flex">
            <Progress value={overallPercent} className="flex-1" />
            <span className="text-on-dark-soft text-xs whitespace-nowrap">
              {requiredCompleted}/{totalRequired}
            </span>
          </div>
        }
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Sidebar */}
        <aside className="border-border bg-card hidden w-72 shrink-0 flex-col border-r sm:flex">
          <div className="border-border border-b p-4">
            <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
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
                  className={`mb-1 flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                    active ? "bg-primary/10 border-primary/20 border" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {done ? (
                      <CheckCircle2 className="text-accent h-4 w-4" />
                    ) : (
                      <Circle
                        className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${active ? "text-primary" : ""}`}>
                      {i + 1}. {module.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <Clock className="text-muted-foreground h-3 w-3" />
                      <span className="text-muted-foreground text-xs">
                        {module.duration_minutes} min
                      </span>
                      {!module.is_required && (
                        <Badge variant="outline" className="ml-1 h-4 py-0 text-xs">
                          Optional
                        </Badge>
                      )}
                    </div>
                  </div>
                  {active && <ChevronRight className="text-primary mt-0.5 h-4 w-4 shrink-0" />}
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
            <EmptyState
              title="Choose a learning module"
              description="Select a module from the learning journey to begin."
            />
          )}
        </main>
      </div>
    </div>
  );
}
