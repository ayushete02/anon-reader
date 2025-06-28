"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/google-auth";
import AuthLayout from "@/components/ui/AuthLayout";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"name" | "email" | "password" | "confirm">(
    "name"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on step change
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 50);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === "name" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (step === "email" && !isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (step === "password" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (step === "confirm" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (step === "name") {
      setStep("email");
      focusInput();
    } else if (step === "email") {
      setStep("password");
      focusInput();
    } else if (step === "password") {
      setStep("confirm");
      focusInput();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
        setError("Google sign-up failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during Google sign-up");
      console.error("Google sign-up error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    setError("");
    if (step === "email") setStep("name");
    else if (step === "password") setStep("email");
    else if (step === "confirm") setStep("password");
    focusInput();
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-white mb-2 text-center font-display">
        Create your account
      </h1>
      <p className="text-white/80 text-base mb-6 text-center">
        Sign up with your details or continue with Google.
      </p>

      {error && (
        <div className="mb-4 w-full p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      {step === "name" && (
        <form onSubmit={handleContinue} className="w-full flex flex-col gap-4">
          <input
            ref={inputRef}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-base backdrop-blur-sm"
            placeholder="Full Name"
            required
            autoFocus
          />
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-medium text-base transition-all duration-150 backdrop-blur-sm ${
              name.trim()
                ? "bg-primary/20 border border-primary/30 text-white hover:bg-primary/30 hover:border-primary/50 cursor-pointer"
                : "bg-white/5 border border-white/5 text-white/50 cursor-not-allowed"
            }`}
            disabled={!name.trim()}
          >
            Continue
          </button>
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-white/5" />
            <span className="mx-2 text-xs text-white/40">or</span>
            <div className="flex-1 border-t border-white/5" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center gap-2 text-base hover:bg-white/10 hover:border-white/20 transition-all duration-150 backdrop-blur-sm"
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
            {isGoogleLoading ? "Signing up..." : "Continue with Google"}
          </button>
        </form>
      )}

      {step === "email" && (
        <form onSubmit={handleContinue} className="w-full flex flex-col gap-4">
          <input
            ref={inputRef}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-base backdrop-blur-sm"
            placeholder="Email address"
            required
            autoFocus
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="text-sm text-white/60 hover:text-primary transition"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="submit"
              className={`px-8 py-3 rounded-xl font-medium text-base transition-all duration-150 backdrop-blur-sm ${
                isValidEmail(email)
                  ? "bg-primary/20 border border-primary/30 text-white hover:bg-primary/30 hover:border-primary/50"
                  : "bg-white/5 border border-white/5 text-white/50 cursor-not-allowed"
              }`}
              disabled={!isValidEmail(email)}
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleContinue} className="w-full flex flex-col gap-4">
          <input
            ref={inputRef}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-base backdrop-blur-sm"
            placeholder="Password"
            required
            autoFocus
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="text-sm text-white/60 hover:text-primary transition"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="submit"
              className={`px-8 py-3 rounded-xl font-medium text-base transition-all duration-150 backdrop-blur-sm ${
                password.length >= 6
                  ? "bg-primary/20 border border-primary/30 text-white hover:bg-primary/30 hover:border-primary/50"
                  : "bg-white/5 border border-white/5 text-white/50 cursor-not-allowed"
              }`}
              disabled={password.length < 6}
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {step === "confirm" && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            ref={inputRef}
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-base backdrop-blur-sm"
            placeholder="Confirm Password"
            required
            autoFocus
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="text-sm text-white/60 hover:text-primary transition"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword}
              className={`px-8 py-3 rounded-xl font-medium text-base transition-all duration-150 backdrop-blur-sm ${
                password === confirmPassword
                  ? "bg-primary/20 border border-primary/30 text-white hover:bg-primary/30 hover:border-primary/50"
                  : "bg-white/5 border border-white/5 text-white/50 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-sm text-white/40">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}
