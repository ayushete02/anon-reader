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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout: privyLogout } = usePrivy();
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
    await privyLogout();
    logout();
    router.push("/");
  };

  // Don't show navbar on onboarding pages
  if (pathname.includes("/onboarding")) {
    return null;
  }

  return (
    <nav
      className={`
        fixed
        top-2
        w-[80vw]
        mx-auto
        left-0 
        right-0
        flex justify-between items-center
        px-6 py-3
        rounded-2xl
        bg-morphic-dark/80
        backdrop-blur-lg
        shadow-lg
        z-50
        transition-all duration-300
        ${scrolled ? "border border-white/10" : ""}
      `}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/browse">
          <h1 className="text-2xl font-display text-white">Anon Reader</h1>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <Button
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/5"
          asChild
        >
          <Link href="/browse">Browse</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/5"
          asChild
        >
          <Link href="/browse?category=trending">Trending</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/5"
          asChild
        >
          <Link href="/browse?category=new">New Releases</Link>
        </Button>
        {user && (
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5"
            asChild
          >
            <Link href="/producer">Create Story</Link>
          </Button>
        )}
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative items-center flex-col" ref={dropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 border border-white/10 ${user.avatar ? "p-0" : ""
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
              <div className="absolute right-0 mt-5 py-2 w-56 bg-morphic-dark/90 backdrop-blur-lg rounded-xl shadow-lg z-50 overflow-hidden border border-white/10">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-white/70">{user.email}</p>
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
              className="text-white/90 hover:text-white hover:bg-white/5"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
