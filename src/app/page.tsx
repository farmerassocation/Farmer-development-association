'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Leaf, UserPlus, LogIn, Shield, Award, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [memberName, setMemberName] = useState('');
  const [registeredMembers, setRegisteredMembers] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setMemberName(data.member.name || '');
        }
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    }

    async function fetchMemberCount() {
      try {
        const res = await fetch('/api/stats/members');
        if (res.ok) {
          const data = await res.json();
          setRegisteredMembers(data.count ?? 0);
        }
      } catch (error) {
        console.error('Error fetching registered member count:', error);
      }
    }

    fetchMember();
    fetchMemberCount();
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
        {/* Soft grid decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Announcement Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-xs font-semibold text-emerald-300 shadow-md">
            <Leaf className="h-4 w-4 text-amber-500" />
            <span>{t('home.announcement')}</span>
          </div>

          {memberName ? (
            <div className="inline-flex items-center rounded-full bg-emerald-900/70 border border-emerald-800 px-4 py-2 text-sm text-emerald-100 shadow-sm">
              <span className="font-semibold text-amber-300">{t('nav.welcome')},</span>
              <span className="ml-2 font-bold text-white">{memberName}</span>
            </div>
          ) : null}

          {/* Main Headings */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-100 to-amber-300 tracking-tight leading-[1.15] font-sans">
              {t('home.heroTitle')}
            </h1>
            <p className="text-[13px] sm:text-sm font-semibold tracking-widest text-emerald-400 uppercase font-sans">
              {t('home.heroSubtitle')}
            </p>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed pt-2 font-sans">
              {t('home.heroDesc')}
            </p>
          </div>

          {/* Primary Calls to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="flex items-center space-x-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-98 transition-all duration-200"
            >
              <UserPlus className="h-5 w-5" />
              <span>{t('home.registerBtn')}</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 border border-emerald-800 hover:border-emerald-600 bg-emerald-950/20 hover:bg-emerald-950/60 text-emerald-300 hover:text-white font-bold rounded-xl active:scale-98 transition-all duration-200"
            >
              <LogIn className="h-5 w-5" />
              <span>{t('home.loginBtn')}</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-t border-b border-emerald-950 bg-emerald-950/10 py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 block font-mono">
                {registeredMembers !== null ? registeredMembers.toLocaleString() : '...' }
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('home.stat.members')}</span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 block font-mono">38</span>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('home.stat.districts')}</span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 block font-mono">24/7</span>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('home.stat.support')}</span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 block font-mono">0%</span>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('home.stat.fee')}</span>
            </div>

          </div>
        </div>
      </section>

      {/* Features / Benefits Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t('home.benefitsTitle')}</h2>
          <p className="text-xs sm:text-sm text-emerald-400 font-semibold uppercase tracking-wider">{t('home.benefitsSub')}</p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            {t('home.benefitsDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: ID Card */}
          <div className="bg-slate-900/50 border border-emerald-950 p-6 rounded-2xl space-y-4 hover:border-emerald-800 transition-all duration-300 group">
            <div className="bg-emerald-950 p-3 rounded-xl w-fit text-amber-400 group-hover:scale-105 transition-transform duration-200">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t('home.card1.title')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {t('home.card1.desc')}
            </p>
          </div>

          {/* Card 2: Schemes */}
          <div className="bg-slate-900/50 border border-emerald-950 p-6 rounded-2xl space-y-4 hover:border-emerald-800 transition-all duration-300 group">
            <div className="bg-emerald-950 p-3 rounded-xl w-fit text-emerald-400 group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t('home.card2.title')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {t('home.card2.desc')}
            </p>
          </div>

          {/* Card 3: Support */}
          <div className="bg-slate-900/50 border border-emerald-950 p-6 rounded-2xl space-y-4 hover:border-emerald-800 transition-all duration-300 group">
            <div className="bg-emerald-950 p-3 rounded-xl w-fit text-amber-400 group-hover:scale-105 transition-transform duration-200">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t('home.card3.title')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {t('home.card3.desc')}
            </p>
          </div>

        </div>
      </section>

      {/* Slogan Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-t border-b border-emerald-900/60 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Leaf className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide leading-tight">
            {t('home.sloganBanner')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-300 font-semibold max-w-xl mx-auto font-sans">
            {t('home.sloganDesc')}
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center space-x-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all duration-200"
            >
              <span>{t('home.joinBtn')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
