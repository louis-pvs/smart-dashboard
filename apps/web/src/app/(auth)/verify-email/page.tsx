import { Button } from "@repo/ui/components/base/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <section className="flex flex-1 items-center justify-center flex-col gap-4">
      <div className="rounded-4xl bg-card text-card-foreground w-full max-w-md space-y-8 text-center p-6">
        <h1 className="text-3xl font-bold">Check Your Email</h1>
        <p className="text-gray-600">
          We&apos;ve sent you a verification link. Please check your email and
          click the link to verify your account.
        </p>
        <p className="text-sm text-gray-500">
          If you don&apos;t see the email, check your spam folder.
        </p>
        <Button className="w-full" asChild>
          <Link href="/login">
            Back to Login Page
          </Link>
        </Button>
      </div>
    </section>
  );
}
