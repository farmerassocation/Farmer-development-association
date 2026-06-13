import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest)  {
  const { userId, newPin } = await req.json();

  const hashed = await bcrypt.hash(newPin, 10);

  const { error } = await supabaseAdmin
    .from("members")
    .update({ pin_hash: hashed })
    .eq("id", userId);

  if (error) {
    return Response.json({ error: "Error" }, { status: 500 });
  }

  return Response.json({ success: true });
}