"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackComponent?: React.ReactNode;
  showLoginPopup?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  fallbackComponent = null,
  showLoginPopup = false,
}) => {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const user = getUserFromLocalStorage();
  const isAuthenticated = !!user;

  // If authentication is required but user is not logged in
  if (requireAuth && !isAuthenticated) {
    if (showLoginPopup) {
      // Show login popup instead of redirecting
      return (
        <>
          {fallbackComponent || children}{" "}
          <LoginPopup
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
        </>
      );
    } else {
      // Redirect to login page
      if (typeof window !== "undefined") {
        router.push("/");
      }
      return null;
    }
  }

  return <>{children}</>;
};

// Login Popup Modal Component
interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const { login: privyLogin } = usePrivy();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Login required message */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600">
            You need to be logged in to access this feature. Please sign in to
            continue.
          </p>
        </div>

        {/* Privy Login Button */}
        <div className="text-center">
          <Button
            onClick={() => {
              privyLogin();
              onClose();
            }}
            className="w-full bg-primary text-white hover:bg-primary/90 py-3 text-lg"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook for checking authentication and showing login popup
export const useAuthGuard = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const user = getUserFromLocalStorage();
  const isAuthenticated = !!user;

  const requireAuth = (callback?: () => void) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return false;
    }
    if (callback) callback();
    return true;
  };
  const LoginModal = () => (
    <LoginPopup
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
  );

  return {
    isAuthenticated,
    requireAuth,
    LoginModal,
    showLoginModal,
    setShowLoginModal,
  };
};

export default AuthGuard;
