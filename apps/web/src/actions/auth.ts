"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@repo/schema";
import {
  createPersistentClient,
  createSessionClient,
} from "@/lib/supabase/client";

export type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    server?: string[];
  };
  message?: string;
};

export async function login(prevState: FormState, formData: FormData) {
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
    redirect("/dashboard");
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          email: [],
          password: [],
          stayLogin: [],
          server: [err.message],
        },
        success: false,
      };
    }
    return {
      errors: {
        email: [],
        password: [],
        stayLogin: [],
        server: ["An unexpected error occurred"],
      },
      success: false,
    };
  }
}
