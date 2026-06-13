'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, ShieldCheck, MapPin, Key, Image, Upload, AlertCircle, RefreshCw } from 'lucide-react';

export default function RegistrationForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpStatusMessage, setOtpStatusMessage] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // UX states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ member_id: string } | null>(null);

  const handleSendOtp = async () => {
    setOtpError(null);
    setOtpStatusMessage(null);

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setOtpError('மொபைல் எண் 10 இலக்க எண்ணாக இருக்க வேண்டும்.');
      return;
    }

    setOtpSending(true);
    setOtpVerified(false);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'OTP அனுப்புவதில் ஏதாவது சரியாகவில்லை.');
      }

      setSessionId(data.sessionId);
      setOtpStatusMessage('OTP வெற்றிகரமாக அனுப்பப்பட்டது. தயவுசெய்து OTP-ஐ உள்ளிடவும்.');
      setOtpError(null);
    } catch (err: any) {
      setOtpError(err.message || 'OTP அனுப்ப முடியவில்லை.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError(null);
    setOtpStatusMessage(null);

    if (!sessionId) {
      setOtpError('முந்தைய கட்டத்தில் OTP அனுப்பவும்.');
      return;
    }

    if (!otpCode || !/^\d{6}$/.test(otpCode)) {
      setOtpError('தயவுசெய்து 6 இலக்க OTP-ஐ உள்ளிடவும்.');
      return;
    }

    setOtpVerifying(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, otp: otpCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'OTP சரிபார்ப்பு வெற்றியடையவில்லை.');
      }

      setOtpVerified(true);
      setOtpStatusMessage('மொபைல் எண் வெற்றிகரமாக சரிபார்க்கப்பட்டது.');
      setOtpError(null);
    } catch (err: any) {
      setOtpError(err.message || 'OTP சரிபார்க்க முடியவில்லை.');
      setOtpVerified(false);
    } finally {
      setOtpVerifying(false);
    }
  };

  // Photo change handler
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('தயவுசெய்து ஒரு படத்தை (Image) மட்டும் தேர்வு செய்யவும்.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('படம் 2MB-க்குள் இருக்க வேண்டும்.');
        return;
      }
      setPhoto(file);
      setErrorMsg(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation checks
    if (!name || !mobile || !district || !taluk || !village || !pin || !confirmPin) {
      setErrorMsg('தயவுசெய்து அனைத்து கட்டாய புலங்களையும் நிரப்பவும்.');
      return;
    }
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      setErrorMsg('மொபைல் எண் 10 இலக்க எண்ணாக இருக்க வேண்டும்.');
      return;
    }
    if (!otpVerified) {
      setErrorMsg('Please verify your mobile number before registration.');
      return;
    }
    if (aadhar && (aadhar.length !== 12 || !/^\d{12}$/.test(aadhar))) {
      setErrorMsg('ஆதார் எண் 12 இலக்க எண்ணாக இருக்க வேண்டும்.');
      return;
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setErrorMsg('PIN 4 இலக்க எண்களாக இருக்க வேண்டும்.');
      return;
    }
    if (pin !== confirmPin) {
      setErrorMsg('உள்ளிடப்பட்ட இரண்டு PIN-களும் பொருந்தவில்லை.');
      return;
    }
    if (!photo) {
      setErrorMsg('உறுப்பினர் அட்டைக்கு ஒரு புகைப்படத்தை பதிவேற்றுவது கட்டாயமாகும்.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('mobile', mobile);
      formData.append('aadhar_number', aadhar);
      formData.append('district', district.trim());
      formData.append('taluk', taluk.trim());
      formData.append('village', village.trim());
      formData.append('photo', photo);
      formData.append('pin', pin);
      formData.append('otpVerified', otpVerified ? 'true' : 'false');

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'பதிவு செய்வதில் பிழை ஏற்பட்டது.');
      }

      setSuccessData(data);
      // Auto redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-800 p-8 rounded-2xl text-center max-w-md mx-auto space-y-6 shadow-2xl animate-scaleIn">
        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="h-10 w-10 text-emerald-950 stroke-[2.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">பதிவு வெற்றிகரமாக முடிந்தது!</h2>
          <p className="text-xs text-emerald-300">Farmers Protection and Development Welfare Association</p>
        </div>
        <div className="bg-emerald-900/50 border border-emerald-800/80 p-4 rounded-xl font-mono">
          <span className="text-[10px] text-emerald-400 block uppercase tracking-wider font-semibold">Your Member ID</span>
          <span className="text-2xl font-extrabold text-amber-300 tracking-wider">{successData.member_id}</span>
        </div>
        <p className="text-xs text-slate-400">
          உங்களின் உறுப்பினர் அட்டை வெற்றிகரமாக உருவாக்கப்பட்டுள்ளது. இன்னும் ஒரு சில நொடிகளில் டேஷ்போர்டிற்கு அழைத்துச் செல்லப்படுவீர்கள்...
        </p>
        <div className="flex justify-center">
          <RefreshCw className="h-6 w-6 text-amber-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-950/20 border border-emerald-900/60 p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto shadow-xl backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-wide">விவசாயி புதிய பதிவு படிவம்</h2>
        <p className="text-xs text-emerald-400 mt-1">விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம், தமிழ்நாடு</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-xs text-rose-300 animate-fadeIn">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">முழு பெயர் (Full Name) *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="எ.கா: ராமசாமி பி"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">மொபைல் எண் (Mobile) *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  if (otpVerified) return;
                  setMobile(e.target.value.replace(/\D/g, '').substring(0, 10));
                }}
                required
                maxLength={10}
                placeholder="10 இலக்க மொபைல் எண்"
                disabled={otpSending || otpVerifying || otpVerified}
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Row 2: OTP Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_auto] gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">OTP குறியீடு (OTP Code)</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                maxLength={6}
                placeholder="6 இலக்க OTP குறியீடு"
                disabled={!sessionId || otpVerified}
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {otpStatusMessage && <p className="text-xs text-emerald-300">{otpStatusMessage}</p>}
            {otpError && <p className="text-xs text-rose-300">{otpError}</p>}
            {!otpVerified && (
              <p className="text-xs text-amber-300">Please verify your mobile number before registration.</p>
            )}
          </div>

          <div className="flex flex-col justify-end gap-3">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSending || otpVerifying || otpVerified || mobile.length !== 10}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-semibold rounded-xl shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {otpSending ? 'OTP அனுப்பப்படுகிறது...' : sessionId ? 'OTP மீண்டும் அனுப்பு' : 'OTP அனுப்பு'}
            </button>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!sessionId || otpVerifying || otpVerified}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-semibold rounded-xl shadow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {otpVerifying ? 'OTP சரிபார்க்கப்படுகிறது...' : otpVerified ? 'OTP சரிபார்க்கப்பட்டது' : 'OTP சரிபார்க்கவும்'}
            </button>
          </div>
        </div>

        {/* Row 3: Aadhaar Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">ஆதார் எண் (Aadhaar Number) <span className="text-[10px] text-emerald-500/70 lowercase font-normal">(optional)</span></label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
            <input
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').substring(0, 12))}
              maxLength={12}
              placeholder="12 இலக்க ஆதார் எண்"
              className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
            />
          </div>
        </div>

        {/* Row 3: Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">மாவட்டம் (District) *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                placeholder="மாவட்டம்"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">வட்டம் (Taluk) *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                required
                placeholder="வட்டம்"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">கிராமம் (Village) *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
                placeholder="கிராமம்"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Photo Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">புகைப்படம் பதிவேற்றவும் (Farmer Photo) *</label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-emerald-800 rounded-xl bg-emerald-950/30">
            <div className="w-20 h-24 rounded-lg border border-emerald-800 bg-emerald-900/50 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Image className="h-8 w-8 text-emerald-700" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="text-[11px] text-slate-400">உறுப்பினர் அட்டையில் காட்டுவதற்காக உங்கள் பாஸ்போர்ட் அளவிலான புகைப்படத்தை பதிவேற்றவும். (JPG/PNG, Max 2MB)</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-emerald-300 text-xs font-semibold rounded-lg transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>புகைப்படம் தேர்வு செய்</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Row 5: PIN setup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">உள்நுழைவு PIN (4-digit PIN) *</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                required
                maxLength={4}
                placeholder="4 இலக்க ரகசிய PIN"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">PIN உறுதி செய்க (Confirm PIN) *</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                required
                maxLength={4}
                placeholder="மீண்டும் உள்ளிடவும்"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !otpVerified}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl shadow-lg hover:shadow-amber-500/10 active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>உறுப்பினர் அட்டை உருவாக்கப்படுகிறது...</span>
            </>
          ) : (
            <span>பதிவு செய்க மற்றும் அட்டை பெறுக (Register & Get ID)</span>
          )}
        </button>

      </form>
    </div>
  );
}
