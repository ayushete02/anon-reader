"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Comic } from "@/lib/types";
import { useUser } from "@/context/UserContext";

interface ComicCardProps {
  comic: Comic;
  priority?: boolean;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic, priority = false }) => {
  const { user, updateUser } = useUser();
  const router = useRouter();

  const isFavorite = user?.favorites.includes(comic.id) || false;
  const readingHistory = user?.history.find((h) => h.comicId === comic.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    let newFavorites;
    if (isFavorite) {
      newFavorites = user.favorites.filter((id) => id !== comic.id);
    } else {
      newFavorites = [...user.favorites, comic.id];
    }
    updateUser({ favorites: newFavorites });
  };

  const handleComicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/story/${comic.id}`);
  };

  return (
    <div
      className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-morphic-gray/30"
      onClick={handleComicClick}
    >
      {/* Image with Overlay */}
      <div className="relative w-full h-full">
        <Image
          src={comic.posterImage}
          alt={comic.title}
          fill
          sizes="(max-width: 768px) 40vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />

        {/* Static Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-60" />

        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {comic.title}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center gap-2">
          {/* Rating */}
          <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-white/10">
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

          {/* Type Badge */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1.5 border border-white/10">
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
          </div>
        </div>
      </div>

      {/* Favorite Button */}
      {user && (
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 z-40 p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            isFavorite
              ? "bg-red-500/30 text-red-400 border border-red-500/30"
              : "bg-black/30 text-white/70 border border-white/10 opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={isFavorite ? "currentColor" : "none"}
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
        </button>
      )}

      {/* Reading Progress */}
      {readingHistory && (
        <div className="absolute top-3 left-3 z-40 bg-primary/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg border border-primary/30">
          {readingHistory.progress}% Read
        </div>
      )}
    </div>
  );
};

export default ComicCard;
