'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ta' | 'en';

const translations = {
  ta: {
    // Navbar
    'nav.home': 'முகப்பு (Home)',
    'nav.about': 'எங்களைப் பற்றி (About Us)',
    'nav.membership': 'உறுப்பினர் சேர்க்கை (Membership / Join Us)',
    'nav.contact': 'தொடர்புக்கு (Contact)',
    'nav.memberLogin': 'உறுப்பினர் உள்நுழைவு (Login)',
    'nav.welcome': 'வணக்கம்',
    'nav.dashboard': 'டேஷ்போர்டு',
    'nav.logout': 'வெளியேறு',
    'brand.title': 'விவசாய பாதுகாப்பு சங்கம்',
    'brand.subtitle': 'Farmers Welfare Association',

    // Footer
    'footer.description': 'விவசாயிகளின் வாழ்வாதாரத்தை மேம்படுத்தவும், அவர்களின் உரிமைகளைப் பாதுகாக்கவும் உருவாக்கப்பட்ட சங்கம்.',
    'footer.quickLinks': 'பக்கங்கள் (Quick Links)',
    'footer.portalLinks': 'போர்டல் (Portal Links)',
    'footer.farmerReg': 'விவசாயி பதிவு (Farmer Registration)',
    'footer.myDashboard': 'என் கணக்கு (My Dashboard)',
    'footer.addressLabel': 'முகவரி / Address',
    'footer.address': 'தலைமை அலுவலகம், விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம், தமிழ்நாடு, இந்தியா.',
    'footer.copyright': 'விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'footer.slogan': 'விவசாயமே நாட்டின் முதுகெலும்பு',

    // Home Page
    'home.announcement': 'புதிய உறுப்பினர் சேர்க்கை தீவிரமாக நடைபெறுகிறது',
    'home.heroTitle': 'விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம்',
    'home.heroSubtitle': 'Farmers Protection and Development Welfare Association',
    'home.heroDesc': 'விவசாயிகளின் வாழ்வாதாரத்தை பாதுகாக்கவும், புதிய வேளாண் தொழில்நுட்பங்கள் மற்றும் அரசு திட்டங்களை எளிதாகப் பெறவும் இன்றே உறுப்பினராக இணையுங்கள்.',
    'home.registerBtn': 'இலவசமாக பதிவு செய்ய (Register Now)',
    'home.loginBtn': 'உள்நுழைய (Member Login)',
    'home.stat.members': 'பதிவுசெய்த உறுப்பினர்கள்',
    'home.stat.districts': 'மாவட்டங்கள்',
    'home.stat.support': 'விவசாயி ஆதரவு',
    'home.stat.fee': 'பதிவுக் கட்டணம்',
    'home.benefitsTitle': 'சங்கத்தின் நன்மைகள் மற்றும் திட்டங்கள்',
    'home.benefitsSub': 'Association Benefits',
    'home.benefitsDesc': 'எங்கள் சங்கத்தில் உறுப்பினராக இணைவதன் மூலம் நீங்கள் பின்வரும் முக்கிய நன்மைகளைப் பெறலாம்:',
    'home.card1.title': 'உடனடி டிஜிட்டல் அடையாள அட்டை',
    'home.card1.desc': 'பதிவு செய்தவுடன் உங்களது பாஸ்போர்ட் புகைப்படத்துடன் கூடிய பிரத்யேக டிஜிட்டல் அடையாள அட்டை (Digital ID Card) நொடியில் உருவாக்கப்படும்.',
    'home.card2.title': 'உரிமைகள் மற்றும் அரசு நலத்திட்டங்கள்',
    'home.card2.desc': 'விவசாயிகளுக்கான அரசு சலுகைகள், மானியங்கள், பயிர் காப்பீட்டுத் திட்டங்கள் மற்றும் நல வாரிய உதவிகளைப் பெற வழிகாட்டுதல்கள்.',
    'home.card3.title': 'கூட்டுறவு மற்றும் ஒற்றுமை',
    'home.card3.desc': 'விவசாயிகள் தங்களின் வேளாண் பொருட்கள் விற்பனை, புதிய உத்திகள் பகிர்வு மற்றும் சந்தேகங்களைத் தீர்த்துக்கொள்ள மாபெரும் குழு அமைப்பு.',
    'home.sloganBanner': '“உழவுக்கும் தொழிலுக்கும் வந்தனை செய்வோம்”',
    'home.sloganDesc': 'விவசாயிகளின் உரிமைகளையும் நாட்டின் விவசாய வளர்ச்சியையும் பாதுகாப்பது நமது கடமையாகும்.',
    'home.joinBtn': 'இன்றே உறுப்பினராகவும்',

    // About Page
    'about.title': 'எங்களைப் பற்றி (About Us)',
    'about.subtitle': 'விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம்',
    'about.intro': 'விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம் என்பது விவசாயிகளின் உரிமைகளைப் பாதுகாக்கவும், விவசாயத் துறையின் வளர்ச்சியை மேம்படுத்தவும் தொடங்கப்பட்ட ஒரு லாப நோக்கமற்ற அமைப்பாகும்.',
    'about.desc': 'தமிழ்நாட்டின் அனைத்து மாவட்டங்களிலும் உள்ள விவசாயிகளை ஒருங்கிணைத்து, கூட்டு முயற்சியின் மூலம் உழவர்களின் வாழ்க்கைத் தரத்தை உயர்த்துவதே எங்கள் முக்கிய நோக்கமாகும். நவீன வேளாண் தொழில்நுட்பங்களை விவசாயிகளுக்கு அறிமுகப்படுத்துவதிலும், அரசு வழங்கும் மானியங்கள் மற்றும் காப்பீடுகளைச் சரியான உழவர்களிடம் கொண்டு சேர்ப்பதிலும் நாங்கள் உறுதுணையாகச் செயல்படுகிறோம்.',
    'about.history.title': 'தொடக்கம் (History)',
    'about.history.desc': 'விவசாயிகளின் நீண்ட நாள் கோரிக்கைகளை நிறைவேற்றவும், சமூக நீதியைப் பாதுகாக்கவும் இச்சங்கம் தொடங்கப்பட்டது.',
    'about.growth.title': 'வளர்ச்சி (Growth)',
    'about.growth.desc': 'தற்போது 10 லட்சத்திற்கும் அதிகமான விவசாயிகள் இணைந்து தமிழ்நாட்டின் மிகப்பெரிய உழவர் கூட்டமைப்பாக வளர்ந்துள்ளது.',
    'about.activity.title': 'செயல்பாடு (Activity)',
    'about.activity.desc': 'உறுப்பினர்களுக்குத் டிஜிட்டல் அடையாள அட்டை வழங்கி, அவர்களின் கோரிக்கைகளை அரசுக்குக் கொண்டு செல்கிறது.',
    'about.responsibilities.title': 'சங்கத்தின் முக்கிய பொறுப்புகள்',
    'about.resp1': 'விவசாயிகளுக்கு எதிரான சுரண்டல்கள் மற்றும் அநியாயங்களைத் தடுத்து அவர்களின் பொருளாதார பாதுகாப்பை உறுதி செய்தல்.',
    'about.resp2': 'இயற்கை விவசாயம், சொட்டு நீர் பாசனம், மற்றும் கூட்டுப் பண்ணையம் குறித்த சிறப்புப் பயிற்சி முகாம்களை நடத்துதல்.',
    'about.resp3': 'வறட்சி, புயல், மழை போன்ற இயற்கைப் பேரிடர் காலங்களில் உரிய நஷ்டஈடு பெற்றுத்தர சட்ட ரீதியான உதவிகளை வழங்குதல்.',

    // Contact Page
    'contact.title': 'தொடர்புகொள்ள (Contact Us)',
    'contact.subtitle': 'எங்களைத் தொடர்பு கொண்டு உங்கள் சந்தேகங்களைக் கேட்கலாம்',
    'contact.formTitle': 'கருத்துக்களைப் பகிர்க (Send Message)',
    'contact.label.name': 'விவசாயி பெயர் / Name *',
    'contact.place.name': 'உங்களின் முழு பெயர்',
    'contact.label.mobile': 'மொபைல் எண் / Mobile *',
    'contact.place.mobile': '10 இலக்க மொபைல் எண்',
    'contact.label.msg': 'செய்தி / Message *',
    'contact.place.msg': 'உங்கள் கோரிக்கைகள் அல்லது கருத்துக்களை இங்கு எழுதவும்...',
    'contact.btn.send': 'செய்தி அனுப்புக',
    'contact.btn.sending': 'அனுப்பப்படுகிறது...',
    'contact.success': 'உங்களின் செய்தி வெற்றிகரமாக அனுப்பப்பட்டது. எங்கள் குழுவினர் விரைவில் உங்களைத் தொடர்பு கொள்வார்கள்!',
    'contact.info.title': 'தலைமை அலுவலகத் தொடர்பு',
    'contact.info.addressLabel': 'முகவரி / Address',
    'contact.info.address': 'விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம், 249/1B, ராசி நகர், வேலம்பட்டி, பழனி, திண்டுக்கல்.',
    'contact.info.phoneLabel': 'தொலைபேசி / Phone',
    'contact.info.emailLabel': 'மின்னஞ்சல் / Email',

    // Login Form
    'login.title': 'உறுப்பினர் உள்நுழைவு (Login)',
    'login.subtitle': 'விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம்',
    'login.label.mobile': 'மொபைல் எண் (Mobile) *',
    'login.place.mobile': '10 இலக்க மொபைல் எண்',
    'login.label.pin': 'ரகசிய PIN (4-digit PIN) *',
    'login.place.pin': '4 இலக்க PIN',
    'login.btn.verifying': 'சரிபார்க்கப்படுகிறது...',
    'login.btn.login': 'உள்நுழை (Login)',
    'login.err.missing': 'மொபைல் எண் மற்றும் PIN இரண்டையும் உள்ளிடவும்.',
    'login.err.mobileLen': 'மொபைல் எண் 10 இலக்க எண்ணாக இருக்க வேண்டும்.',
    'login.err.pinLen': 'PIN 4 இலக்க எண்களாக இருக்க வேண்டும்.',

    // Register Form
    'reg.title': 'விவசாயி புதிய பதிவு படிவம்',
    'reg.subtitle': 'விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம், தமிழ்நாடு',
    'reg.label.name': 'முழு பெயர் (Full Name) *',
    'reg.place.name': 'எ.கா: ராமசாமி பி',
    'reg.label.mobile': 'மொபைல் எண் (Mobile) *',
    'reg.place.mobile': '10 இலக்க மொபைல் எண்',
    'reg.label.aadhar': 'ஆதார் எண் (Aadhaar Number) (optional)',
    'reg.place.aadhar': '12 இலக்க ஆதார் எண்',
    'reg.label.district': 'மாவட்டம் (District) *',
    'reg.place.district': 'மாவட்டம்',
    'reg.label.taluk': 'வட்டம் (Taluk) *',
    'reg.place.taluk': 'வட்டம்',
    'reg.label.village': 'கிராமம் (Village) *',
    'reg.place.village': 'கிராமம்',
    'reg.label.photo': 'புகைப்படம் பதிவேற்றவும் (Farmer Photo) *',
    'reg.photoDesc': 'உறுப்பினர் அட்டையில் காட்டுவதற்காக உங்கள் பாஸ்போர்ட் அளவிலான புகைப்படத்தை பதிவேற்றவும். (JPG/PNG, Max 2MB)',
    'reg.photoBtn': 'புகைப்படம் தேர்வு செய்',
    'reg.label.pin': 'உள்நுழைவு PIN (4-digit PIN) *',
    'reg.place.pin': '4 இலக்க ரகசிய PIN',
    'reg.label.confirmPin': 'PIN உறுதி செய்க (Confirm PIN) *',
    'reg.place.confirmPin': 'மீண்டும் உள்ளிடவும்',
    'reg.btn.registering': 'உறுப்பினர் அட்டை உருவாக்கப்படுகிறது...',
    'reg.btn.register': 'பதிவு செய்க மற்றும் அட்டை பெறுக (Register & Get ID)',
    'reg.successTitle': 'பதிவு வெற்றிகரமாக முடிந்தது!',
    'reg.successText': 'உங்களின் உறுப்பினர் அட்டை வெற்றிகரமாக உருவாக்கப்பட்டுள்ளது. இன்னும் ஒரு சில நொடிகளில் டேஷ்போர்டிற்கு அழைத்துச் செல்லப்படுவீர்கள்...',
    'reg.successId': 'உங்களின் உறுப்பினர் எண் (Your Member ID)',
    'reg.err.photoFormat': 'தயவுசெய்து ஒரு படத்தை (Image) மட்டும் தேர்வு செய்யவும்.',
    'reg.err.photoSize': 'படம் 2MB-க்குள் இருக்க வேண்டும்.',
    'reg.err.missing': 'தயவுசெய்து அனைத்து கட்டாய புலங்களையும் நிரப்பவும்.',
    'reg.err.mobileLen': 'மொபைல் எண் 10 இலக்க எண்ணாக இருக்க வேண்டும்.',
    'reg.err.aadharLen': 'ஆதார் எண் 12 இலக்க எண்ணாக இருக்க வேண்டும்.',
    'reg.err.pinLen': 'PIN 4 இலக்க எண்களாக இருக்க வேண்டும்.',
    'reg.err.pinMismatch': 'உள்ளிடப்பட்ட இரண்டு PIN-களும் பொருந்தவில்லை.',
    'reg.err.photoRequired': 'உறுப்பினர் அட்டைக்கு ஒரு புகைப்படத்தை பதிவேற்றுவது கட்டாயமாகும்.'
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.membership': 'Membership / Join Us',
    'nav.contact': 'Contact',
    'nav.memberLogin': 'Member Login',
    'nav.welcome': 'Welcome',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'brand.title': 'Farmers Protection Association',
    'brand.subtitle': 'Farmers Welfare Association',

    // Footer
    'footer.description': 'An association established to improve the livelihood of farmers and protect their rights.',
    'footer.quickLinks': 'Quick Links',
    'footer.portalLinks': 'Portal Links',
    'footer.farmerReg': 'Farmer Registration',
    'footer.myDashboard': 'My Dashboard',
    'footer.addressLabel': 'Address',
    'footer.address': 'Farmers Protection & Development Welfare Association, 249/1B, Rasi Nagar, Velampatti, Palani, Dindigul, Tamil Nadu, India.',
    'footer.copyright': 'Farmers Protection & Development Welfare Association. All rights reserved.',
    'footer.slogan': 'Agriculture is the Backbone of the Nation',

    // Home Page
    'home.announcement': 'New member registrations are actively underway',
    'home.heroTitle': 'Farmers Protection and Development Welfare Association',
    'home.heroSubtitle': 'Farmers Protection and Development Welfare Association',
    'home.heroDesc': 'Join us today to protect farmers\' livelihoods, and easily access modern agricultural technologies and government schemes.',
    'home.registerBtn': 'Register Now (Free)',
    'home.loginBtn': 'Member Login',
    'home.stat.members': 'Registered Members',
    'home.stat.districts': 'Districts',
    'home.stat.support': 'Farmer Support',
    'home.stat.fee': 'Registration Fee',
    'home.benefitsTitle': 'Association Benefits and Schemes',
    'home.benefitsSub': 'Association Benefits',
    'home.benefitsDesc': 'By joining our association, you will receive the following key benefits:',
    'home.card1.title': 'Instant Digital ID Card',
    'home.card1.desc': 'A unique digital ID card with your passport photo will be instantly generated upon registration.',
    'home.card2.title': 'Rights & Govt Welfare Schemes',
    'home.card2.desc': 'Receive guidance to access government concessions, subsidies, crop insurance, and welfare assistance.',
    'home.card3.title': 'Cooperation and Unity',
    'home.card3.desc': 'A massive community platform for farmers to market agricultural produce, share strategies, and resolve doubts.',
    'home.sloganBanner': '“Let us pay homage to agriculture and industry”',
    'home.sloganDesc': 'It is our duty to protect the rights of farmers and support the country\'s agricultural development.',
    'home.joinBtn': 'Join as a Member Today',

    // About Page
    'about.title': 'About Us',
    'about.subtitle': 'Farmers Protection & Development Welfare Association',
    'about.intro': 'Farmers Protection & Development Welfare Association is a non-profit organization established to protect the rights of farmers and foster growth in the agricultural sector.',
    'about.desc': 'Our primary objective is to unite farmers across all districts of Tamil Nadu and elevate their standard of living through collaborative efforts. We support farmers in adopting modern agricultural technologies and ensure government subsidies and crop insurance reach those in need.',
    'about.history.title': 'History',
    'about.history.desc': 'This association was established to fulfill the long-standing demands of farmers and secure social justice.',
    'about.growth.title': 'Growth',
    'about.growth.desc': 'We have grown to over 10 lakh members, making us Tamil Nadu\'s largest farmers\' federation.',
    'about.activity.title': 'Activities',
    'about.activity.desc': 'Distributing digital ID cards to members and representing their grievances to government bodies.',
    'about.responsibilities.title': 'Key Responsibilities of the Association',
    'about.resp1': 'Preventing exploitation and injustice against farmers to ensure their economic security.',
    'about.resp2': 'Conducting special training programs on organic farming, drip irrigation, and collective farming.',
    'about.resp3': 'Providing legal and administrative aid to secure proper compensation during natural disasters like drought, storm, or heavy rain.',

    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Reach out to us to ask questions or clarify your doubts',
    'contact.formTitle': 'Send Message',
    'contact.label.name': 'Farmer Name *',
    'contact.place.name': 'Your Full Name',
    'contact.label.mobile': 'Mobile Number *',
    'contact.place.mobile': '10-digit mobile number',
    'contact.label.msg': 'Message *',
    'contact.place.msg': 'Write your requests or feedback here...',
    'contact.btn.send': 'Send Message',
    'contact.btn.sending': 'Sending...',
    'contact.success': 'Your message has been sent successfully. Our team will contact you shortly!',
    'contact.info.title': 'Head Office Contact',
    'contact.info.addressLabel': 'Address',
    'contact.info.address': 'Head Office, Farmers Protection & Development Welfare Association, 12, Anna Salai, Chennai - 600002, Tamil Nadu, India.',
    'contact.info.phoneLabel': 'Phone',
    'contact.info.emailLabel': 'Email',

    // Login Form
    'login.title': 'Member Login',
    'login.subtitle': 'Farmers Protection & Development Welfare Association',
    'login.label.mobile': 'Mobile Number *',
    'login.place.mobile': '10-digit mobile number',
    'login.label.pin': 'Secret PIN (4-digit PIN) *',
    'login.place.pin': '4-digit PIN',
    'login.btn.verifying': 'Verifying...',
    'login.btn.login': 'Login',
    'login.err.missing': 'Please enter both mobile number and PIN.',
    'login.err.mobileLen': 'Mobile number must be exactly 10 digits.',
    'login.err.pinLen': 'PIN must be exactly 4 digits.',

    // Register Form
    'reg.title': 'Farmer Registration Form',
    'reg.subtitle': 'Farmers Protection and Development Welfare Association, Tamil Nadu',
    'reg.label.name': 'Full Name *',
    'reg.place.name': 'e.g., Ramasamy P',
    'reg.label.mobile': 'Mobile Number *',
    'reg.place.mobile': '10-digit mobile number',
    'reg.label.aadhar': 'Aadhaar Number (optional)',
    'reg.place.aadhar': '12-digit Aadhaar number',
    'reg.label.district': 'District *',
    'reg.place.district': 'District Name',
    'reg.label.taluk': 'Taluk *',
    'reg.place.taluk': 'Taluk Name',
    'reg.label.village': 'Village *',
    'reg.place.village': 'Village Name',
    'reg.label.photo': 'Upload Photo (Farmer Photo) *',
    'reg.photoDesc': 'Please upload your passport-sized photograph to be shown on the ID card. (JPG/PNG, Max 2MB)',
    'reg.photoBtn': 'Choose Photo',
    'reg.label.pin': 'Login PIN (4-digit PIN) *',
    'reg.place.pin': '4-digit secret PIN',
    'reg.label.confirmPin': 'Confirm PIN *',
    'reg.place.confirmPin': 'Enter PIN again',
    'reg.btn.registering': 'Generating ID Card...',
    'reg.btn.register': 'Register & Get ID Card',
    'reg.successTitle': 'Registration Completed Successfully!',
    'reg.successText': 'Your membership card has been successfully generated. Redirecting you to the dashboard in a few seconds...',
    'reg.successId': 'Your Member ID',
    'reg.err.photoFormat': 'Please select a valid image file only.',
    'reg.err.photoSize': 'Image size must be less than 2MB.',
    'reg.err.missing': 'Please fill in all required fields.',
    'reg.err.mobileLen': 'Mobile number must be exactly 10 digits.',
    'reg.err.aadharLen': 'Aadhaar number must be exactly 12 digits.',
    'reg.err.pinLen': 'PIN must be exactly 4 digits.',
    'reg.err.pinMismatch': 'The two entered PINs do not match.',
    'reg.err.photoRequired': 'Uploading a photo is mandatory for the membership card.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ta']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ta');

  useEffect(() => {
    const saved = localStorage.getItem('farmer_lang') as Language;
    if (saved === 'ta' || saved === 'en') {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = 'ta';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmer_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: keyof typeof translations['ta']): string => {
    return translations[language][key] || translations['ta'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
