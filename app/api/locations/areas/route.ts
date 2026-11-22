import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const districtId = request.nextUrl.searchParams.get("districtId");

  if (!districtId) {
    return NextResponse.json(
      { error: "District ID is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("delivery_areas")
    .select("id, name, redx_area_id, post_code")
    .eq("district_id", districtId)
    .order("name");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}