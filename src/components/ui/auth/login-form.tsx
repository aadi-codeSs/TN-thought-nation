"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "next-auth/react";

import { toast } from "sonner";

import { LoginSchema, type LoginInput } from "@/src/lib/validation/auth";

import { Input } from "../Input";
import { Label } from "../Label";
import { Button } from "../Button";
import { OAuthButton } from "../auth/oauth-button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),

    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const error = searchParams.get("error");

    if (!error) return;

    if (error === "OAuthAccountNotLinked") {
      toast.error("Please sign in using your original login method.");

      return;
    }

    toast.error("Authentication failed.");
  }, [searchParams]);

  async function onSubmit(data: LoginInput) {
    try {
      setIsPending(true);

      const result = await signIn("credentials", {
        username: data.username.toLowerCase().trim(),
        password: data.password,
        redirect: false,
      });

      if (!result) {
        toast.error("Something went wrong.");

        return;
      }

      if (result.error) {
        toast.error("Invalid username or password.");

        return;
      }

      toast.success("Welcome back!");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error("Unable to sign in. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="username">Enter your username</Label>

          <Input
            id="username"
            type="username"
            placeholder="aditya123"
            disabled={isPending}
            error={!!errors.username}
            aria-invalid={!!errors.username}
            aria-describedby="username-error"
            {...register("username")}
          />

          {errors.username && (
            <p
              id="username-error"
              className="mt-1 text-xs font-medium text-destructive"
            >
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-muted-foreground text-primary hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            error={!!errors.password}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            {...register("password")}
          />

          {errors.password && (
            <p
              id="password-error"
              className="mt-1 text-xs font-medium text-destructive"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className=" mt-2 w-full " isLoading={isPending}>
          Sign in
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <OAuthButton />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground text-primary hover:text-white hover:underline "
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
