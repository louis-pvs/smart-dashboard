import { cookies } from "next/headers";
import { SignUpForm } from "@/components/sign-up-form";
import { AuthErrorAlert } from "@/components/auth-error-alert";
import { AuthFormState } from "@/actions/auth";

export default async function SignupPage() {
  const cookiesStore = await cookies();

  // Get error from cookie if it exists
  let errorState: AuthFormState | null = null;
  const errorCookie = cookies().get("authError");

  if (errorCookie) {
    try {
      errorState = JSON.parse(errorCookie.value);
      // Delete the cookie after reading it
      cookies().delete("authError");
    } catch (e) {
      console.error("Failed to parse auth error cookie", e);
    }
  }
  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4 rounded-4xl">
      {errorState && <AuthErrorAlert errors={errorState.errors} />}
      <SignUpForm initialState={errorState || { success: false }} />
    </div>
  );
}
