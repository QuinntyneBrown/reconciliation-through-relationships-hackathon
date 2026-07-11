import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/data/supabase/server-client";

export default async function MyProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  redirect(`/profile/${user.id}`);
}
