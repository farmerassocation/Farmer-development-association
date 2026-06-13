'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import FarmerIdCard from './FarmerIdCard';
import { User, MapPin, Key, Image, Upload, AlertCircle, CheckCircle2, RefreshCw, LogOut, Award, Settings } from 'lucide-react';

interface MemberData {
  id: number;
  member_id: string;
  name: string;
  mobile: string;
  aadhar_number?: string;
  district: string;
  taluk: string;
  village: string;
  photo_url?: string;
  created_at: string;
}

interface DashboardClientProps {
  initialMember: MemberData;
}

export default function DashboardClient({ initialMember }: DashboardClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [member, setMember] = useState<MemberData>(initialMember);
  
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'card' | 'profile'>('card');

  // Form states for update
  const [name, setName] = useState(member.name);
  const [district, setDistrict] = useState(member.district);
  const [taluk, setTaluk] = useState(member.taluk);
  const [village, setVillage] = useState(member.village);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(member.photo_url || null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // UI feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('தயவுசெய்து ஒரு படத்தை மட்டும் தேர்வு செய்யவும்.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('படம் 2MB-க்குள் இருக்க வேண்டும்.');
        return;
      }
      setPhoto(file);
      setErrorMsg(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !district || !taluk || !village) {
      setErrorMsg('கட்டாய புலங்கள் எதையும் காலியாக விட வேண்டாம்.');
      return;
    }

    if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
      setErrorMsg('PIN 4 இலக்க எண்களாக மட்டுமே இருக்க வேண்டும்.');
      return;
    }

    if (pin && pin !== confirmPin) {
      setErrorMsg('உள்ளிடப்பட்ட புதிய PIN மற்றும் உறுதிப்படுத்தல் PIN பொருந்தவில்லை.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('district', district.trim());
      formData.append('taluk', taluk.trim());
      formData.append('village', village.trim());
      if (photo) {
        formData.append('photo', photo);
      }
      if (pin) {
        formData.append('pin', pin);
      }

      const res = await fetch('/api/member/update', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'சுயவிவரம் புதுப்பிப்பதில் தோல்வி.');
      }

      setSuccessMsg('உங்களின் சுயவிவர விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!');
      setPin('');
      setConfirmPin('');

      // Fetch fresh member data to update ID Card in real-time
      const freshRes = await fetch('/api/auth/me');
      if (freshRes.ok) {
        const freshData = await freshRes.json();
        setMember(freshData.member);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gradient-to-r from-emerald-900 to-emerald-950 border border-emerald-800 rounded-2xl gap-4 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">வணக்கம், {member.name}!</h1>
          <p className="text-xs text-emerald-350">
            உறுப்பினர் எண் (ID): <span className="font-mono text-amber-400 font-bold">{member.member_id}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>வெளியேறு (Logout)</span>
        </button>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-emerald-900/60">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex items-center space-x-1.5 px-6 py-3 border-b-2 font-bold text-sm transition-all duration-200 ${
            activeTab === 'card'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="h-4.5 w-4.5" />
          <span>உறுப்பினர் அட்டை (Digital ID Card)</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-1.5 px-6 py-3 border-b-2 font-bold text-sm transition-all duration-200 ${
            activeTab === 'profile'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="h-4.5 w-4.5" />
          <span>சுயவிவரம் திருத்து (Edit Profile)</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="py-4">
        {activeTab === 'card' ? (
          <div className="animate-fadeIn">
            <FarmerIdCard member={member} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-emerald-950/10 border border-emerald-900/50 p-6 sm:p-8 rounded-2xl shadow-lg backdrop-blur-sm animate-fadeIn">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-emerald-900 pb-2">உறுப்பினர் சுயவிவரம் புதுப்பித்தல்</h2>
            
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-2 text-xs text-emerald-350 text-emerald-355 text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              
              {/* Frozen Fields Disclaimer */}
              <div className="p-3 bg-emerald-950/60 border border-emerald-900/50 rounded-xl text-[11px] text-emerald-350 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-0.5">மாற்ற முடியாத விவரங்கள்:</span>
                உங்களின் மொபைல் எண் (<span className="font-semibold text-white">{member.mobile}</span>), உறுப்பினர் ID, மற்றும் ஆதார் எண் ஆகியவை பாதுகாப்பு காரணங்களுக்காக மாற்ற முடியாது.
              </div>

              {/* Row 1: Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">பெயர் (Name) *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-emerald-700/60"
                  />
                </div>
              </div>

              {/* Row 2: Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">மாவட்டம் *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">வட்டம் *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
                    <input
                      type="text"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">கிராமம் *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Photo Update */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">புகைப்படம் மாற்று</label>
                <div className="flex items-center gap-4 p-4 border border-dashed border-emerald-800 rounded-xl bg-emerald-950/20">
                  <div className="w-16 h-20 rounded-lg border border-emerald-800 bg-emerald-900/50 overflow-hidden flex items-center justify-center shrink-0">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Image className="h-6 w-6 text-emerald-700" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs font-semibold rounded-lg hover:bg-emerald-800"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>புதிய புகைப்படம் தேர்ந்தெடு</span>
                    </button>
                    <p className="text-[10px] text-slate-450 text-slate-400">JPG/PNG, Max 2MB</p>
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

              {/* Row 4: PIN change */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-emerald-900/50 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">புதிய PIN (விருப்பப்பட்டால் மட்டும்)</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      maxLength={4}
                      placeholder="புதிய 4 இலக்க PIN"
                      className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-emerald-700/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">புதிய PIN உறுதி செய்க</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-emerald-500/70" />
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      maxLength={4}
                      placeholder="மீண்டும் உள்ளிடவும்"
                      className="w-full pl-10 pr-4 py-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-emerald-700/60"
                    />
                  </div>
                </div>
              </div>

              {/* Save Update */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold rounded-xl active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>புதுப்பிக்கப்படுகிறது...</span>
                  </>
                ) : (
                  <span>விவரங்களைச் சேமி (Save Changes)</span>
                )}
              </button>

            </form>
          </div>
        )}
      </div>

    </div>
  );
}
