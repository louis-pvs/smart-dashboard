// apps/web/src/lib/env/server.ts
import { serverEnvSchema } from './schema';

// For server-side usage
function getServerEnv() {
  // This should only be used in server components or API routes
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "❌ Invalid server environment variables:",
      result.error.format()
    );
    throw new Error("Invalid server environment variables");
  }

  return result.data;
}

// We don't export this directly to prevent accidental client-side imports
// It will be used within server-side utilities
export const serverEnv = getServerEnv();
