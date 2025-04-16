"use client";

import { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { LoginFormValues, loginSchema } from "@repo/schema";
import { Checkbox } from "@repo/ui/components/checkbox";
import { cn } from "@repo/ui/lib";
import { Heading } from "@repo/ui/components/heading";
import ErrorAlert from "@/components/error-alert";
import { AuthFormState, login } from "@/actions/auth";
import Link from "next/link";
import { useFormState } from "react-dom";

interface LoginFormProps {
  initialState?: AuthFormState;
}

export default function LoginForm({
  initialState = { success: false },
}: LoginFormProps) {
  const [state, formAction, isPending] = useFormState(login, initialState);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      stayLogin: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Create FormData object for the server action
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("stayLogin", data.stayLogin!.toString());

    // Call the formAction with the FormData\
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card className={cn(`w-full max-w-md border-none`)}>
      <CardHeader>
        <CardTitle>
          <Heading>Login</Heading>
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <ErrorAlert error={state.errors?.server![0] ?? null} />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="username"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stayLogin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Keep me logged in</FormLabel>
                    <FormDescription>
                      Not recommended for public devices
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline font-bold">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export { LoginForm };
