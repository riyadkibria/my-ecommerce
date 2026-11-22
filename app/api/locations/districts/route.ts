import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const divisionId = request.nextUrl.searchParams.get("divisionId");

  if (!divisionId) {
    return NextResponse.json(
      { error: "Division ID is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("districts")
    .select("id, name")
    .eq("division_id", divisionId)
    .order("name");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}