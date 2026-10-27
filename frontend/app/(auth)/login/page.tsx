import LoginForm from '@/components/auth/loginForm';
import GuestHeader from '@/components/shared/guestHeader';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] font-sans px-5 sm:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col ">
        <GuestHeader />
        <LoginForm />
      </div>
    </div>
  );
}
