"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { signOutGoogle } from "@/lib/google-auth";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll event to add background color when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    // Sign out from Google if user was authenticated with Google
    await signOutGoogle();

    // Clear local user state
    logout();
    router.push("/");
  };

  // Don't show navbar on onboarding pages
  if (pathname.includes("/onboarding")) {
    return null;
  }

  return (
    <nav
      className={`fixed mx-4 md:mx-8 lg:mx-12 mt-4 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 rounded-2xl ${
        scrolled ? "navbar-glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/browse" className="flex items-center">
          <span className="text-primary font-la-nord-bold text-2xl">
            Anon Reader
          </span>
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-8 font-la-nord">
          <Link
            href="/browse"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              pathname === "/browse"
                ? "text-primary"
                : "text-secondary dark:text-gray-300"
            }`}
          >
            Browse
          </Link>
          <Link
            href="/browse?category=trending"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              pathname.includes("trending")
                ? "text-primary"
                : "text-secondary dark:text-gray-300"
            }`}
          >
            Trending
          </Link>
          <Link
            href="/browse?category=new"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              pathname.includes("new")
                ? "text-primary"
                : "text-secondary dark:text-gray-300"
            }`}
          >
            New Releases
          </Link>
          {user && (
            <Link
              href="/producer"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === "/producer"
                  ? "text-primary"
                  : "text-secondary dark:text-gray-300"
              }`}
            >
              Create Story
            </Link>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium shadow-soft hover:shadow-hover transition-all duration-300"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-56 bg-white dark:bg-secondary rounded-xl shadow-soft z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-secondary dark:text-white">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/home"
                    className="flex items-center px-4 py-2 text-sm text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Home Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    href="/favorites"
                    className="flex items-center px-4 py-2 text-sm text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    My Favorites
                  </Link>
                  <Link
                    href="/history"
                    className="flex items-center px-4 py-2 text-sm text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Reading History
                  </Link>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary border-t border-gray-100 dark:border-gray-700"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2 text-sm font-medium shadow-soft hover:shadow-hover transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
