import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Comic } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface HeroBannerProps {
  comics: Comic[];
}

const AUTO_SCROLL_INTERVAL = 5000;

const HeroBanner: React.FC<HeroBannerProps> = ({ comics }) => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % comics.length);
    }, AUTO_SCROLL_INTERVAL);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, comics.length]);

  const comic = comics[index];

  if (!comic) return null;

  return (
    <div className="relative pt-16 sm:pt-20 lg:pt-28 w-full min-h-[70vh] sm:min-h-[80vh] lg:h-[85vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={comic.posterImage || "/comics/placeholder.jpg"}
          alt={comic.title}
          fill
          className="object-cover object-center opacity-30 sm:opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 sm:via-black/40 to-transparent" />
      </div>

      {/* Carousel Content */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-center h-auto lg:h-[70vh] px-4 sm:px-6 py-6 sm:py-8 lg:py-0">
        {/* Poster */}
        <div className="w-full sm:w-[280px] md:w-[300px] lg:w-[320px] max-w-[320px] h-[300px] sm:h-[380px] md:h-[420px] lg:h-[480px] rounded-xl overflow-hidden shadow-2xl bg-black/60 flex-shrink-0 flex items-center justify-center mb-6 lg:mb-0 mx-auto lg:mx-0">
          <Image
            src={comic.posterImage || "/comics/placeholder.jpg"}
            alt={comic.title}
            width={320}
            height={480}
            className="object-cover object-center w-full h-full"
            priority
          />
        </div>

        {/* Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={comic.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5 }}
            className="lg:ml-10 flex-1 max-w-2xl text-center lg:text-left"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {comic.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4">
              <span className="text-white/80 text-sm sm:text-base">
                {new Date(comic.releaseDate).getFullYear()}
              </span>
              <span className="text-white/50">|</span>
              <span className="text-white/80 text-sm sm:text-base">
                {comic.rating}★
              </span>
              <span className="text-white/50 hidden sm:inline">|</span>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {comic.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-6 line-clamp-3 px-4 lg:px-0">
              {comic.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
              <Link
                href={`/story/${comic.id}`}
                className="w-full sm:w-auto rounded-md bg-primary text-white hover:bg-primary/90 px-6 py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
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
              <button className="w-full sm:w-auto rounded-md border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-white font-medium transition-colors inline-flex items-center justify-center gap-2">
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
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 lg:flex flex-col gap-4 z-20 hidden">
          {comics.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                i === index
                  ? "border-white bg-white"
                  : "border-gray-400 bg-transparent"
              }`}
              style={{
                opacity: i === index ? 1 : 0.5,
                boxShadow: i === index ? "0 0 0 2px #fff" : undefined,
              }}
            />
          ))}
        </div>

        {/* Mobile Dots Indicator */}
        <div className="flex lg:hidden justify-center gap-2 mt-6">
          {comics.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                i === index
                  ? "border-white bg-white"
                  : "border-gray-400 bg-transparent"
              }`}
              style={{
                opacity: i === index ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
