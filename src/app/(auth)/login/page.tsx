import { LoginForm } from "@/src/components/ui/auth/login-form";
import Link from "next/link";
export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 flex flex-col gap-8">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign in to ThoughtNation
          </h1>
          {/* <p className="text-sm text-muted-foreground">
            Enter your details below to activate your system access.
          </p> */}
        </div>
        <LoginForm/>
      </div>
      <div className="max-w-xs items-center justify-center ">
        <p className="text-center text-sm text-muted-foreground text-left">
          By continuing, I agree to ThoughtNation's{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            terms
          </Link>
          ,{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            privacy policy
          </Link>
          , and{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            cookie policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
