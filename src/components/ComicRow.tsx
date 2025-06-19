import React from "react";
import ComicCard from "./ComicCard";
import { Comic } from "@/lib/types";

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
    <div className="mb-12 animate-fadeIn">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {showCount && (
            <span className="px-3 py-1 bg-gray-800/50 text-gray-400 text-sm rounded-full border border-gray-700">
              {comics.length}
            </span>
          )}
        </div>

        {comics.length > 6 && (
          <button className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors group">
            View All
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Enhanced Scrollable Container */}
      <div className="relative group">
        {/* Scroll Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* Comics Container */}
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
          {comics.slice(0, 12).map((comic, index) => (
            <div
              key={comic.id}
              className="flex-shrink-0 w-[160px] sm:w-[180px] group/item"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                <ComicCard comic={comic} />
              </div>
            </div>
          ))}

          {/* Show More Card if there are more comics */}
          {comics.length > 12 && (
            <div className="flex-shrink-0 w-[160px] sm:w-[180px]">
              <div className="h-[240px] sm:h-[270px] bg-gray-800/30 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-red-600 hover:text-red-400 transition-all duration-300 cursor-pointer group/more">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3 group-hover/more:bg-red-600 transition-colors">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">View More</span>
                <span className="text-xs text-gray-500 mt-1">
                  +{comics.length - 12} more
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComicRow;
