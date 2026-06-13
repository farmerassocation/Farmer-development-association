import RegistrationForm from '@/components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 md:py-24 flex items-center justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <RegistrationForm />
      </div>
    </div>
  );
}
