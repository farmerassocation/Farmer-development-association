import { supabaseAdmin } from './supabase';

/**
 * Generates the next sequential Member ID for the current year.
 * Format: FWA + Year (2 digits) + 6-digit sequence (e.g., FWA26000001)
 */
export async function generateNextMemberId(): Promise<string> {
  const yearSuffix = new Date().getFullYear().toString().slice(-2); // e.g., "26"
  const prefix = `FWA${yearSuffix}`;

  try {
    // Fetch the maximum member_id that matches the pattern 'FWA[Year]%'
    const { data, error } = await supabaseAdmin
      .from('members')
      .select('member_id')
      .like('member_id', `${prefix}%`)
      .order('member_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest member ID:', error);
      throw new Error('Database error while generating member ID');
    }

    let nextSequenceNum = 1;

    if (data && data.length > 0) {
      const latestId = data[0].member_id;
      // Extract the numeric sequence (everything after the 6-character prefix VPVSYY)
      const seqString = latestId.substring(6);
      const parsedSeq = parseInt(seqString, 10);
      if (!isNaN(parsedSeq)) {
        nextSequenceNum = parsedSeq + 1;
      }
    }

    const paddedSequence = nextSequenceNum.toString().padStart(6, '0');
    return `${prefix}${paddedSequence}`;
  } catch (err) {
    console.error('Failed to generate next Member ID:', err);
    throw err;
  }
}
