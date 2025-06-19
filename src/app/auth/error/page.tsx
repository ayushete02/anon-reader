"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const errorType = searchParams.get("error");

    switch (errorType) {
      case "Configuration":
        setError("There was a problem with the server configuration.");
        break;
      case "AccessDenied":
        setError("You do not have permission to sign in.");
        break;
      case "Verification":
        setError("The sign in link is no longer valid.");
        break;
      default:
        setError("An error occurred during authentication.");
    }
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-black to-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black bg-opacity-50 p-8 rounded-lg border border-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Return to Home
            </button>

            <button
              onClick={() => router.back()}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-black to-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black bg-opacity-50 p-8 rounded-lg border border-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
}
