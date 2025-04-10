"use client";

import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(email, password);
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
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <LinkComp href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </LinkComp>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
