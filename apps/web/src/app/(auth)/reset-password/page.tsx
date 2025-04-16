import { AuthFormState } from "@/actions/auth";
import { getAuthErrorCookie } from "@/lib/cookies-helper";
import { ResetPasswordRequestForm } from "@/components/reset-password-request-form";

export default async function ResetPasswordPage() {
  // Get error from cookie if it exists
  const errorState: AuthFormState | null = await getAuthErrorCookie();

  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4 rounded-4xl">
      <ResetPasswordRequestForm initialState={errorState || { success: false }} />
    </div>
  );
}
