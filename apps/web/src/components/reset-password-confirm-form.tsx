"use client";

import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "@phosphor-icons/react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { cn } from "@repo/ui/lib";
import { Heading } from "@repo/ui/components/heading";
import ErrorAlert from "@/components/error-alert";
import { AuthFormState, confirmPasswordReset } from "@/actions/auth";
import { resetPasswordConfirmFormValues, resetPasswordConfirmSchema } from "@repo/schema";

interface ResetPasswordConfirmFormProps {
  initialState?: AuthFormState;
  token: string;
}

export default function ResetPasswordConfirmForm({
  initialState = { success: false },
  token,
}: ResetPasswordConfirmFormProps) {
  const [state, formAction, isPending] = useActionState(
    confirmPasswordReset,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(state.success);

  const form = useForm<resetPasswordConfirmFormValues>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token,
    },
  });

  const onSubmit = async (data: resetPasswordConfirmFormValues) => {
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("token", data.token);

    // Call the formAction with the FormData
    startTransition(() => {
      formAction(formData)
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (resetComplete) {
    return (
      <Card className={cn(`w-full max-w-md border-none`)}>
        <CardHeader>
          <CardTitle>
            <Heading>Password Reset Complete</Heading>
          </CardTitle>
          <CardDescription>
            Your password has been successfully reset. You can now log in with
            your new password.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn(`w-full max-w-md border-none`)}>
      <CardHeader>
        <CardTitle>
          <Heading>Set New Password</Heading>
        </CardTitle>
        <CardDescription>
          Create a new password for your account
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <ErrorAlert
              title="Reset Password Error"
              error={state.errors?.server![0] ?? null}
            />
            <input type="hidden" {...form.register("token")} />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pr-10"
                        autoFocus
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}>
                        {showPassword ? (
                          <EyeClosed className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Password must be at least 8 characters and include
                    uppercase, lowercase, number, and special character
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={toggleConfirmPasswordVisibility}
                        tabIndex={-1}>
                        {showConfirmPassword ? (
                          <EyeClosed className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Resetting Password..." : "Reset Password"}
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

export { ResetPasswordConfirmForm };
