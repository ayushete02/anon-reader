"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

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
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Don't show navbar on onboarding pages
  if (pathname.includes("/onboarding")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-secondary shadow-lg"
          : "bg-gradient-to-b from-black to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-primary font-bold text-2xl">ComicReader</span>
        </Link>
        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/browse"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              pathname === "/browse" ? "text-primary" : "text-gray-300"
            }`}
          >
            Browse
          </Link>
          <Link
            href="/browse?category=trending"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              pathname.includes("trending") ? "text-primary" : "text-gray-300"
            }`}
          >
            Trending
          </Link>
          <Link
            href="/browse?category=new"
            className={`text-sm font-medium hover:text-primary transition-colors ${
              pathname.includes("new") ? "text-primary" : "text-gray-300"
            }`}
          >
            New Releases
          </Link>
        </div>{" "}
        {/* User Menu */}
        <div className="flex items-center">
          <button className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {user ? (
            <div className="ml-4 relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-900 rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    href="/favorites"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Favorites
                  </Link>

                  <Link
                    href="/history"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Reading History
                  </Link>

                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white border-t border-gray-800"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/"
              className="ml-4 bg-primary hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm font-medium"
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
