"use server";
import { AuthFormState } from "@/actions/auth";
import { cookies } from "next/headers";

export async function setSecureCookie(name: string, value: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600, // 1 hour
      path: "/",
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to set cookie:", error);
    return { success: false, error: "Failed to set cookie" };
  }
}

const AUTH_COOKIE = "auth-error";
export async function setAuthErrorCookie(
  errorState: AuthFormState
): Promise<void> {
  await setSecureCookie(AUTH_COOKIE, JSON.stringify(errorState));
}
export async function getAuthErrorCookie(): Promise<AuthFormState | null> {
  let errorState: AuthFormState | null = null;
  try {
    const cookieStore = await cookies();
    const errorCookie = await cookieStore.get(AUTH_COOKIE);
    if (errorCookie) {
      errorState = JSON.parse(errorCookie.value);
    }
  } catch (e) {
    console.error("Failed to parse auth error cookie", e);
  }
  return errorState;
}
export async function deleteAuthErrorCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
  } catch (e) {
    console.error("Failed to delete auth error cookie", e);
  }
}
