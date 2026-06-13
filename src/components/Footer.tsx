'use client';

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 border-t border-emerald-900 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About Association */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-800 p-2 rounded-lg">
                <Leaf className="h-5 w-5 text-amber-400" />
              </div>
              <span className="font-extrabold text-[15px] text-white tracking-wide">
                {t('brand.title')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.description')}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
              {t('brand.subtitle')}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-900 pb-2">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors duration-150">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors duration-150">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-400 transition-colors duration-150">
                  {t('nav.membership')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors duration-150">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-900 pb-2">
              {t('footer.portalLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-amber-400 transition-colors duration-150">
                  {t('footer.farmerReg')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors duration-150">
                  {t('footer.farmerReg') === 'விவசாயி பதிவு (Farmer Registration)' ? 'உறுப்பினர் உள்நுழைவு (Member Login)' : 'Member Login'}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors duration-150">
                  {t('footer.myDashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-900 pb-2">
              {t('nav.contact')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {t('footer.addressLabel')}
                  </span>
                  <p className="text-slate-400 leading-normal">
                    {t('footer.address')}
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">+91 95850 05304</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">farmerassociation2026@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {year} {t('footer.copyright')}</p>
          <p className="font-semibold text-emerald-600/80">{t('footer.slogan')}</p>
        </div>
      </div>
    </footer>
  );
}
