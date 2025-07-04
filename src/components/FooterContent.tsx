import React from "react";

export default function FooterContent() {
  return (
    <div className="w-full max-w-6xl mx-auto px-8">
      <div className="mt-16 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Anon Reader. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-white">
            Built with ❤️ by Team Atmanirbhar
          </div>
        </div>
      </div>
    </div>
  );
}
