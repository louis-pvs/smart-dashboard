"use client";

import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { z } from "zod";
import { cn } from "@repo/ui/lib";
import { Heading } from "@repo/ui/components/heading";
import ErrorAlert from "@/components/error-alert";
import { AuthFormState, requestPasswordReset } from "@/actions/auth";

// Define the schema for password reset request
const resetPasswordRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetPasswordRequestValues = z.infer<typeof resetPasswordRequestSchema>;

interface ResetPasswordRequestFormProps {
  initialState?: AuthFormState;
}

export default function ResetPasswordRequestForm({
  initialState = { success: false },
}: ResetPasswordRequestFormProps) {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );
  const [emailSent, setEmailSent] = useState(state.success);

  const form = useForm<ResetPasswordRequestValues>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordRequestValues) => {
    const formData = new FormData();
    formData.append("email", data.email);

    // Call the formAction with the FormData
    startTransition(() => {
      formAction(formData);
    });
  };

  if (emailSent) {
    return (
      <Card className={cn(`w-full max-w-md border-none`)}>
        <CardHeader>
          <CardTitle>
            <Heading>Check Your Email</Heading>
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a password reset link to your email address. Please check
            your inbox and follow the instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you don&apos;t receive an email within a few minutes, please check
            your spam folder or try again.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEmailSent(false)}>
            Try Again
          </Button>
          <div className="text-sm text-center">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-bold">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn(`w-full max-w-md border-none`)}>
      <CardHeader>
        <CardTitle>
          <Heading>Reset Password</Heading>
        </CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <ErrorAlert
              title="Reset Password Error"
              error={state.errors?.server![0] ?? null}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="your.email@example.com"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-sm text-center">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-bold">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export { ResetPasswordRequestForm };
