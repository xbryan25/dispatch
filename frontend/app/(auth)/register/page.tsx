import GuestHeader from '@/components/shared/guestHeader';
import RegisterForm from '@/components/auth/registerForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans p-10">
      <GuestHeader />
      <RegisterForm />
    </div>
  );
}
