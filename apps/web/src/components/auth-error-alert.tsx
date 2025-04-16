"use client";

import { useEffect } from "react";
import { AuthFormState } from "@/actions/auth";

interface AuthErrorAlertProps {
  errors?: AuthFormState["errors"];
}

export function AuthErrorAlert({ errors }: AuthErrorAlertProps) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const alert = document.getElementById("auth-error-alert");
      if (alert) {
        alert.classList.add("fade-out");
        setTimeout(() => {
          alert.style.display = "none";
        }, 300);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // No errors to display
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  // Format all errors into a flat array
  const allErrors = Object.values(errors).filter(Boolean).flat();

  if (allErrors.length === 0) {
    return null;
  }

  return (
    <div
      id="auth-error-alert"
      className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
      role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-700">
            Authentication Error
          </h3>
          <div className="mt-2 text-sm text-red-600">
            <ul className="list-disc pl-5 space-y-1">
              {allErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
