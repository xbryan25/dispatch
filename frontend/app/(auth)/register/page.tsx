import RegisterForm from '@/components/auth/registerForm';
import GuestHeader from '@/components/shared/guestHeader';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] px-5 font-sans sm:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        <GuestHeader />
        <RegisterForm />
      </div>
    </div>
  );
}
