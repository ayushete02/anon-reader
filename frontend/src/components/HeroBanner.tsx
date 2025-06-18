import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Comic } from "@/lib/types";

interface HeroBannerProps {
  comic: Comic;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ comic }) => {
  return (
    <div className="relative w-full h-[70vh] mb-8">
      {/* Background Image with gradient overlay */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={comic.posterImage}
            alt={comic.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="max-w-2xl">
          {/* Category Pills */}
          <div className="mb-4 flex flex-wrap gap-2">
            {comic.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-primary/20 text-primary rounded-full"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {comic.title}
          </h1>

          {/* Details */}
          <div className="flex items-center text-white/70 text-sm mb-4">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1">{comic.rating}</span>
            </div>
            <span className="mx-2">•</span>
            <span>{new Date(comic.releaseDate).getFullYear()}</span>
            {comic.hasAudio && (
              <>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-7.072m-2.828 9.9a9 9 0 010-12.728"
                    />
                  </svg>
                  <span className="ml-1">Audio Available</span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-white/80 text-lg mb-6 line-clamp-2">
            {comic.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href={`/comic/${comic.id}`}
              className="rounded-md bg-primary px-6 py-3 text-white font-medium hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Read Now
            </Link>
            <button className="rounded-md border border-white/20 px-6 py-3 text-white font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add to My List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
