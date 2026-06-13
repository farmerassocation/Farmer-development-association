import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import DashboardClient from '@/components/DashboardClient';

export const revalidate = 0; // Disable server caching for real-time updates

export default async function DashboardPage() {
  const session = await getSession();

  // Redirect if not authenticated (though middleware also protects this, server checks are definitive)
  if (!session) {
    redirect('/login');
  }

  // Fetch up-to-date member details directly from PostgreSQL
  const { data: member, error } = await supabaseAdmin
    .from('members')
    .select('id, member_id, name, mobile, aadhar_number, district, taluk, village, photo_url, created_at')
    .eq('id', session.id)
    .maybeSingle();

  if (error || !member) {
    console.error('Stale dashboard session or missing DB record:', error);
    // Redirect to login if user cannot be fetched
    redirect('/login');
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <DashboardClient initialMember={member} />
    </div>
  );
}
