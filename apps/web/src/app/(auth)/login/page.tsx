"use client";

import { LoginForm } from "@repo/ui/components/login-form";
import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, {
    errors: { server: [], email: [], password: [], stayLogin: [] },
    success: false,
  });

  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4 bg-card rounded-4xl">
      <LoginForm
        formAction={formAction}
        LinkComp={Link}
        loading={isPending}
        error={state.errors?.server[0] ?? null}
      />
    </div>
  );
}
