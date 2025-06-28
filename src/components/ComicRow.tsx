"use client";

import React from "react";
import ComicCard from "./ComicCard";
import { Comic } from "@/lib/types";
import Link from "next/link";

interface ComicRowProps {
  title: string;
  comics: Comic[];
  showCount?: boolean;
}

const ComicRow: React.FC<ComicRowProps> = ({
  title,
  comics,
  showCount = false,
}) => {
  if (comics.length === 0) return null;

  return (
    <div className="mb-16">
      {/* Comics Container */}
      <div className="relative">
        {/* Scroll Shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-morphic-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-morphic-dark to-transparent z-10 pointer-events-none" />

        {/* Comics Grid */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth px-1">
          {comics.slice(0, 12).map((comic, index) => (
            <div
              key={comic.id}
              className="flex-shrink-0 w-[200px] sm:w-[220px] animate-fadeIn"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <ComicCard comic={comic} />
            </div>
          ))}

          {/* View More Card */}
          {comics.length > 12 && (
            <div className="flex-shrink-0 w-[200px] sm:w-[220px]">
              <Link href="/browse" className="block h-full">
                <div className="h-full aspect-[2/3] rounded-2xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                  {/* Content */}
                  <div className="text-center px-6">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-7 h-7 text-white/70"
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
                    </div>
                    <h4 className="text-lg font-semibold text-white/90">
                      View More
                    </h4>
                    <p className="text-sm text-white/50 mt-1">
                      +{comics.length - 12} stories
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Scroll Indicators */}
        {comics.length > 5 && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <div className="w-8 h-1 rounded-full bg-white/20" />
            <div className="w-8 h-1 rounded-full bg-white/10" />
            <div className="w-8 h-1 rounded-full bg-white/5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComicRow;
