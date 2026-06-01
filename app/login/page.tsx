import { LoginForm } from '@/components/layout/login-form';

export default function LoginPage() {
  return (
    <div className='bg-gradient-to-b from-red-950 via-red-900 to-stone-950 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 text-amber-50 selection:bg-yellow-500 selection:text-red-950'>
      <div className='w-full max-w-md'>
        <LoginForm />
      </div>
    </div>
  );
}
