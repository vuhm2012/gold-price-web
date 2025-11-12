import { LoginForm } from '@/components/layout/login-form';

export default function LoginPage() {
  return (
    <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
