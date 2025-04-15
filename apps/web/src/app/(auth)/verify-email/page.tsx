import { Button } from "@repo/ui/components/base/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@repo/ui/components/base/card";
import { Heading } from "@repo/ui/components/base/heading";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <section className="flex flex-1 items-center justify-center flex-col gap-4">
      <Card className="p-6 border-non w-full max-w-md">
        <CardTitle>
          <Heading>Check your email</Heading>
        </CardTitle>
        <CardDescription>
          We&apos;ve sent you a verification link. Please check your email and
          click the link to verify your account.
        </CardDescription>

        <CardDescription>
          If you don&apos;t see the email, check your spam folder or{" "}
          <Link href="/signup" className="text-primary hover:underline">
            try signing up again
          </Link>
          .
        </CardDescription>
        <Button className="w-full" asChild>
          <Link href="/login">Back to Login Page</Link>
        </Button>
      </Card>
    </section>
  );
}
