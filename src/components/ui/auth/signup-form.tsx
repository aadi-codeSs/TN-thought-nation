
"use client";

import { useTransition } from "react";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  RegistrationSchema,
  type RegisterInput,
} from "@/src/lib/validation/auth";
import { registerUser } from "@/src/action/register";

import { Input } from "../Input";
import { Label } from "../Label";
import { Button } from "../Button";
import { OAuthButton } from "./oauth-button";

export function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegistrationSchema),

    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: RegisterInput) {
    startTransition(async () => {
      try {
        const response = await registerUser(data);

        if (!response.success) {
          toast.error(response.message);
          return;
        }

        toast.success(response.message);

        reset();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
  <div className="space-y-8">

    <OAuthButton />

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/80" />
      </div>

      <div className="relative flex justify-center">
        <span
          className="
            bg-background
            px-3
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-muted-foreground
          "
        >
          Or continue with
        </span>
      </div>
    </div>


    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
        >
          Username
        </Label>

        <Input
          id="username"
          type="username"
          placeholder="aditya123"
          disabled={isPending}
          error={!!errors.username}
          aria-invalid={!!errors.username}
          aria-describedby="username-error"
          className="
            h-11
            rounded-lg
            border-border
            bg-[#0a0a0a]
            px-4
            text-sm
            text-foreground
            placeholder:text-muted-foreground/60
            transition-all
            duration-200
            focus-visible:border-primary
            focus-visible:ring-2
            focus-visible:ring-primary/20
          "
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

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
        >
          Password
        </Label>

        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isPending}
          error={!!errors.password}
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          className="
            h-11
            rounded-lg
            border-border
            bg-[#0a0a0a]
            px-4
            text-sm
            text-foreground
            placeholder:text-muted-foreground/60
            transition-all
            duration-200
            focus-visible:border-primary
            focus-visible:ring-2
            focus-visible:ring-primary/20
          "
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

      <Button
        type="submit"
        isLoading={isPending}
        className="
          mt-2
          h-11
          w-full
          rounded-lg
          bg-primary
          font-medium
          text-primary-foreground
          transition-all
          duration-200
          hover:opacity-70
          hover:shadow-[0_0_20px_rgba(139,92,246,0.18)]
          hover:cursor-pointer
          active:scale-[0.99]
        "
      >
        Create Account
      </Button>
    </form>
    

    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link
        href="/login"
        className="
          font-medium
          text-foreground
          transition-colors
          duration-200
          text-primary
          hover:text-white
          hover:underline
        "
      >
        Sign in here
      </Link>
    </p>
  </div>
);
}