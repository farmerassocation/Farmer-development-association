import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from "bcryptjs";
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, pin } = body;

    const { data: member } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('mobile', mobile)
      .maybeSingle();

    if (!member) {
      return NextResponse.json(
        { error: 'Invalid mobile or PIN' },
        { status: 401 }
      );
    }

    // ✅ FIX HERE
    const isMatch = await bcrypt.compare(pin, member.pin_hash);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid mobile or PIN' },
        { status: 401 }
      );
    }

    await setSessionCookie({
  id: member.id,
  member_id: member.member_id,
  name: member.name,
  mobile: member.mobile,
  district: member.district,
  taluk: member.taluk,
  village: member.village,
});

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}