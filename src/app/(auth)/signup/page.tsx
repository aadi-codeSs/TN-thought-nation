import { SignupForm } from "@/src/components/ui/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl p-6 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-left">
            Save ideas, insights in one place
          </h1>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-left ">
            with TN
          </h1>
          {/* <p className="text-sm text-muted-foreground">
            Continue to Thought Nation
          </p> */}
        </div>
        <SignupForm />
      </div>
    </main>
  );
}
