import { createClient } from "@/lib/supabase/server";

export async function getDivisions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("divisions")
    .select("id, name")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}