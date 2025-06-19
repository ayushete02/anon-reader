"use client";

import { useState, useEffect } from "react";
import { getUserFromLocalStorage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData) {
      // User not logged in, redirect to landing page
      router.push("/");
      return;
    }

    setUser(userData);
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
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("userPersona");
    // Redirect to landing page
    router.push("/");
  };

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

      {/* Left: Welcome Section */}
      <div className="flex-1 flex items-center justify-center relative min-h-[300px] md:min-h-0 z-10">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4">
            Welcome back,
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
            {user?.name || user?.email || "Reader"}!
          </h3>
          <p className="text-xl text-black/80 max-w-md mx-auto">
            Your personalized comic universe awaits. Ready for your next
            adventure?
          </p>
        </div>
      </div>

      {/* Right: User Profile Card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 z-20">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col gap-8 relative">
          {/* Profile icon */}
          <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-4 text-left">
            Your Dashboard
          </h1>

          {/* User Information */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Name</div>
              <div className="text-lg font-semibold text-black">
                {user?.name || "Not set"}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <div className="text-lg font-semibold text-black">
                {user?.email || "Not available"}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Account Type</div>
              <div className="text-lg font-semibold text-black">
                {user?.isProducer ? "Producer" : "Reader"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full py-4 rounded-full bg-black text-white text-xl font-bold shadow-md hover:bg-gray-900 transition-colors"
              onClick={() => router.push("/browse")}
            >
              Browse Comics
            </button>

            <button
              className="w-full py-3 rounded-full bg-purple-600 text-white text-lg font-semibold shadow-md hover:bg-purple-700 transition-colors"
              onClick={() => router.push("/producer")}
            >
              Create Story
            </button>

            <button
              className="w-full py-3 rounded-full bg-gray-200 text-black text-lg font-medium hover:bg-gray-300 transition-colors"
              onClick={() => router.push("/profile")}
            >
              Edit Profile
            </button>
          </div>

          {/* Logout */}
          <div className="w-full text-center mt-4 pt-4 border-t border-gray-200">
            <button
              className="text-gray-500 text-sm hover:text-red-600 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
