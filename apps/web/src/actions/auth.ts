"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { loginSchema, signupSchema } from "@repo/schema";
import {
  createPersistentClient,
  createSessionClient,
} from "@/lib/supabase/client";
import { z } from "zod";

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
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

/**
 * Sets auth error in a cookie for retrieval after redirect
 */
async function setAuthErrorCookie(errorState: AuthFormState): Promise<void> {
  const cookiesStore = await cookies();
  cookiesStore.set('authError', JSON.stringify(errorState), {
    maxAge: 30, // Short-lived cookie
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

export async function login(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
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
    // Select client based on persistence preference
    const supabase = validation.data.stayLogin
      ? createPersistentClient()
      : createSessionClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (error) throw new Error(error.message);

    // Redirect on success - this will terminate the function
    redirect("/overview");
  } catch (err) {
    const errorState = {
      errors: {
        ...prevState.errors,
        server: [err instanceof Error ? err.message : "Authentication failed"]
      },
      success: false
    };

    // Store error in cookie before redirect
    setAuthErrorCookie(errorState);

    // Redirect back to login page
    redirect("/login");
  }
}

export async function signup(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
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
  const supabase = createPersistentClient();

  try {
    // Transaction-like pattern for signup flow
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Failed to create user account");

    // Email verification flow
    if (!authData.user.confirmed_at) {
      redirect("/verify-email");
    }

    // Create user profile
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      name,
      email,
      role: "DEVELOPER", // Default role
    });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      throw new Error("Failed to create user profile");
    }

    // Redirect to overview - this will terminate the function
    redirect("/overview");
  } catch (err) {
    const errorState = {
      errors: {
        ...prevState.errors,
        server: [err instanceof Error ? err.message : "Signup failed"]
      },
      success: false
    };

    // Store error in cookie before redirect
    setAuthErrorCookie(errorState);

    // Redirect back to signup page
    redirect("/signup");
  }
}
