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
import { BaseEntity, ErrorEntity } from "@/data/entities/base-entity";
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
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleOnLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const login = async () => {
      try {
        const response = await apiClient.post<
          BaseEntity<Aut000ResEntity | ErrorEntity>
        >(AUT000, {
          username: username,
          password: password,
        });
        if (response?.result == "OK") {
          const data = response.data as Aut000ResEntity;
          localStorage.setItem(Keys.accessToken, data.access_token);
          localStorage.setItem(Keys.refreshToken, data.refresh_token);
          router.push(Routes.dashboard);
        } else {
          const data = response?.data as ErrorEntity;
          setErrorMessage(`${data.message_id}`);
        }
      } catch (e) {
        setErrorMessage(`${(e as Error).message}`);
      }
    };
    login();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-red-950/30 backdrop-blur-xl rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(234,179,8,0.08)] py-8 px-4">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-3xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider drop-shadow-md">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center text-amber-200/60 mt-1">
            Nhập tài khoản và mật khẩu quản trị của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOnLogin}>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="username" className="text-yellow-300/90 font-bold uppercase tracking-wider text-xs">
                  Tên đăng nhập
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  placeholder="Nhập tên đăng nhập"
                  className="bg-red-950/40 border-yellow-500/20 focus-visible:border-yellow-400 focus-visible:ring-yellow-400/20 text-amber-100 placeholder:text-amber-100/30 rounded-xl px-4 py-3 h-12 mt-1.5 transition-all"
                  onChange={(e) => {
                    setErrorMessage("");
                    setUsername(e.target.value);
                  }}
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-yellow-300/90 font-bold uppercase tracking-wider text-xs">
                    Mật khẩu
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  className="bg-red-950/40 border-yellow-500/20 focus-visible:border-yellow-400 focus-visible:ring-yellow-400/20 text-amber-100 placeholder:text-amber-100/30 rounded-xl px-4 py-3 h-12 mt-1.5 transition-all"
                  onChange={(e) => {
                    setErrorMessage("");
                    setPassword(e.target.value);
                  }}
                />
              </Field>
              {errorMessage && (
                <Field>
                  <p className="text-red-400 bg-red-950/50 border border-red-500/30 p-3 rounded-xl text-center text-sm font-semibold">
                    {errorMessage}
                  </p>
                </Field>
              )}
              <Field className="pt-2">
                <Button className="w-full h-12 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-red-950 font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-0">
                  Đăng nhập
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
