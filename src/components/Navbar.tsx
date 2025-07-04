"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
// import { signOutGoogle } from "@/lib/google-auth";
import { Button } from "./ui/button";
import { usePrivy } from "@privy-io/react-auth";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { logout: privyLogout, login: privyLogin } = usePrivy();
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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await privyLogout();
    logout();
    router.push("/");
  };

  // Don't show navbar on onboarding pages
  if (pathname.includes("/onboarding")) {
    return null;
  }

  return (
    <>
      <nav
        className={`
          fixed
          top-2
          w-[95vw] sm:w-[90vw] lg:w-[80vw]
          mx-auto
          left-0 
          right-0
          flex justify-between items-center
          px-3 sm:px-6 py-3
          rounded-2xl
          bg-morphic-dark/70
          backdrop-blur-xl
          shadow-2xl
          border border-white/10
          z-50
          transition-all duration-500
          hover:bg-morphic-dark/80
          hover:border-white/20
          hover:shadow-3xl
          ${
            scrolled
              ? "backdrop-blur-2xl bg-morphic-dark/90 shadow-3xl border-white/20"
              : ""
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/browse">
            <h1 className="text-lg sm:text-xl lg:text-2xl text-white">
              Anon Reader
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5 text-sm lg:text-base px-2 lg:px-4"
            asChild
          >
            <Link href="/browse">Browse</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5 text-sm lg:text-base px-2 lg:px-4"
            asChild
          >
            <Link href="/browse?category=trending">Trending</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5 text-sm lg:text-base px-2 lg:px-4"
            asChild
          >
            <Link href="/browse?category=new">New Releases</Link>
          </Button>
          {user && (
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5 text-sm lg:text-base px-2 lg:px-4"
              asChild
            >
              <Link href="/producer">Create Story</Link>
            </Button>
          )}
        </div>

        {/* Mobile & Desktop User Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Button - only show when logged in */}
          {user && (
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/5"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          )}

          {user ? (
            <div className="relative items-center flex-col" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-white hover:bg-primary/90 border border-white/10 ${
                  user.avatar ? "p-0" : ""
                }`}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={40}
                    className="rounded-full"
                    height={40}
                  />
                ) : user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-5 py-2 w-48 sm:w-56 bg-morphic-dark/90 backdrop-blur-lg rounded-xl shadow-lg z-50 overflow-hidden border border-white/10">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-white/70 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/home"
                    className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
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
                    className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
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
                    className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
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
                    className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
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
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white border-t border-white/10"
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
            <>
              <Button
                variant="default"
                className="text-white/90 hover:text-white hover:bg-white/5 text-sm sm:text-base px-2 sm:px-4"
                onClick={() => privyLogin()}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {user && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className="absolute top-20 left-2 right-2 bg-morphic-dark/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-4">
              <Link
                href="/browse"
                className="flex items-center px-6 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Browse Comics
              </Link>
              <Link
                href="/browse?category=trending"
                className="flex items-center px-6 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Trending
              </Link>
              <Link
                href="/browse?category=new"
                className="flex items-center px-6 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                New Releases
              </Link>
              <Link
                href="/producer"
                className="flex items-center px-6 py-3 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Story
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
