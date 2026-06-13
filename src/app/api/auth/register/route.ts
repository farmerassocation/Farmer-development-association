import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPin, setSessionCookie } from '@/lib/auth';
import { generateNextMemberId } from '@/lib/memberId';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const mobile = formData.get('mobile') as string;
    const aadhar_number = formData.get('aadhar_number') as string;
    const district = formData.get('district') as string;
    const taluk = formData.get('taluk') as string;
    const village = formData.get('village') as string;
    const pin = formData.get('pin') as string;
    const otpVerified = formData.get('otpVerified') === 'true';
    const photo = formData.get('photo') as File | null;

    if (!otpVerified) {
      return NextResponse.json(
        { message: 'Mobile number verification required.' },
        { status: 400 }
      );
    }

    // 1. Basic validation
    if (!name || !mobile || !district || !taluk || !village || !pin) {
      return NextResponse.json(
        { error: 'Required fields are missing.' },
        { status: 400 }
      );
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be a 4-digit number.' },
        { status: 400 }
      );
    }

    if (aadhar_number && (aadhar_number.length !== 12 || !/^\d{12}$/.test(aadhar_number))) {
      return NextResponse.json(
        { error: 'Aadhaar number must be a 12-digit number.' },
        { status: 400 }
      );
    }

    // 2. Check duplicates for Mobile
    const { data: existingMobile, error: mobileErr } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('mobile', mobile)
      .maybeSingle();

    if (mobileErr) {
      console.error('Mobile check error:', mobileErr);
      return NextResponse.json({ error: 'Database check failed.' }, { status: 500 });
    }
    if (existingMobile) {
      return NextResponse.json(
        { error: 'Mobile number is already registered.' },
        { status: 400 }
      );
    }

    // 3. Check duplicates for Aadhaar (if provided)
    if (aadhar_number) {
      const { data: existingAadhar, error: aadharErr } = await supabaseAdmin
        .from('members')
        .select('id')
        .eq('aadhar_number', aadhar_number)
        .maybeSingle();

      if (aadharErr) {
        console.error('Aadhaar check error:', aadharErr);
        return NextResponse.json({ error: 'Database check failed.' }, { status: 500 });
      }
      if (existingAadhar) {
        return NextResponse.json(
          { error: 'Aadhaar number is already registered.' },
          { status: 400 }
        );
      }
    }

    // 4. Handle Photo Upload
    let photoUrl = '';
    if (photo && photo.size > 0) {
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const fileExt = photo.name.split('.').pop() || 'jpg';
      const fileName = `photo_${mobile}_${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from('member-photos')
        .upload(filePath, buffer, {
          contentType: photo.type,
          upsert: true,
        });

      if (uploadErr) {
        console.error('Photo upload error:', uploadErr);
        return NextResponse.json(
          { error: 'Failed to upload photo.' },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('member-photos')
        .getPublicUrl(filePath);

      photoUrl = publicUrlData.publicUrl;
    }

    // Hash PIN
    const pinHash = hashPin(pin);

    // 5. Database insertion with retry logic for Member ID generation
    let success = false;
    let memberId = '';
    let retries = 3;
    let newMemberRecord: any = null;

    while (retries > 0 && !success) {
      memberId = await generateNextMemberId();

      const { data, error: insertErr } = await supabaseAdmin
        .from('members')
        .insert({
          member_id: memberId,
          name,
          mobile,
          aadhar_number: aadhar_number || null,
          district,
          taluk,
          village,
          photo_url: photoUrl,
          pin_hash: pinHash,
        })
        .select()
        .single();

      if (insertErr) {
        // If error code is 23505 (Unique violation) on member_id, retry
        // Code 23505 is PostgreSQL unique constraint violation
        if (insertErr.code === '23505' && insertErr.message?.includes('member_id')) {
          console.warn(`Member ID collision for ${memberId}. Retrying...`);
          retries--;
          continue;
        } else {
          console.error('DB Insert error:', insertErr);
          return NextResponse.json(
            { error: insertErr.message || 'Failed to save member details.' },
            { status: 500 }
          );
        }
      }

      newMemberRecord = data;
      success = true;
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to generate a unique Member ID. Please try again.' },
        { status: 500 }
      );
    }

    // 6. Set custom JWT session cookie
    const sessionPayload = {
      id: newMemberRecord.id,
      member_id: newMemberRecord.member_id,
      name: newMemberRecord.name,
      mobile: newMemberRecord.mobile,
      district: newMemberRecord.district,
      taluk: newMemberRecord.taluk,
      village: newMemberRecord.village,
    };
    
    await setSessionCookie(sessionPayload);

    const response = NextResponse.json({
      success: true,
      member_id: memberId,
      message: 'Registration successful!',
    });

    return response;
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
