"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useTransientError() {
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    const errorParam = params.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      window.history.replaceState(null, "", pathname);
    }
  }, [params, pathname]);

  return [error, setError] as const;
}
