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
  const [isAdmin, setIsAdmin] = useState(false); 

  const pathname = usePathname();
  const router = useRouter();

  // Check auth + admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');

        if (res.ok) {
          const data = await res.json();

          setIsLoggedIn(true);

          //  ADMIN CHECK
          if (data.member?.mobile === "9585005304") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }

        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    }

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setIsLoggedIn(false);
        setIsAdmin(false); 
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

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-amber-400 to-emerald-500 p-2.5 rounded-xl shadow-inner">
              <Leaf className="h-6 w-6 text-emerald-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] text-amber-400">
                {t('brand.title')}
              </span>
              <span className="text-[10px] text-emerald-300 uppercase">
                {t('brand.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-2">

            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isActive(link.path)
                    ? 'bg-emerald-800 text-amber-400'
                    : 'hover:bg-emerald-900'
                }`}
              >
                {link.name}
              </Link>
            ))}

                  {/* ✅ ADmin button 👇 */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2 rounded-lg text-sm font-bold bg-amber-500 text-emerald-950 shadow-md hover:bg-amber-400 ${
                        isActive('/admin') ? 'ring-2 ring-amber-300' : ''
                      }`}
                    >
                      View Members
                    </Link>
                  )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">

            {/* Language */}
            <div className="flex bg-emerald-900 p-1 rounded-lg">
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 text-xs ${
                  language === 'ta'
                    ? 'bg-amber-500 text-emerald-950'
                    : 'text-emerald-300'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs ${
                  language === 'en'
                    ? 'bg-amber-500 text-emerald-950'
                    : 'text-emerald-300'
                }`}
              >
                English
              </button>
            </div>

            {/* Auth buttons */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 border border-rose-500 text-rose-400 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                {t('nav.memberLogin')}
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-800">

          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-white"
            >
              {link.name}
            </Link>
          ))}

          {/* ✅ LANGUAGE SWITCHER (MOBILE) */}
<div className="flex items-center justify-between px-4 py-3 border-t border-emerald-800">
  <span className="text-sm text-emerald-300 font-semibold">
    Language / மொழி
  </span>

  <div className="flex space-x-2 bg-emerald-900 p-1 rounded-lg">
    <button
      onClick={() => setLanguage('ta')}
      className={`px-3 py-1 text-xs font-bold rounded ${
        language === 'ta'
          ? 'bg-amber-500 text-emerald-950'
          : 'text-emerald-300'
      }`}
    >
      தமிழ்
    </button>

    <button
      onClick={() => setLanguage('en')}
      className={`px-3 py-1 text-xs font-bold rounded ${
        language === 'en'
          ? 'bg-amber-500 text-emerald-950'
          : 'text-emerald-300'
      }`}
    >
      English
    </button>
  </div>
</div>

          {/* ✅ ADMIN IN MOBILE */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 bg-amber-500 text-emerald-950 font-bold"
            >
              Admin Panel
            </Link>
          )}

          <div className="p-4">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                   handleLogout();}
                }
                
                className="w-full border border-rose-500 text-rose-400 py-2 rounded"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full block text-center bg-emerald-600 py-2 rounded"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}