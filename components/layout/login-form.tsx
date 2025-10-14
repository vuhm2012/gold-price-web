'use client';
import { loginWithFirebase } from '@/app/login/login-controller';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

const LoginForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [result, setResult] = useState<string>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await loginWithFirebase(email, password);
      setResult(JSON.stringify(result));
    } catch (e) {
      setError(`Error: ${e}`);
      // if (e instanceof FirebaseError) {
      //   if (e.code == 'auth/invalid-credential') {
      //     setError('Wrong email or password!');
      //   } else {
      //     setError(e.message);
      //   }
      // } else if (e instanceof Error) {
      //   setError(e.message);
      // } else {
      //   setError(`Unknown error: ${e}`);
      // }
    }
  };

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-xs'>
            Local storage: {localStorage.getItem('access_token')}
          </p>
          <p className='text-xs'>Result: {result}</p>
          {error && (
            <p className='text-xs mb-6 p-4 border-red-500 rounded-sm border-1 bg-red-200 text-red-500'>
              Error: {error}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='email@example.com'
                  onChange={(input) => {
                    setError('');
                    setEmail(input.target.value);
                  }}
                />
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  {/* <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='********'
                  onChange={(input) => {
                    setError('');
                    setPassword(input.target.value);
                  }}
                />
              </Field>
              <Field>
                {/* <Button type='submit'>Login</Button> */}
                <Button>Login</Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <Link href='#'>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
