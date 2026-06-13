import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const district = formData.get('district') as string;
    const taluk = formData.get('taluk') as string;
    const village = formData.get('village') as string;
    const pin = formData.get('pin') as string | null;
    const photo = formData.get('photo') as File | null;

    if (!name || !district || !taluk || !village) {
      return NextResponse.json(
        { error: 'Name, District, Taluk, and Village are required.' },
        { status: 400 }
      );
    }

    // Get the current record to check existence and retrieve current photo_url
    const { data: member, error: fetchErr } = await supabaseAdmin
      .from('members')
      .select('photo_url, mobile')
      .eq('id', session.id)
      .maybeSingle();

    if (fetchErr || !member) {
      return NextResponse.json({ error: 'Member profile not found.' }, { status: 404 });
    }

    let photoUrl = member.photo_url;

    // Handle new photo upload if provided
    if (photo && photo.size > 0) {
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExt = photo.name.split('.').pop() || 'jpg';
      const fileName = `photo_${member.mobile}_${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadErr } = await supabaseAdmin.storage
        .from('member-photos')
        .upload(filePath, buffer, {
          contentType: photo.type,
          upsert: true,
        });

      if (uploadErr) {
        console.error('Update photo upload error:', uploadErr);
        return NextResponse.json({ error: 'Failed to upload photo.' }, { status: 500 });
      }

      // Fetch the public URL of the uploaded image
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('member-photos')
        .getPublicUrl(filePath);

      photoUrl = publicUrlData.publicUrl;
    }

    // Build update object
    const updateData: any = {
      name,
      district,
      taluk,
      village,
      photo_url: photoUrl,
    };

    // If changing PIN
    if (pin && pin.trim().length > 0) {
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        return NextResponse.json(
          { error: 'PIN must be exactly 4 digits.' },
          { status: 400 }
        );
      }
      updateData.pin_hash = hashPin(pin);
    }

    // Update database row
    const { error: updateErr } = await supabaseAdmin
      .from('members')
      .update(updateData)
      .eq('id', session.id);

    if (updateErr) {
      console.error('Update database error:', updateErr);
      return NextResponse.json({ error: 'Failed to update profile in database.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
    });
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
