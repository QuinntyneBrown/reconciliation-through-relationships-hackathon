import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "facilitator") redirect("/dashboard");

  const { data: settings } = await supabase.from("system_settings").select("*");
  const settingsMap = Object.fromEntries(
    (settings ?? []).map((s) => [s.key, s.value])
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNav facilitator={profile} />
      <SettingsClient settings={settingsMap} facilitatorId={user.id} />
    </div>
  );
}
