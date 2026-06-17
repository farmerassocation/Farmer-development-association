import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId, status } = await req.json();

  const { error } = await supabaseAdmin
    .from("members") // ✅ your table
    .update({ status }) // ✅ column
    .eq("id", userId);

  if (error) {
    console.log("UPDATE ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
``