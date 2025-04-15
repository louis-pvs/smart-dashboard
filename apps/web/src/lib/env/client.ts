import { clientEnvSchema } from "./schema";

// For client-side usage
function getClientEnv() {
  // In Next.js, we need to explicitly reference the env vars
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const result = clientEnvSchema.safeParse(env);

  if (!result.success) {
    console.error(
      "❌ Invalid client environment variables:",
      result.error.format()
    );
    throw new Error("Invalid client environment variables");
  }

  return result.data;
}

export const clientEnv = getClientEnv();
