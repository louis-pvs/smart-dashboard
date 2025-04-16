"use server";

import { redirect } from "next/navigation";
import {
  loginSchema,
  resetPasswordConfirmSchema,
  resetPasswordRequestSchema,
  signupSchema,
} from "@repo/schema";
import { z } from "zod";
import { setAuthErrorCookie } from "@/lib/cookies-helper";
import { cookies } from "next/headers";
import {
  createAdminClient,
  createServerClient
} from "@/lib/appwrite/server";

// Define the session cookie name
const SESSION_COOKIE = "appwrite_session";

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    token?: string[];
    stayLogin?: string[];
    server?: string[];
  };
  success: boolean;
};

/**
 * Handles form validation and returns formatted errors
 */
function validateForm<T extends z.ZodType>(
  schema: T,
  data: Record<string, unknown>
):
  | { success: true; data: z.infer<T> }
  | { success: false; errors: AuthFormState["errors"] } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: { ...result.error.flatten().fieldErrors, server: [] },
    };
  }

  return { success: true, data: result.data };
}

export async function login(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  let redirectPath;
  // Extract and validate form data
  const formValues = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    stayLogin: formData.get("stayLogin") === "true",
  };

  const validation = validateForm(loginSchema, formValues);
  if (!validation.success) {
    // For client-side validation errors, return directly
    return { errors: validation.errors, success: false };
  }

  try {
    // Create Appwrite client
    const cookiesStore = await cookies();
    const { account } = await createServerClient();

    // Create email session
    const session = await account.createEmailPasswordSession(
      validation.data.email,
      validation.data.password
    );

    // Set the session cookie with appropriate options
    cookiesStore.set(SESSION_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      // Set expiration based on stayLogin preference
      maxAge: validation.data.stayLogin ? 30 * 24 * 60 * 60 : undefined, // 30 days or session
    });

    // Redirect on success - this will terminate the function
    redirectPath = "/overview";
  } catch (err) {
    const errorState = {
      errors: {
        ...prevState.errors,
        server: [err instanceof Error ? err.message : "Authentication failed"],
      },
      success: false,
    };

    // Store error in cookie before redirect
    await setAuthErrorCookie(errorState);

    // Redirect back to login page
    redirectPath = "/login";
    return errorState;
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
  return prevState;
}

export async function signup(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  let redirectPath;
  // Extract and validate form data
  const formValues = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validation = validateForm(signupSchema, formValues);
  if (!validation.success) {
    return { errors: validation.errors, success: false };
  }

  const { name, email, password } = validation.data;

  try {
    const cookiesStore = await cookies();
    // Create admin client for user creation
    const { account, databases } = createAdminClient();

    // Create user account
    const user = await account.create(
      'unique()', // Generate unique ID
      email,
      password,
      name
    );

    if (!user) throw new Error("Failed to create user account");

    // Create email verification
    await account.createVerification(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify`
    );

    // Create user profile in database
    await databases.createDocument(
      'smartDashboard',
      'users',
      user.$id,
      {
        name,
        email,
        role: "DEVELOPER", // Default role
        skills: [],
      }
    );

    // Create session for the new user
    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie
    cookiesStore.set(SESSION_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Check if email verification is required
    if (process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true") {
      redirectPath = "/verify-email";
    } else {
      // Redirect to overview
      redirectPath = "/overview";
    }
  } catch (err) {
    const errorState = {
      errors: {
        ...prevState.errors,
        server: [err instanceof Error ? err.message : "Signup failed"],
      },
      success: false,
    };

    // Store error in cookie before redirect
    await setAuthErrorCookie(errorState);

    // Redirect back to signup page
    redirectPath = "/signup";
  } finally {
    if (redirectPath) redirect(redirectPath);
  }

  return prevState;
}

/**
 * Request a password reset email
 */
export async function requestPasswordReset(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  let redirectPath;

  // Extract and validate form data
  const formValues = {
    email: formData.get("email") as string,
  };

  const validation = validateForm(resetPasswordRequestSchema, formValues);
  if (!validation.success) {
    return { errors: validation.errors, success: false };
  }

  try {
    const { account } = await createServerClient();

    // Request password reset email
    await account.createRecovery(
      validation.data.email,
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/confirm`
    );

    // Return success state without redirecting
    // This allows the UI to show a success message
    return {
      success: true,
    };
  } catch (err) {
    const errorState = {
      errors: {
        ...prevState.errors,
        server: [err instanceof Error ? err.message : "Reset password failed"],
      },
      success: false,
    };

    // Store error in cookie before redirect
    await setAuthErrorCookie(errorState);

    redirectPath = "/reset-password";
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
  return prevState;
}

/**
 * Confirm password reset with new password
 */
export async function confirmPasswordReset(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  let redirectPath;
  // Extract and validate form data
  const formValues = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    userId: formData.get("userId") as string,
    secret: formData.get("secret") as string,
  };

  const validation = validateForm(
    resetPasswordConfirmSchema.innerType().extend({
      userId: z.string(),
      secret: z.string(),
    }),
    formValues
  );

  if (!validation.success) {
    return { errors: validation.errors, success: false };
  }

  try {
    const { account } = await createServerClient();

    // Complete the recovery process
    await account.updateRecovery(
      validation.data.userId,
      validation.data.secret,
      validation.data.password,
    );

    // Return success state before redirecting
    const result = {
      success: true,
    };

    // Redirect to login page after successful password reset
    redirectPath = "/login?reset=success";

    return result;
  } catch (err) {
    const errorState = {
      errors: {
        ...prevState.errors,
        server: [err instanceof Error ? err.message : "Reset password failed"],
      },
      success: false,
    };
    // Store error in cookie before redirect
    await setAuthErrorCookie(errorState);

    redirectPath = "/reset-password";
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
  return prevState;
}

/**
 * Verify email address
 */
export async function verifyEmail(
  userId: string,
  secret: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { account } = await createServerClient();

    // Complete the verification process
    await account.updateVerification(userId, secret);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Email verification failed"
    };
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  try {
    const cookiesStore = await cookies();
    const { account } = await createServerClient();

    // Delete the current session
    await account.deleteSession('current');

    // Clear the session cookie
    cookiesStore.delete(SESSION_COOKIE);
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Redirect to login page regardless of success/failure
  redirect('/login');
}

/**
 * Check if a user is authenticated
 */
export async function checkAuth(): Promise<{
  authenticated: boolean;
  userId?: string;
}> {
  try {
    const { account } = await createServerClient();

    // Get the current user
    const user = await account.get();

    return {
      authenticated: true,
      userId: user.$id
    };
  } catch (error) {
    return { authenticated: false };
  }
}
