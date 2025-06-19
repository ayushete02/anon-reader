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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-700 border-t-red-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white text-lg">Checking your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-stretch bg-[#B4AAFF] font-sans relative overflow-hidden">
      {/* SVG Ribbon Curve Background */}
      <svg
        className="absolute left-0 top-0 h-full w-2/3 md:w-1/2 z-0"
        viewBox="0 0 800 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 Q400,200 400,600 Q400,1000 0,1200 L800,1200 L800,0 Z"
          fill="#AEECFF"
        />
        <path
          d="M0,0 Q300,250 300,600 Q300,950 0,1200 L400,1200 L400,0 Z"
          fill="#B4AAFF"
          opacity="0.7"
        />
      </svg>
      {/* Left: Masked Image Placeholder */}
      <div className="flex-1 flex items-center justify-center relative min-h-[300px] md:min-h-0 z-10">
        {/* <div className="w-72 h-72 md:w-[420px] md:h-[520px] rounded-3xl shadow-xl flex items-center justify-center text-2xl text-purple-400 font-bold overflow-hidden relative">

         IMAGE HERE
        </div> */}
      </div>
      {/* Right: Card with text and CTA */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 z-20">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col gap-8 relative">
          {/* Logo/quote icon */}
          <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <span className="text-white text-2xl font-bold">“</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4 text-left">
            Comic Reader
          </h1>
          <p className="text-xl md:text-2xl text-black mb-8 text-left">
            Discover stories that match your unique taste. Every panel, every
            frame, tailored just for you.
          </p>
          <button
            className="w-full py-4 rounded-full bg-black text-white text-2xl font-bold shadow-md hover:bg-gray-900 transition-colors mb-2"
            onClick={() => router.push("/onboarding")}
          >
            Get Started
          </button>
          <div className="w-full text-left mt-2">
            <span className="text-gray-400 text-sm">
              Already have an account?{" "}
            </span>
            <button
              className="text-black font-semibold underline text-sm"
              onClick={() => setShowLoginForm(true)}
            >
              Log In
            </button>
          </div>
          {showLoginForm && (
            <div className="mt-8 w-full">
              <LoginForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
