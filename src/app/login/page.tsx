import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 md:py-24 flex items-center justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center text-slate-400 text-sm">Loading form...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-xs text-amber-400 mt-2">
  PIN மறந்துவிட்டீர்களா? நிர்வாகியை தொடர்பு கொள்ளவும்.
</p>

<p className="text-xs text-emerald-300">
  Forgot PIN? Please contact administration.
</p>
      </div>
    </div>
  );
}
