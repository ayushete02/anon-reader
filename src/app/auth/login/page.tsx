"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/google-auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setStep("password");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Simulate login - replace with your actual login logic
      localStorage.setItem("user", JSON.stringify({ email }));
      router.push("/onboarding");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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

  // Email edit logic for password step
  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 50);
  };
  const handleEmailBlur = () => setIsEditingEmail(false);
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setIsEditingEmail(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#171717]">
      <div className="w-full max-w-sm bg-[#202124] border border-[#23262F] rounded-2xl shadow-lg p-8 flex flex-col items-center transition-all duration-200">
        <p className="text-gray-300 text-base mb-6 text-center">
          Log in to your account with your email or continue with Google.
        </p>

        {error && (
          <div className="mb-4 w-full p-2 bg-red-900/20 border border-red-800 rounded text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {step === "email" && (
          <form
            onSubmit={handleEmailContinue}
            className="w-full flex flex-col gap-4"
          >
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#282828] bg-[#18191a] text-white focus:outline-none focus:ring-2 focus:ring-[#5d5dff] focus:border-transparent text-base transition-all duration-150"
              placeholder="Email address"
              required
              autoFocus
            />
            <button
              type="submit"
              className={`w-full py-2 rounded-lg font-medium text-base transition-all duration-150 ${
                isValidEmail(email)
                  ? "bg-[#232b4a] text-white hover:bg-[#3344ff] cursor-pointer"
                  : "bg-[#23262F] text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isValidEmail(email)}
            >
              Continue with Email
            </button>
            <div className="flex items-center my-2">
              <div className="flex-1 border-t border-[#23262F]" />
              <span className="mx-2 text-xs text-gray-500">or</span>
              <div className="flex-1 border-t border-[#23262F]" />
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2 rounded-lg bg-[#23262F] border border-[#282828] text-white flex items-center justify-center gap-2 text-base hover:bg-[#232323] transition-all duration-150"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
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
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="relative">
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border border-[#282828] bg-[#18191a] text-white text-base pr-10 ${
                  isEditingEmail
                    ? "focus:outline-none focus:ring-2 focus:ring-[#5d5dff] focus:border-transparent"
                    : "pointer-events-none opacity-80"
                }`}
                disabled={!isEditingEmail}
                onBlur={handleEmailBlur}
                onKeyDown={handleEmailKeyDown}
              />
              {!isEditingEmail && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5d5dff] transition-colors"
                  tabIndex={0}
                  aria-label="Edit email"
                  onClick={handleEditEmail}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M13.586 3.586a2 2 0 012.828 2.828l-8.25 8.25a2 2 0 01-.878.513l-3.25.93.93-3.25a2 2 0 01.513-.878l8.25-8.25zm2.121-2.121a4 4 0 00-5.657 0l-8.25 8.25A4 4 0 001 12.414V17a1 1 0 001 1h4.586a4 4 0 002.828-1.172l8.25-8.25a4 4 0 000-5.657z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#282828] bg-[#18191a] text-white focus:outline-none focus:ring-2 focus:ring-[#5d5dff] focus:border-transparent text-base"
              placeholder="Password"
              required
              autoFocus
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-[#5d5dff] transition"
                onClick={() => setStep("email")}
              >
                &larr; Back
              </button>
              <a href="#" className="text-sm text-[#5d5dff] hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#232b4a] text-white rounded-lg font-medium text-base hover:bg-[#3344ff] transition-all duration-150"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-[#5d5dff] hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
