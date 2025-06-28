"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/google-auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      localStorage.setItem("user", JSON.stringify({ name, email }));
      router.push("/onboarding");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.push("/home");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during Google sign-in");
      console.error("Google sign-in error:", err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#181A20] flex items-center justify-center relative">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
      </div>
      <div className="w-full max-w-md bg-[#23262F] border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center z-10">
        {/* Logo */}
        <div className="mb-6">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#6366f1" />
              <text
                x="12"
                y="17"
                textAnchor="middle"
                fontSize="12"
                fill="#fff"
                fontWeight="bold"
              >
                AR
              </text>
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-semibold text-white mb-1">
          Create your account
        </h1>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Join Anon Reader to discover personalized stories.
        </p>

        {error && (
          <div className="mb-4 w-full p-2 bg-red-900/20 border border-red-800 rounded text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-white/70 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-white/10 bg-[#23262F] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-white/70 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border border-white/10 bg-[#23262F] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-white/70 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-white/10 bg-[#23262F] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-white/70 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-white/10 bg-[#23262F] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary border-white/10 rounded bg-[#23262F]"
              required
            />
            <label htmlFor="terms" className="ml-2 text-xs text-white/60">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded font-medium hover:bg-primary/90 transition-all duration-200 text-sm flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-white/60">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>

        <div className="w-full mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#23262F] text-white/40">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2 border border-white/10 rounded bg-[#23262F] text-white/80 hover:bg-[#23262F]/80 text-xs flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isGoogleLoading ? (
                <svg
                  className="animate-spin h-4 w-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </button>
            <button
              type="button"
              className="w-full py-2 border border-white/10 rounded bg-[#23262F] text-white/80 hover:bg-[#23262F]/80 text-xs flex items-center justify-center gap-2 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.22.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
