'use client';

import { Leaf, Calendar, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{t('about.title')}</h1>
          <p className="text-xs sm:text-sm text-emerald-400 font-semibold uppercase tracking-wider">{t('about.subtitle')}</p>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-2"></div>
        </div>

        {/* Content Section 1: Intro */}
        <div className="bg-slate-900/40 border border-emerald-950 p-6 sm:p-8 rounded-2xl space-y-4 leading-relaxed text-sm sm:text-base text-slate-350 font-sans">
          <p>
            <span className="font-bold text-white text-base">{t('about.subtitle')} </span>
            {t('about.intro').replace(t('about.subtitle'), '').trim()}
          </p>
          <p>
            {t('about.desc')}
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-xl space-y-3 text-center">
            <Calendar className="h-7 w-7 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('about.history.title')}</h3>
            <p className="text-xs text-slate-400 leading-normal font-sans">
              {t('about.history.desc')}
            </p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-xl space-y-3 text-center">
            <Award className="h-7 w-7 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('about.growth.title')}</h3>
            <p className="text-xs text-slate-400 leading-normal font-sans">
              {t('about.growth.desc')}
            </p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-xl space-y-3 text-center">
            <Leaf className="h-7 w-7 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('about.activity.title')}</h3>
            <p className="text-xs text-slate-400 leading-normal font-sans">
              {t('about.activity.desc')}
            </p>
          </div>

        </div>

        {/* Association Rules / Highlights */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-emerald-900 pb-2">{t('about.responsibilities.title')}</h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-400 font-sans">
            <li className="flex items-start space-x-2.5">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>{t('about.resp1')}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>{t('about.resp2')}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>{t('about.resp3')}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
