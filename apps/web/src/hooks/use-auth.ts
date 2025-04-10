"use client";

import { useState } from "react";
import { createPersistentClient, createSessionClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string, stayLogin: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      // Use persistent session if user stay logged in as default behavior
      const supabase = stayLogin ? createPersistentClient() : createSessionClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return false;
      }

      router.push("/dashboard");
      router.refresh();
      return true;
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // For logout, we can use either client since we're just signing out
  const logout = async () => {
    setLoading(true);
    try {
      const supabase = createPersistentClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      setError("Failed to log out");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    loading,
    error,
  };
}
