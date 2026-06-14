'use client';

import { useState, useRef } from 'react';
import QRCodeComponent from './QRCodeComponent';
import { Download, Printer, CheckCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
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
const { t } = useLanguage();
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

  const copyComputedStyle = (source: HTMLElement, target: HTMLElement) => {
    const computed = window.getComputedStyle(source);
    let cssText = '';
    for (const property of Array.from(computed)) {
      cssText += `${property}:${computed.getPropertyValue(property)};`;
    }
    target.style.cssText = cssText;
  };

  const cloneWithInlineStyles = (source: HTMLElement) => {
    const clone = source.cloneNode(true) as HTMLElement;

    const traverseElements = (original: HTMLElement, copy: HTMLElement) => {
      copyComputedStyle(original, copy);

      const originalChildren = Array.from(original.children) as HTMLElement[];
      const copyChildren = Array.from(copy.children) as HTMLElement[];

      originalChildren.forEach((child, index) => {
        const copyChild = copyChildren[index];
        if (child instanceof HTMLElement && copyChild instanceof HTMLElement) {
          traverseElements(child, copyChild);
        }
      });
    };

    traverseElements(source, clone);
    return clone;
  };

  const disableAllStyleSheets = () => {
    const disabledSheets: CSSStyleSheet[] = [];

    for (const sheet of Array.from(document.styleSheets) as CSSStyleSheet[]) {
      try {
        if (sheet.disabled) continue;
        sheet.disabled = true;
        disabledSheets.push(sheet);
      } catch {
        continue;
      }
    }

    return disabledSheets;
  };

  const restoreStyleSheets = (sheets: CSSStyleSheet[]) => {
    sheets.forEach((sheet) => {
      sheet.disabled = false;
    });
  };

  const handleDownloadPDF = async () => {
  if (downloading) return;
  setDownloading(true);

  try {
    const { toJpeg } = await import("html-to-image");
    const { jsPDF } = await import("jspdf");

    const node = cardRef.current;
    if (!node) return;

    await new Promise((res) => setTimeout(res, 500));

    // ✅ capture EXACT SIZE (no compression)
    const width = node.scrollWidth;
    const height = node.scrollHeight + 40; // small buffer

    const dataUrl = await toJpeg(node, {
      quality: 1,
      pixelRatio: 3, // 🔥 HD quality
      cacheBust: true,
      backgroundColor: "#022c22",
      width,
      height,
    });

    // ✅ IMPORTANT: use PX, not mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",          // ✅ FIX
      format: [width, height], // ✅ EXACT SIZE
    });

    // ✅ NO RESIZING (this prevents compression)
    pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);

    pdf.save(`Farmer_ID_${member.member_id}.pdf`);

  } catch (err) {
    console.error("PDF error:", err);
    alert("PDF download failed");
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
         
<div className="h-10 w-10 rounded-full border-2 border-amber-500 flex items-center justify-center overflow-hidden">
  <img
    src="/farmer_logo.jpeg"
    alt="Logo"
    className="h-[120%] w-[120%] object-cover rounded-full -m-[2px]"
  />
</div>


            <div className="flex flex-col">
              <span className="font-extrabold text-[9px] text-amber-400 tracking-wide leading-none">
                விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம்
              </span>
              <span className="text-[7.5px] text-emerald-300 font-semibold uppercase tracking-wider mt-0.5">
                Farmers Protection and Development Welfare Association
              </span>
            </div>
          </div>

          {/* Front Details Panel */}
          <div className="flex items-start gap-4 -mt-2">
            {/* Photo slot */}
            <div className="flex flex-col items-center w-24 mt-3">

  {/* Photo */}
  <div className="w-20 h-24 rounded-lg bg-emerald-900 border-2 border-amber-500/60 overflow-hidden flex items-center justify-center relative">
    {member.photo_url ? (
      <img src={member.photo_url} className="w-full h-full object-cover" />
    ) : (
      <span className="text-[8px] text-center text-emerald-300">
        புகைப்படம்<br/>இல்லை
      </span>
    )}

    {/* ✅ Tick INSIDE photo corner */}
    <CheckCircle className="absolute bottom-1 right-1 h-4 w-4 text-amber-400 bg-emerald-950 rounded-full p-[2px]" />
  </div>

  {/* ✅ Contact CENTER aligned */}
 
</div>


            {/* Farmer details */}
      <div className="flex-1 pl-2 text-white">

  {/* ✅ Member ID separate */}
  <div className="mb-1">
    <span className="text-[7px] text-emerald-300">Member ID</span>
    <div className="text-[14px] font-bold text-amber-300">
      {member.member_id}
    </div>
  </div>

  {/* ✅ Grid ONLY for rest */}
  <div className="grid grid-cols-2 gap-y-1.5">

  {/* Name */}
  <div className="-mt-3">
    <span className="text-[7px] text-emerald-300">Name</span>
    <div className="text-[11px] font-semibold">{member.name}</div>
  </div>

  {/* Mobile */}
  <div className="-mt-3">
    <span className="text-[7px] text-emerald-300">Mobile</span>
    <div className="text-[11px] font-semibold">{member.mobile}</div>
  </div>

  {/* Aadhar */}
  <div className="-mt-3">
    <span className="text-[7px] text-emerald-300">Aadhar</span>
    <div className="text-[11px]">
      {maskAadhar(member.aadhar_number)}
    </div>
  </div>

  {/* Reg Date */}
  <div className="-mt-3">
    <span className="text-[7px] text-emerald-300">Reg Date</span>
    <div className="text-[11px]">
      {formatDate(member.created_at)}
    </div>
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
          {/* Back Details Grid */}
<div className="flex items-start justify-between gap-4 mt-2 px-3">

  {/* ✅ LEFT SIDE */}
  <div className="flex-1 text-white text-[9px] space-y-2">

    {/* Village + Taluk */}
    <div className="grid grid-cols-2 gap-x-4">
      <div>
        <span className="text-[7px] text-emerald-300">Village</span>
        <div>{member.village}</div>
      </div>

      <div>
        <span className="text-[7px] text-emerald-300">Taluk</span>
        <div>{member.taluk}</div>
      </div>
    </div>

    {/* District */}
    <div>
      <span className="text-[7px] text-emerald-300">District</span>
      <div>{member.district}</div>
    </div>

    {/* ✅ Association Details */}
    <div className="mt-2 space-y-1 text-[8px] ">

      <div className="font-semibold text-emerald-400">
        Association Details
      </div>

      <div className="grid grid-cols-[55px_8px_auto] ">
        <span className="text-emerald-300">Address</span>
        <span>:</span>
        <span>{t('contact.info.address')}</span>
      </div>

      <div className="grid grid-cols-[55px_8px_auto] ">
        <span className="text-emerald-300">Number</span>
        <span>:</span>
        <span>{t('contact.info.phone')}</span>
      </div>

      <div className="grid grid-cols-[55px_8px_auto]">
        <span className="text-emerald-300">Mail</span>
        <span>:</span>
        <span className="truncate">{t('contact.info.emailAddress')}</span>
      </div>

    </div>

  </div>

  {/* ✅ RIGHT SIDE QR */}
  <div className="flex flex-col items-center bg-white p-1 rounded-lg shadow-md border border-amber-500/25">
    <QRCodeComponent value={verificationUrl} size={72} />
    <span className="text-[6px] text-emerald-950 font-bold mt-1">
      VERIFY ONLINE
    </span>
  </div>

</div>

          {/* Back Information & Terms */}
          <div className="my-1.5 border-t border-b border-emerald-800 py-1 text-[6.5px] text-slate-300 leading-normal space-y-0.5">
            <p>1. இந்த அட்டை சங்கத்தின் அதிகாரப்பூர்வ உறுப்பினர்களுக்கு மட்டுமே சொந்தமானது.</p>
            <p>2. அட்டை தொலைந்து போனால் உடனடியாக தலைமை அலுவலகத்திற்கு தெரிவிக்கவும்.</p>
            <p>3. அட்டை விவரங்களை சரிபார்க்க மேலே உள்ள QR குறியீட்டை ஸ்கேன் செய்யவும்.</p>
          </div>

          {/* Back Footer */}
   <div className="flex justify-between w-full text-[6px] text-emerald-300">

  {/* Treasurer */}
  <div className="flex flex-col items-center">
    <img
      src="/porulaalar.png"
      alt="Treasurer Sign"
      className="h-3 object-contain mb-1"
    />
    <div className="border-b border-dashed w-14 mb-0.5"></div>
    <span>பொருளாளர்</span>
  </div>

  {/* Secretary */}
  <div className="flex flex-col items-center">
    <img
      src="/seyalalar.png"
      alt="Secretary Sign"
      className="h-3 object-contain mb-1"
    />
    <div className="border-b border-dashed w-14 mb-0.5"></div>
    <span>செயலாளர்</span>
  </div>

  {/* President */}
  <div className="flex flex-col items-center">
    <img
      src="/thalaivar.png"
      alt="President Sign"
      className="h-3 object-contain mb-1"
    />
    <div className="border-b border-dashed w-14 mb-0.5"></div>
    <span>தலைவர்</span>
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
