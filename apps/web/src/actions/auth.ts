"use server";

import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@repo/schema";
import {
  createPersistentClient,
  createSessionClient,
} from "@/lib/supabase/client";

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

export async function login(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  let redirectPath;

  // Extract form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const stayLogin = formData.get("stayLogin") === "true";

  // Validate with Zod
  const validatedFields = loginSchema.safeParse({
    email,
    password,
    stayLogin,
  });

  if (!validatedFields.success) {
    return {
      errors: { ...validatedFields.error.flatten().fieldErrors, server: [] },
      success: false,
    };
  }

  try {
    // Use persistent session if user wants to stay logged in
    const supabase = stayLogin
      ? createPersistentClient()
      : createSessionClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    // Redirect on success
    redirectPath = "/overview";
  } catch (err) {
    if (err instanceof Error) {
      return {
        ...prevState,
        errors: {
          ...prevState.errors,
          server: [err.message],
        },
        success: false,
      };
    }
    return {
      ...prevState,
      errors: {
        ...prevState.errors,
        server: ["An unexpected error occurred"],
      },
      success: false,
    };
  } finally {
    if (redirectPath) redirect(redirectPath);
    return {
      ...prevState,
      success: true,
    }
  }
}

export async function signup(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  let redirectPath;

  // Extract form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate with Zod
  const validatedFields = signupSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: { ...validatedFields.error.flatten().fieldErrors, server: [] },
      success: false,
    };
  }

  try {
    const supabase = createPersistentClient();

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) throw new Error(authError.message);

    // Check if email confirmation is required
    if (authData.user && !authData.user.confirmed_at) {
      redirectPath = "/verify-email";
    }

    // If no email confirmation is required, create a user profile
    if (authData.user) {
      // Create user profile in the profiles table
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        name: name,
        email: email,
        role: "DEVELOPER", // Default role
      });

      if (profileError) {
        // We still continue as the auth user was created successfully
        redirectPath = "/overview";
        throw new Error("Error creating user profile,", profileError);
      }
    }
    throw new Error("Error creating user profile, unable to locate user's profile");
  } catch (err) {
    if (err instanceof Error) {
      return {
        ...prevState,
        errors: {
          ...prevState.errors,
          server: [err.message],
        },
        success: false,
      };
    }
    return {
      ...prevState,
      errors: {
        ...prevState.errors,
        server: ["An unexpected error occurred"],
      },
      success: false,
    };
  } finally {
    if (redirectPath) redirect (redirectPath);
    return {
      ...prevState,
      success: true,
    }
  }
}
