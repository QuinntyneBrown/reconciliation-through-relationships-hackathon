import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LearningLayout from "./components/LearningLayout";

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_indigenous, learning_completed")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");
  if (profile.learning_completed) redirect("/dashboard");

  const audience = profile.is_indigenous ? "indigenous" : "non_indigenous";

  const { data: modules } = await supabase
    .from("learning_modules")
    .select("*")
    .or(`audience.eq.${audience},audience.eq.all`)
    .order("order_index");

  const { data: progress } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", user.id);

  return (
    <LearningLayout
      modules={modules ?? []}
      progress={progress ?? []}
      userId={user.id}
      isIndigenous={profile.is_indigenous ?? false}
    />
  );
}
