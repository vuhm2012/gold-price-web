"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import apiClient, { AUT000 } from "@/data/api-client";
import { Aut000ResEntity } from "@/data/entities/aut000-res-entity";
import { BaseEntity } from "@/data/entities/base-entity";
import { Keys } from "@/lib/keys";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleOnLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const login = async () => {
      try {
        const response = await apiClient.post<BaseEntity<Aut000ResEntity>>(
          AUT000,
          {
            username: username,
            password: password,
          }
        );
        if (response?.result == "OK") {
          const data = response.data as Aut000ResEntity;
          localStorage.setItem(Keys.accessToken, data.access_token);
          localStorage.setItem(Keys.refreshToken, data.refresh_token);
          router.push(Routes.home);
        }
      } catch {}
    };
    login();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOnLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  placeholder="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="********"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Field>
              <Field>
                {/* <Button type='submit'>Login</Button> */}
                <Button>Login</Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                {/* <FieldDescription className='text-center'>
                  Don&apos;t have an account? <Link href='#'>Sign up</Link>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
