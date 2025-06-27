"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import { getUserFromLocalStorage } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Check if user is already logged in on component mount

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) {
      // Check if user has completed persona onboarding
      const savedPersona = localStorage.getItem("userPersona");
      if (savedPersona) {
        try {
          const persona = JSON.parse(savedPersona);
          if (persona.personaType) {
            // User has completed persona - redirect to browse
            router.push("/browse");
            return;
          } else {
            // User has incomplete persona - redirect to onboarding
            router.push("/onboarding");
            return;
          }
        } catch (error) {
          console.error("Error parsing user persona:", error);
          // If persona data is corrupted, redirect to onboarding
          router.push("/onboarding");
          return;
        }
      } else {
        // No persona found - redirect to onboarding
        router.push("/onboarding");
        return;
      }
    }
    // If no user, stay on landing page
    setIsCheckingAuth(false);
  }, [router]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary mx-auto mb-4"></div>
          </div>
          <p className="text-secondary dark:text-white text-lg font-medium">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-stretch bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-highlight/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
      </div>

      {/* Left: Hero Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 z-10">
        <div className="w-full max-w-xl">
          <div className="mb-6">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Discover Stories
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-secondary dark:text-white leading-tight mb-6">
            Your personalized reading journey starts here
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg">
            Discover stories that match your unique taste. Every panel, every
            frame, tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              className="px-8 py-3 rounded-xl bg-primary text-white text-lg font-medium shadow-soft hover:shadow-hover hover:bg-primary/90 transition-all duration-300"
              onClick={() => router.push("/onboarding")}
            >
              Get Started
            </button>
            <button
              className="px-8 py-3 rounded-xl bg-white dark:bg-gray-800 text-secondary dark:text-white text-lg font-medium shadow-soft hover:shadow-hover transition-all duration-300"
              onClick={() => setShowLoginForm(true)}
            >
              Sign In
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Join thousands of readers finding their perfect stories
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 z-10">
        {showLoginForm ? (
          <LoginForm />
        ) : (
          <div className="w-full max-w-md aspect-square rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-lg p-8 flex items-center justify-center shadow-soft">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-secondary dark:text-white mb-2">
                Anon Reader
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your personalized comic and story platform
              </p>
              <button
                className="px-6 py-2 rounded-xl bg-primary text-white font-medium shadow-soft hover:shadow-hover hover:bg-primary/90 transition-all duration-300"
                onClick={() => setShowLoginForm(true)}
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
