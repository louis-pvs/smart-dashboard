import { SignUpForm } from "@/components/sign-up-form";
import { AuthFormState } from "@/actions/auth";
import { getAuthErrorCookie } from "@/lib/cookies-helper";

export default async function SignupPage() {
  const errorState: AuthFormState | null = await getAuthErrorCookie();

  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4 rounded-4xl">
      <SignUpForm initialState={errorState || { success: false }} />
    </div>
  );
}
