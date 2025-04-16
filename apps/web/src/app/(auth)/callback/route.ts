import { setAuthErrorCookie } from "@/lib/cookies-helper";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      setAuthErrorCookie({
        errors: { server: [errorMessage] },
        success: false,
      });
      return NextResponse.error();
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
