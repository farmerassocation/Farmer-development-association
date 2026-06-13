import { NextResponse } from 'next/server';

type SendOtpRequestBody = {
  mobile: string;
};

type TwoFactorResponse = {
  Status: string;
  Details: string;
};

export async function POST(request: Request) {
  try {
    const body: SendOtpRequestBody = await request.json();
    const mobile = body.mobile?.trim();

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, message: 'Mobile number must be exactly 10 digits.' },
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
      `https://2factor.in/API/V1/${encodeURIComponent(apiKey)}/SMS/${encodeURIComponent(mobile)}/AUTOGEN`,
      { method: 'GET' }
    );

    const data = (await response.json()) as TwoFactorResponse;

    if (!response.ok || data.Status !== 'Success') {
      return NextResponse.json(
        {
          success: false,
          message: data.Details || 'Failed to send OTP.',
          providerStatus: data.Status,
          providerEndpoint: 'SMS/AUTOGEN',
        },
        { status: response.ok ? 400 : response.status }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: data.Details,
      providerStatus: data.Status,
      providerEndpoint: 'SMS/AUTOGEN',
      providerDetails: data.Details,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
