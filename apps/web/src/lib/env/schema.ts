import { z } from "zod";

// Client-side environment variables schema
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: "Invalid Supabase URL format",
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: "Supabase anon key is required",
  }),
});

// Server-side environment variables schema
export const serverEnvSchema = z.object({
  // Add any server-only env vars here
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, {
    message: "Supabase service role key is required",
  }),
});

// Combined schema for full environment validation
export const envSchema = clientEnvSchema.merge(serverEnvSchema);

// Type inference
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type Env = z.infer<typeof envSchema>;
