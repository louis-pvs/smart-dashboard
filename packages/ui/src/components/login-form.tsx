"use client";

import { TerminalWindow } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { LoginFormValues, loginSchema } from "@repo/ui/schemas/auth-schema";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";

type LoginFormProps = {
  handleSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
  LinkComp?: React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
} & React.ComponentProps<"div">;

export default function LoginForm({
  handleSubmit,
  error,
  loading,
  LinkComp = (props) => <a {...props} />,
  ...props
}: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      stayLogin: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await handleSubmit(data.email, data.password);
  };

  return (
    <div {...props}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <ErrorAlert error={error} />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <div className="space-y-1 leading-none">
                        <FormLabel>Keep me logged in</FormLabel>
                        <FormDescription>
                          Not recommended for public devices
                        </FormDescription>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-sm text-center">
                Don&apos;t have an account?{" "}
                <LinkComp
                  href="/signup"
                  className="text-blue-600 hover:underline">
                  Sign up
                </LinkComp>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

function ErrorAlert({ error }: { error: null | string }) {
  if (!error) return null;
  return (
    <Alert>
      <TerminalWindow className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
