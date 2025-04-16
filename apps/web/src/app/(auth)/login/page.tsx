import { cookies } from "next/headers";
import { LoginForm } from "@/components/login-form";
import { AuthFormState } from "@/actions/auth";
import { AuthErrorAlert } from "@/components/auth-error-alert";

export default async function LoginPage() {
  // Get error from cookie if it exists
  const cookiesStore = await cookies();
  let errorState: AuthFormState | null = null;
  const errorCookie = cookiesStore.get("authError");

  if (errorCookie) {
    try {
      errorState = JSON.parse(errorCookie.value);
      // Delete the cookie after reading it
      cookiesStore.delete("authError");
    } catch (e) {
      console.error("Failed to parse auth error cookie", e);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4 rounded-4xl">
      {errorState && <AuthErrorAlert errors={errorState.errors} />}
      <LoginForm initialState={errorState || { success: false }} />
    </div>
  );
}
