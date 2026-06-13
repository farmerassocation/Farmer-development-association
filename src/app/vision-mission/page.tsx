import { Eye, Target, Sparkles, HeartHandshake } from 'lucide-react';

export default function VisionMission() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">நோக்கம் & பார்வை (Vision & Mission)</h1>
          <p className="text-xs sm:text-sm text-emerald-400 font-semibold uppercase tracking-wider">எங்கள் கொள்கைகள் மற்றும் எதிர்கால இலக்குகள்</p>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-2"></div>
        </div>

        {/* Vision Card */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border border-emerald-900/60 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 rotate-45 translate-x-12 -translate-y-12 opacity-10"></div>
          
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="bg-amber-500 p-3.5 rounded-xl text-emerald-950 shadow-lg shrink-0">
              <Eye className="h-7 w-7 stroke-[2.5]" />
            </div>
            <div className="space-y-3 text-slate-350">
              <h2 className="text-xl font-bold text-white tracking-wide">சங்கத்தின் தொலைநோக்கு பார்வை (Our Vision)</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                தமிழ்நாட்டின் ஒவ்வொரு விவசாயியும் பொருளாதாரத் தன்னிறைவு பெற்று, கௌரவமான மற்றும் வளமான வாழ்க்கையை நடத்துவதை உறுதி செய்தல். உழவுத் தொழிலை லாபகரமானதாகவும், எதிர்கால தலைமுறையினர் பெருமையுடன் ஏற்கும் ஒரு தொழிலாகவும் மாற்றுவதே எங்கள் தொலைநோக்கு பார்வையாகும்.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border border-emerald-900/60 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rotate-45 translate-x-12 -translate-y-12 opacity-10"></div>

          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="bg-emerald-600 p-3.5 rounded-xl text-white shadow-lg shrink-0">
              <Target className="h-7 w-7 stroke-[2.5]" />
            </div>
            <div className="space-y-3 text-slate-350">
              <h2 className="text-xl font-bold text-white tracking-wide">சங்கத்தின் பணி இலக்கு (Our Mission)</h2>
              <div className="text-xs sm:text-sm leading-relaxed space-y-3">
                <p>
                  1. **விவசாயிகள் பாதுகாப்பு**: உழவர்களின் விளைபொருட்களுக்கு நியாயமான விலை கிடைக்கச் செய்வதும், சந்தை தரகர்களின் சுரண்டல்களிலிருந்து அவர்களைப் பாதுகாப்பதும்.
                </p>
                <p>
                  2. **நவீன தொழில்நுட்பப் பகிர்வு**: குறைந்த செலவில் அதிக லாபம் தரும் இயற்கை விவசாயம், சொட்டு நீர் பாசனம் மற்றும் டிஜிட்டல் விவசாய உத்திகளை மாநிலம் முழுவதும் பரப்புதல்.
                </p>
                <p>
                  3. **அரசு திட்டங்கள் இணைப்பு**: அரசு வழங்கும் கடனுதவிகள், மானியங்கள் மற்றும் ஓய்வூதியத் திட்டங்களை உரிய காலத்தில் பெற்றுத் தரும் பாலமாகச் செயல்படுதல்.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold text-center text-white">எங்கள் அடிப்படை மதிப்புகள் (Core Values)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="flex items-start space-x-3 bg-slate-900/40 border border-emerald-950 p-5 rounded-xl">
              <Sparkles className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">உண்மை & நேர்மை</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  சங்கத்தின் செயல்பாடுகள் மற்றும் நிதி மேலாண்மை முழு வெளிப்படைத்தன்மையுடன் இருக்கும்.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-slate-900/40 border border-emerald-950 p-5 rounded-xl">
              <HeartHandshake className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">பரஸ்பர ஒத்துழைப்பு</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  விவசாயிகள் தங்களுக்குள் உதவிக் கொள்ளும் கூட்டுறவு மனப்பான்மையை வளர்த்தல்.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
