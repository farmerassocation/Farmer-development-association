import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Retrieve fresh details from the database
    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('id, member_id, name, mobile, aadhar_number, district, taluk, village, photo_url, created_at')
      .eq('id', session.id)
      .maybeSingle();

    if (error) {
      console.error('Fetch profile database error:', error);
      return NextResponse.json({ error: 'Database check failed.' }, { status: 500 });
    }

    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (err: any) {
    console.error('Session retrieval error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
