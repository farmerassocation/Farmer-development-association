'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, Key, AlertCircle, RefreshCw } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Form states
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');

  // UX states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Initial validations
    if (!mobile || !pin) {
      setErrorMsg('மொபைல் எண் மற்றும் PIN இரண்டையும் உள்ளிடவும்.');
      return;
    }
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      setErrorMsg('மொபைல் எண் 10 இலக்க எண்ணாக இருக்க வேண்டும்.');
      return;
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setErrorMsg('PIN 4 இலக்க எண்களாக இருக்க வேண்டும்.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'உள்நுழைவதில் ஏதோ தவறு நிகழ்ந்தது.');
      }

      // Successful login redirect
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-emerald-950/20 border border-emerald-900/60 p-6 sm:p-8 rounded-2xl max-w-md mx-auto shadow-xl backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-white tracking-wide">உறுப்பினர் உள்நுழைவு (Login)</h2>
        <p className="text-xs text-emerald-400 mt-1">விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம்</p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-xs text-rose-350 text-rose-355 text-rose-300 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Mobile Number Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">மொபைல் எண் (Mobile) *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500/70" />
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').substring(0, 10))}
              required
              maxLength={10}
              placeholder="10 இலக்க மொபைல் எண்"
              className="w-full pl-10 pr-4 py-3 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
            />
          </div>
        </div>

        {/* PIN Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">ரகசிய PIN (4-digit PIN) *</label>
          <div className="relative">
            <Key className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500/70" />
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
              required
              maxLength={4}
              placeholder="4 இலக்க PIN"
              className="w-full pl-10 pr-4 py-3 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-emerald-700/60"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/10 active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>சரிபார்க்கப்படுகிறது...</span>
            </>
          ) : (
            <span>உள்நுழை (Login)</span>
          )}
        </button>

      </form>
    </div>
  );
}
