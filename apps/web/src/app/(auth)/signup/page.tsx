"use client";

import { SignUpForm } from "@repo/ui/components/sign-up-form";
import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/actions/auth";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, {
    errors: { server: [], name: [], email: [], password: [], confirmPassword: [] },
    success: false,
  });

  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4 rounded-4xl">
      <SignUpForm
        formAction={formAction}
        LinkComp={Link}
        loading={isPending}
        error={state.errors?.server![0] ?? null}
      />
    </div>
  );
}
