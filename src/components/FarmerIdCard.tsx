'use client';

import { useState, useRef } from 'react';
import QRCodeComponent from './QRCodeComponent';
import { Download, Printer, CheckCircle, ShieldAlert } from 'lucide-react';

interface MemberData {
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

interface FarmerIdCardProps {
  member: MemberData;
}

export default function FarmerIdCard({ member }: FarmerIdCardProps) {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mask Aadhaar: XXXX XXXX 1234
  const maskAadhar = (num?: string) => {
    if (!num) return 'N/A';
    const clean = num.replace(/\s/g, '');
    if (clean.length !== 12) return num;
    return `XXXX XXXX ${clean.substring(8)}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ta-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${member.member_id}` 
    : `/verify/${member.member_id}`;

  const handleDownloadPDF = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      // Lazy load html2canvas and jsPDF to optimize bundle size
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const cardElement = cardRef.current;
      if (!cardElement) return;

      // Temporary class to optimize layout for capturing
      cardElement.classList.add('pdf-capture-mode');

      let canvas;
      try {
        canvas = await html2canvas(cardElement, {
          scale: 2.5, // Crisp resolution
          useCORS: true, // Allow cross-origin images from Supabase
          allowTaint: true,
          backgroundColor: '#022c22', // Match dark forest bg
          logging: false,
        });
      } finally {
        cardElement.classList.remove('pdf-capture-mode');
      }

      if (!canvas) {
        throw new Error('Canvas generation failed');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Card aspect ratio: 2 cards (360x224 each) side-by-side with 24px gap = 744x224
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [210, 297], // A4 Standard
      });

      // Center it on the A4 landscape sheet (297mm x 210mm)
      // Card bounding box is approx 220mm wide and 66mm high
      const width = 240;
      const height = (width * 224) / 744;
      const x = (297 - width) / 2;
      const y = (210 - height) / 2;

      // Add a header/title inside the PDF
      pdf.setFontSize(14);
      pdf.setTextColor(2, 44, 34); // emerald-950
      pdf.text('Farmers Protection and Development Welfare Association', 148.5, 40, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம்', 148.5, 46, { align: 'center' });

      // Draw membership card image
      pdf.addImage(imgData, 'JPEG', x, y, width, height);

      // Footer notice in PDF
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text('This is a digital membership ID card. Please scan the QR code to verify details online.', 148.5, y + height + 15, { align: 'center' });

      pdf.save(`Farmer_ID_${member.member_id}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('PDF பதிவிறக்கம் செய்யத் தவறியது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto py-6">
      
      {/* Printable / Downloadable Container */}
      <div 
        ref={cardRef}
        id="id-card-print-area"
        className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-emerald-950 border border-emerald-800 shadow-2xl relative overflow-visible"
      >
        {/* Decorative background watermark inside cards */}
        <div className="absolute inset-0 bg-[radial-gradient(#065f46_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        {/* ==================== FRONT SIDE ==================== */}
        <div className="w-[360px] min-h-[224px] bg-gradient-to-br from-emerald-900 to-emerald-950 border-2 border-amber-500/80 rounded-xl relative p-3 flex flex-col justify-between shadow-lg shrink-0 overflow-visible select-none">
          {/* Subtle gold ribbon in corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500 rotate-45 translate-x-8 -translate-y-8 opacity-20 pointer-events-none"></div>
          
          {/* Front Header */}
          <div className="flex items-center space-x-2 border-b border-amber-500/30 pb-2">
            <div className="bg-amber-500 p-1.5 rounded-lg text-emerald-950 shadow-inner">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M17,8C8,8 4,16 4,16C4,16 8,10 17,10C21.5,10 22,12 22,12C22,12 21.5,8 17,8M16,14C11.5,14 10,17 10,17C10,17 11.5,15 16,15C18.5,15 19,16 19,16C19,16 18.5,14 16,14M17,11.5C14.5,11.5 13,13.5 13,13.5C13,13.5 14.5,12.5 17,12.5C18.5,12.5 19,13 19,13C19,13 18.5,11.5 17,11.5Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[12px] text-amber-400 tracking-wide leading-none">
                விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம்
              </span>
              <span className="text-[7.5px] text-emerald-300 font-semibold uppercase tracking-wider mt-0.5">
                Farmers Protection and Development Welfare Association
              </span>
            </div>
          </div>

          {/* Front Details Panel */}
          <div className="flex items-center space-x-3 my-auto py-1">
            {/* Photo slot */}
            <div className="relative shrink-0">
              <div className="w-20 h-24 rounded-lg bg-emerald-900 border-2 border-amber-500/60 overflow-hidden shadow-inner flex items-center justify-center">
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={member.photo_url} 
                    alt="Farmer Photo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[8px] text-emerald-300 font-bold text-center px-1">புகைப்படம்<br/>இல்லை</span>
                )}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-950 border border-amber-500/40 rounded-full p-0.5">
                <CheckCircle className="h-3.5 w-3.5 text-amber-500 fill-emerald-950 stroke-[2.5]" />
              </div>
            </div>

            {/* Farmer details */}
            <div className="flex-1 min-w-0 space-y-1.5 text-white">
              <div className="leading-tight">
                <span className="text-[8px] text-emerald-300 uppercase tracking-wider block font-medium">Member ID</span>
                <span className="font-mono font-bold text-[13px] text-amber-300 tracking-wide">{member.member_id}</span>
              </div>
              <div className="leading-tight">
                <span className="text-[7px] text-emerald-300 uppercase tracking-wider block font-medium">பெயர் / Name</span>
                <span className="font-bold text-[11px] block max-w-[200px] break-words">{member.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="leading-tight">
                  <span className="text-[7px] text-emerald-300 uppercase tracking-wider block font-medium">மாவட்டம் / District</span>
                  <span className="font-semibold text-[9px] block break-words">{member.district}</span>
                </div>
                <div className="leading-tight">
                  <span className="text-[7px] text-emerald-300 uppercase tracking-wider block font-medium">கிராமம் / Village</span>
                  <span className="font-semibold text-[9px] block break-words">{member.village}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Front Footer */}
          <div className="border-t border-amber-500/20 pt-1 flex items-center justify-between text-[7px] text-emerald-200">
            <span>அங்கீகரிக்கப்பட்ட உறுப்பினர் அட்டை / Digital Membership Card</span>
            <span className="font-semibold text-amber-400">ACTIVE</span>
          </div>
        </div>

        {/* ==================== BACK SIDE ==================== */}
        <div className="w-[360px] min-h-[224px] bg-gradient-to-br from-emerald-950 to-emerald-900 border-2 border-amber-500/80 rounded-xl relative p-3 flex flex-col justify-between shadow-lg shrink-0 overflow-visible select-none">
          <div className="absolute top-0 left-0 w-16 h-16 bg-emerald-800 rotate-45 -translate-x-8 -translate-y-8 opacity-25 pointer-events-none"></div>

          {/* Back Details Grid */}
          <div className="flex justify-between items-start space-x-3 mt-1">
            <div className="flex-1 space-y-2 text-white">
              <div className="leading-tight">
                <span className="text-[7px] text-emerald-300 uppercase tracking-wider block">மொபைல் எண் / Mobile</span>
                <span className="font-bold text-[10px]">{member.mobile}</span>
              </div>
              <div className="leading-tight">
                <span className="text-[7px] text-emerald-300 uppercase tracking-wider block">ஆதார் எண் / Aadhaar Number</span>
                <span className="font-bold text-[10px] tracking-widest">{maskAadhar(member.aadhar_number)}</span>
              </div>
              <div className="leading-tight">
                <span className="text-[7px] text-emerald-300 uppercase tracking-wider block font-medium">பதிவு தேதி / Reg Date</span>
                <span className="font-bold text-[10px]">{formatDate(member.created_at)}</span>
              </div>
              <div className="leading-tight">
                <span className="text-[7px] text-emerald-300 uppercase tracking-wider block font-medium">வட்டம் / Taluk</span>
                <span className="font-bold text-[10px]">{member.taluk}</span>
              </div>
            </div>

            {/* Verification QR Code Panel */}
            <div className="flex flex-col items-center bg-white p-1 rounded-lg shadow-md shrink-0 border border-amber-500/25">
              <QRCodeComponent value={verificationUrl} size={76} />
              <span className="text-[6.5px] text-emerald-950 font-bold tracking-widest uppercase mt-1">VERIFY ONLINE</span>
            </div>
          </div>

          {/* Back Information & Terms */}
          <div className="my-1.5 border-t border-b border-emerald-800 py-1 text-[6.5px] text-slate-300 leading-normal space-y-0.5">
            <p>1. இந்த அட்டை சங்கத்தின் அதிகாரப்பூர்வ உறுப்பினர்களுக்கு மட்டுமே சொந்தமானது.</p>
            <p>2. அட்டை தொலைந்து போனால் உடனடியாக தலைமை அலுவலகத்திற்கு தெரிவிக்கவும்.</p>
            <p>3. அட்டை விவரங்களை சரிபார்க்க மேலே உள்ள QR குறியீட்டை ஸ்கேன் செய்யவும்.</p>
          </div>

          {/* Back Footer */}
          <div className="flex items-center justify-between text-[7px] text-emerald-300 font-sans mt-0.5">
            <div className="flex items-center space-x-1">
              <span>உதவிக்கு: <span className="font-bold text-amber-400">+91 98765 43210</span></span>
            </div>
            <div className="flex flex-col items-end">
              <span className="h-3 w-16 border-b border-dashed border-emerald-500/60 mb-0.5"></span>
              <span className="text-[5.5px] text-emerald-400 uppercase tracking-wider font-semibold">தலைவர் / Authorized Signatory</span>
            </div>
          </div>
        </div>

      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/10 active:scale-98 disabled:opacity-50 transition-all duration-200"
        >
          <Download className="h-5 w-5 animate-bounce" />
          <span>{downloading ? 'PDF உருவாக்கப்படுகிறது...' : 'உறுப்பினர் அட்டை பதிவிறக்கு (Download PDF)'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-lg active:scale-98 transition-all duration-200 border border-slate-700"
        >
          <Printer className="h-5 w-5" />
          <span>அச்சிடு (Print Card)</span>
        </button>
      </div>

      {/* Security Disclaimer Notice */}
      <div className="flex items-start space-x-2.5 bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-xl max-w-xl text-xs text-emerald-300">
        <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-400 block mb-0.5">பாதுகாப்பு குறிப்பு (Security Note)</span>
          ஆதார் எண்கள் போன்ற முக்கியமான விவரங்கள் மறைக்கப்பட்டுள்ளன. உங்கள் அட்டை உண்மையானது என்பதைச் சரிபார்க்க, பின் பக்கத்தில் உள்ள QR குறியீட்டை ஏதேனும் ஸ்மார்ட்போன் மூலம் ஸ்கேன் செய்து சரிபார்த்துக் கொள்ளலாம்.
        </div>
      </div>

      {/* CSS Styles for Print override */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #id-card-print-area, #id-card-print-area * {
            visibility: visible;
          }
          #id-card-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            flex-direction: row !important;
            gap: 20px !important;
          }
          /* Ensure backgrounds are printed */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        /* Capture Mode Overrides for html2canvas to render beautifully */
        .pdf-capture-mode {
          display: flex !important;
          flex-direction: row !important;
          gap: 24px !important;
          width: 744px !important;
          min-height: 224px !important;
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
          overflow: visible !important;

          /* Override Tailwind root color vars with plain hex values for html2canvas compatibility */
          --color-emerald-50: #ecfdf5;
          --color-emerald-100: #d1fae5;
          --color-emerald-200: #a7f3d0;
          --color-emerald-300: #6ee7b7;
          --color-emerald-400: #34d399;
          --color-emerald-500: #10b981;
          --color-emerald-600: #059669;
          --color-emerald-700: #047857;
          --color-emerald-800: #065f46;
          --color-emerald-900: #064e3b;
          --color-emerald-950: #052e16;

          --color-amber-300: #fcd34d;
          --color-amber-400: #fbbf24;
          --color-amber-500: #f59e0b;
          --color-amber-600: #d97706;

          --color-slate-300: #cbd5e1;
          --color-slate-400: #94a3b8;
          --color-slate-500: #64748b;
          --color-slate-700: #334155;
          --color-slate-800: #1e293b;
          --color-slate-900: #0f172a;
        }

        .pdf-capture-mode * {
          overflow: visible !important;
        }
          --color-emerald-50: #ecfdf5;
          --color-emerald-100: #d1fae5;
          --color-emerald-200: #a7f3d0;
          --color-emerald-300: #6ee7b7;
          --color-emerald-400: #34d399;
          --color-emerald-500: #10b981;
          --color-emerald-600: #059669;
          --color-emerald-700: #047857;
          --color-emerald-800: #065f46;
          --color-emerald-900: #064e3b;
          --color-emerald-950: #052e16;

          --color-amber-300: #fcd34d;
          --color-amber-400: #fbbf24;
          --color-amber-500: #f59e0b;
          --color-amber-600: #d97706;

          --color-slate-300: #cbd5e1;
          --color-slate-400: #94a3b8;
          --color-slate-500: #64748b;
          --color-slate-700: #334155;
          --color-slate-800: #1e293b;
          --color-slate-900: #0f172a;
        }
      `}</style>
    </div>
  );
}
