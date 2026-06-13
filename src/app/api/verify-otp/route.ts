import { NextResponse } from 'next/server';

type VerifyOtpRequestBody = {
  sessionId: string;
  otp: string;
};

type TwoFactorVerifyResponse = {
  Status: string;
  Details: string;
};

export async function POST(request: Request) {
  try {
    const body: VerifyOtpRequestBody = await request.json();
    const sessionId = body.sessionId?.trim();
    const otp = body.otp?.trim();

    if (!sessionId || !otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'Invalid session or OTP format.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TWOFACTOR_API_KEY || process.env.NEXT_PUBLIC_TWOFACTOR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'OTP provider API key is not configured. Ensure TWOFACTOR_API_KEY is set and restart the server.' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/VERIFY/${encodeURIComponent(sessionId)}/${encodeURIComponent(otp)}`,
      { method: 'GET' }
    );

    const data = (await response.json()) as TwoFactorVerifyResponse;

    if (!response.ok || data.Status !== 'Success') {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
