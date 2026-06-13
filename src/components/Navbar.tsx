'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Leaf, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check login state when route changes
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setIsLoggedIn(false);
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.membership'), path: '/register' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800 text-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-amber-400 to-emerald-500 p-2.5 rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-200">
              <Leaf className="h-6 w-6 text-emerald-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] sm:text-[17px] tracking-wide text-amber-400 font-sans leading-tight">
                {t('brand.title')}
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-300 tracking-wider uppercase font-medium">
                {t('brand.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-emerald-800/80 text-amber-400 border border-emerald-700/50 shadow-inner'
                    : 'hover:bg-emerald-900/60 hover:text-emerald-200 text-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-emerald-900/40 p-1 rounded-lg border border-emerald-800/80 mr-1">
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                  language === 'ta'
                    ? 'bg-amber-500 text-emerald-950 shadow-sm font-extrabold'
                    : 'text-emerald-350 text-emerald-300 hover:text-white hover:bg-emerald-900/30'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                  language === 'en'
                    ? 'bg-amber-500 text-emerald-950 shadow-sm font-extrabold'
                    : 'text-emerald-350 text-emerald-300 hover:text-white hover:bg-emerald-900/30'
                }`}
              >
                English
              </button>
            </div>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 border border-rose-500 hover:bg-rose-550/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-emerald-500/20 active:scale-95 transition-all duration-200 font-sans"
                >
                  {t('nav.memberLogin')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 focus:outline-none transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-900 animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1.5 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                  isActive(link.path)
                    ? 'bg-emerald-900 text-amber-400 shadow-inner'
                    : 'text-slate-200 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Language Selector in Mobile Menu */}
            <div className="flex items-center justify-between px-3 py-3 border-t border-emerald-900/80">
              <span className="text-sm font-semibold text-emerald-300">Language / மொழி</span>
              <div className="flex items-center space-x-1 bg-emerald-900/60 p-1 rounded-lg border border-emerald-800">
                <button
                  onClick={() => setLanguage('ta')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-150 ${
                    language === 'ta'
                      ? 'bg-amber-500 text-emerald-950 shadow-sm'
                      : 'text-emerald-300'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-150 ${
                    language === 'en'
                      ? 'bg-amber-500 text-emerald-950 shadow-sm'
                      : 'text-emerald-300'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t border-emerald-900 px-3 space-y-3">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 border border-rose-500 text-rose-400 font-semibold rounded-lg hover:bg-rose-500/10"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-500"
                  >
                    {t('nav.memberLogin')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
