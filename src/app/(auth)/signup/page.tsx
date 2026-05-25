import { SignupForm } from "@/src/components/ui/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign In
          </h1>
          <p className="text-sm text-muted-foreground">
            Continue to Thought Nation
          </p>
        </div>
        <SignupForm />
      </div>
    </main>
  );
}
