import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest, // ✅ use NextRequest
  context: { params: Promise<{ memberId: string }> } // ✅ params is Promise
) {
  const { memberId } = await context.params; // ✅ await params

  console.log("API memberId:", memberId);

  const { data, error } = await supabaseAdmin
    .from("members") // ✅ your correct table
    .select("*")
    .eq("member_id", memberId.trim());


  if (error || !data || data.length === 0) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ user: data[0] });
}