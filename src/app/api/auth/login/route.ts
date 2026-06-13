import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { comparePin, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, pin } = body;

    // Validate inputs
    if (!mobile || !pin) {
      return NextResponse.json(
        { error: 'Mobile number and PIN are required.' },
        { status: 400 }
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be a 4-digit number.' },
        { status: 400 }
      );
    }

    // Query database for member by mobile
    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('mobile', mobile)
      .maybeSingle();

    if (error) {
      console.error('Login database error:', error);
      return NextResponse.json({ error: 'Database operation failed.' }, { status: 500 });
    }

    if (!member) {
      return NextResponse.json(
        { error: 'Invalid mobile number or PIN.' },
        { status: 401 }
      );
    }

    // Securely compare the 4-digit PIN
    const isMatch = comparePin(pin, member.pin_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid mobile number or PIN.' },
        { status: 401 }
      );
    }

    // Create session cookie
    const sessionPayload = {
      id: member.id,
      member_id: member.member_id,
      name: member.name,
      mobile: member.mobile,
      district: member.district,
      taluk: member.taluk,
      village: member.village,
    };

    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
    });
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
