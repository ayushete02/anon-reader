"use client";

import { useUser } from "@/context/UserContext";
import { Comic } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ComicCardProps {
  comic: Comic;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic }) => {
  const { user } = useUser();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const readingHistory = user?.history.find((h) => h.comicId === comic.id);

  const handleComicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/story/${comic.id}`);
  };

  return (
    <div
      className={`group relative flex transition-all duration-500 cursor-pointer bg-morphic-gray/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 hover:bg-morphic-gray/80`}
      style={{
        width: hovered ? 440 : 200, // expanded width on hover
        minHeight: 300,
        boxShadow: hovered
          ? "0 20px 40px 0 rgba(0,0,0,0.4), 0 0 30px rgba(93,93,255,0.2)"
          : "0 4px 16px 0 rgba(0,0,0,0.15)",
        zIndex: hovered ? 20 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleComicClick}
    >
      {/* Poster */}
      <div
        className="relative h-full"
        style={{
          width: 200,
          minWidth: 200,
          aspectRatio: "2/3",
          flexShrink: 0,
        }}
      >
        <img
          src={comic.posterImage || "/comics/placeholder.jpg"}
          alt={comic.title}
          style={{
            objectFit: "cover",
            transition: "transform 0.5s",
            ...(hovered ? { transform: "scale(1.05)" } : {}),
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-white/10 z-10">
          <svg
            className="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1 text-sm font-medium text-white">
            {comic.rating}
          </span>
        </div>
      </div>

      {/* Expanded Content (only visible on hover) */}
      <div
        className={`transition-all duration-300 flex flex-col justify-between px-6 py-5 ${
          hovered
            ? "opacity-100 w-[240px] pointer-events-auto"
            : "hidden  w-0 pointer-events-none"
        }`}
        style={{
          minWidth: hovered ? 240 : 0,
          maxWidth: hovered ? 240 : 0,
        }}
      >
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{comic.title}</h3>
        {/* Top: Categories */}
        <div className="flex flex-wrap gap-1 mb-2">
          {comic.categories.slice(0, 2).map((category) => (
            <span
              key={category}
              className="text-xs px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 text-white/90"
            >
              {category}
            </span>
          ))}
        </div>
        {/* Description */}
        <p className="text-sm text-white/80 mb-4 line-clamp-3">
          {comic.description}
        </p>
        {/* Type, Progress, More Info */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {comic.type === "text" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
            <span className="text-xs text-white/70">
              {comic.type === "text" ? "Novel" : "Comic"}
            </span>
          </div>
          {readingHistory && (
            <div className="text-xs text-white/70">
              {readingHistory.progress}% Read
            </div>
          )}
        </div>
        {/* More Info Link */}
        <div className="mt-4">
          <span className="text-red-400 text-sm font-medium cursor-pointer hover:underline">
            More information
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComicCard;
