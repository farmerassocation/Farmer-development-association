import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('members')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error('Member count query error:', error);
      return NextResponse.json({ error: 'Unable to fetch member count.' }, { status: 500 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (err: any) {
    console.error('Member count route error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
