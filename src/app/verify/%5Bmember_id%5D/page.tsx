import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { CheckCircle, ShieldAlert, ArrowLeft, ShieldCheck, Leaf } from 'lucide-react';

interface VerifyPageProps {
  params: Promise<{
    member_id: string;
  }>;
}

export const revalidate = 0; // Fresh verification data always

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { member_id } = await params;
  const decodedMemberId = decodeURIComponent(member_id);

  // Fetch only public information from PostgreSQL database
  const { data: member, error } = await supabaseAdmin
    .from('members')
    .select('member_id, name, district, taluk, village, photo_url, created_at')
    .eq('member_id', decodedMemberId)
    .maybeSingle();

  const isVerified = !error && member !== null;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 md:py-24 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(16,185,129,0.08),rgba(255,255,255,0))]"></div>
      
      <div className="max-w-md w-full px-4 relative z-10">
        
        {isVerified ? (
          /* ================= SUCCESS VERIFIED CARD ================= */
          <div className="bg-emerald-950/20 border-2 border-emerald-500/60 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6 text-center animate-scaleIn">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
              <ShieldCheck className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
              <span>Verified Membership</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">உறுப்பினர் சான்றிதழ்</h1>
              <p className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase">Farmers Welfare Association</p>
            </div>

            {/* Photo slot */}
            <div className="relative w-28 h-32 mx-auto rounded-xl bg-emerald-900 border-2 border-emerald-500 overflow-hidden shadow-lg">
              {member.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={member.photo_url} 
                  alt="Verified Member" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-emerald-300 font-bold bg-emerald-900">
                  No Photo
                </div>
              )}
            </div>

            {/* Details Table */}
            <div className="bg-emerald-950/60 border border-emerald-900/60 rounded-xl p-4 divide-y divide-emerald-900/40 text-left text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-300 font-medium">உறுப்பினர் எண் / Member ID</span>
                <span className="font-mono font-bold text-amber-400 tracking-wider">{member.member_id}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-300 font-medium">பெயர் / Name</span>
                <span className="font-bold text-white">{member.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-300 font-medium">மாவட்டம் / District</span>
                <span className="font-semibold text-slate-200">{member.district}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-300 font-medium">கிராமம் / Village</span>
                <span className="font-semibold text-slate-200">{member.village}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-emerald-300 font-medium">நிலை / Status</span>
                <span className="inline-flex items-center space-x-1 font-bold text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>ACTIVE</span>
                </span>
              </div>
            </div>

            {/* Short Tamil signature slogan */}
            <div className="flex justify-center items-center space-x-2 text-[10px] text-emerald-400 font-semibold italic">
              <Leaf className="h-4 w-4 text-amber-500 shrink-0" />
              <span>விவசாய பாதுகாப்பு சங்கம் - உழவே உலகம்</span>
            </div>

          </div>
        ) : (
          /* ================= FAILED CARD ================= */
          <div className="bg-rose-950/20 border-2 border-rose-500/50 p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6 text-center animate-scaleIn">
            
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-10 w-10 text-rose-500 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">உறுப்பினர் விவரம் கண்டறியப்படவில்லை</h1>
              <p className="text-xs text-rose-350 text-rose-355 text-rose-300 uppercase tracking-widest font-mono">Verification Failed</p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              உள்ளிடப்பட்ட உறுப்பினர் எண் <span className="font-mono font-bold text-amber-400 text-sm">{decodedMemberId}</span> எங்களது தரவுதளத்தில் இல்லை. தயவுசெய்து சரியான எண்ணைச் சரிபார்க்கவும்.
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 px-4 py-2 border border-slate-700 hover:border-slate-600 bg-slate-900 text-xs font-bold rounded-lg text-slate-350 text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>முகப்பிற்குச் செல்ல (Go Home)</span>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
