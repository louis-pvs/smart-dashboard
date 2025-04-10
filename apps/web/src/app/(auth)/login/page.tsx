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
    <main className="flex min-h-screen items-center justify-center p-4 relative w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">
      <LoginForm
        formAction={formAction}
        LinkComp={Link}
        loading={isPending}
        error={state.errors?.server[0] ?? null}
      />
    </main>
  );
}
