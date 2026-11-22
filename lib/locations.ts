import { createClient } from "@/lib/supabase/server";

export async function getDivisions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("divisions")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("SUPABASE ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message);
  }

  return data;
}