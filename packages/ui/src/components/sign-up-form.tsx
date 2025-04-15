"use client";

import { TerminalWindow } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/base/form";
import { SignupFormValues, signupSchema } from "@repo/schema";
import { Checkbox } from "@repo/ui/components/base/checkbox";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/base/alert";
import { cn } from "@repo/ui/lib";
import { Heading } from "@repo/ui/components/base/heading";
import ErrorAlert from "@repo/ui/components/error-alert";

type SignUpFormProps = {
  formAction: (formData: FormData) => void;
  error: string | null;
  loading: boolean;
  LinkComp?: React.ElementType;
} & React.ComponentProps<"div">;

export default function SignUpForm({
  formAction,
  error,
  loading,
  LinkComp = (props) => <a {...props} />,
  className,
  ...props
}: SignUpFormProps) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    formAction(formData);
  };

  return (
    <Card className={cn(`w-full max-w-md border-none`, className)} {...props}>
      <CardHeader>
        <CardTitle>
          <Heading>Create an Account</Heading>
        </CardTitle>
        <CardDescription>Sign up to access the smart dashboard</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <ErrorAlert error={error} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <LinkComp
                href="/login"
                className="text-primary hover:underline font-bold">
                Login
              </LinkComp>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export { SignUpForm };
