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

  return (
    <div className="relative pt-28 w-full h-[99vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={comic.posterImage || "/comics/placeholder.jpg"}
          alt={comic.title}
          fill
          className="object-cover object-center opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Carousel Content */}
      <div className="relative z-10 flex w-full max-w-6xl mx-auto items-center h-[70vh]">
        {/* Poster */}
        <div className="w-[260px] min-w-[180px] max-w-[260px] h-[390px] rounded-xl overflow-hidden shadow-2xl bg-black/60 flex-shrink-0 flex items-center justify-center">
          <Image
            src={comic.posterImage || "/comics/placeholder.jpg"}
            alt={comic.title}
            width={260}
            height={390}
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
            className="ml-10 flex-1 max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {comic.title}
            </h1>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white/80">
                {new Date(comic.releaseDate).getFullYear()}
              </span>
              <span className="text-white/50">|</span>
              <span className="text-white/80">{comic.rating}★</span>
              <span className="text-white/50">|</span>
              {comic.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold mr-2"
                >
                  {cat}
                </span>
              ))}
            </div>
            <p className="text-white/90 text-lg mb-6 line-clamp-3">
              {comic.description}
            </p>
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
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
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
      </div>
    </div>
  );
};

export default HeroBanner;
