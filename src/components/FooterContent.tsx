import React from "react";
import Link from "next/link";

export default function FooterContent() {
  return (
    <div className="w-full max-w-6xl mx-auto px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-medium mb-4">Studio</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Templates
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Anon Reader. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Discord
            </Link>
            <Link
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
