"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
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

  const logout = async () => {
    setLoading(true);
    try {
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
