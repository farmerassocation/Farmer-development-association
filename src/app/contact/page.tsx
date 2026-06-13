'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">தொடர்புகொள்ள (Contact Us)</h1>
          <p className="text-xs sm:text-sm text-emerald-400 font-semibold uppercase tracking-wider">எங்களைத் தொடர்பு கொண்டு உங்கள் சந்தேகங்களைக் கேட்கலாம்</p>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start pt-4">
          
          {/* Contact Info (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white tracking-wide mb-4">தலைமை அலுவலகத் தொடர்பு</h2>
            
            <div className="flex items-start space-x-3 bg-slate-900/50 border border-emerald-950 p-5 rounded-2xl">
              <MapPin className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">முகவரி / Address</span>
                <p className="text-xs sm:text-sm text-slate-400 leading-normal">
                  விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம், 249/1B, ராசி நகர்,<br/>
                  வேலம்பட்டி, பழனி, திண்டுக்கல்.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/50 border border-emerald-950 p-5 rounded-2xl">
              <Phone className="h-5 w-5 text-emerald-400 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">தொலைபேசி / Phone</span>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold">+91 95850 05304</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/50 border border-emerald-950 p-5 rounded-2xl">
              <Mail className="h-5 w-5 text-amber-500 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">மின்னஞ்சல் / Email</span>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold">farmerassociation2026@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form (3 cols) */}
          <div className="md:col-span-3 bg-slate-900/20 border border-emerald-900/60 p-6 sm:p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white tracking-wide mb-5">கருத்துக்களைப் பகிர்க (Send Message)</h2>
            
            <div className="text-sm text-slate-300 leading-relaxed font-sans">
              ஏதேனும் கேள்விகள் அல்லது ஆதரவு கோரிக்கைகள் இருந்தால், எங்களுக்கு மின்னஞ்சல் அல்லது நேரடியாக செய்தி அனுப்பவும்.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
