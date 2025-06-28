"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const ComicSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Array of comic pages
  const comicPages = [
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
    "https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg",
  ];

  // Calculate dimensions on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (horizontalRef.current && containerRef.current) {
        // Calculate the total width of all slides plus padding
        const totalWidth =
          (comicPages.length + 1) * (windowWidth * 0.4) + windowWidth * 0.2;
        setScrollWidth(totalWidth);
        setWindowWidth(window.innerWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth, comicPages.length]);

  // Get scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform the horizontal scroll based on vertical scroll
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -scrollWidth + windowWidth]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-morphic-darker"
      id="mission"
    >
      {/* Fixed position container for horizontal scrolling */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center overflow-hidden">
        {/* Title */}
        <div className="w-full max-w-5xl mx-auto text-center pt-24 pb-8 px-8 z-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience the story
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Stories have the power to shape the world. Our mission is to fuel
            profound narratives with advanced machine learning.
          </p>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-morphic-accent/5 to-transparent opacity-30"></div>

        {/* Horizontal scrolling container */}
        <div className="relative w-full h-full flex items-center overflow-hidden">
          <motion.div
            ref={horizontalRef}
            className="flex flex-row items-center h-[80%] pl-[10vw]"
            style={{ x }}
          >
            {comicPages.map((page, index) => (
              <div
                key={index}
                className="relative h-full min-w-[40vw] mx-6 flex-shrink-0 group"
              >
                <div className="relative h-full w-full shadow-2xl rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-[1.02]">
                  <Image
                    src={page}
                    alt={`Comic page ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">
                      {index + 1} / {comicPages.length}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-medium mb-2">
                    Page {index + 1}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Continue the journey through our immersive story
                  </p>
                </div>
              </div>
            ))}

            {/* End section */}
            <div className="relative h-full min-w-[40vw] mx-6 flex-shrink-0 flex items-center justify-center">
              <div className="text-center px-8">
                <h3 className="text-white text-2xl font-bold mb-4">
                  Ready to create your own?
                </h3>
                <button className="px-8 py-4 rounded-xl bg-primary text-white text-lg font-medium hover:bg-primary/90 transition-all duration-300">
                  Start Creating
                </button>
              </div>
            </div>

            {/* Extra space at the end */}
            <div className="min-w-[10vw] h-full"></div>
          </motion.div>

          {/* Left and right gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-morphic-darker to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-morphic-darker to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-20">
          <p className="text-white/70 text-sm mb-2">Scroll to explore</p>
          <motion.div
            className="w-8 h-8 mx-auto"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-white/70"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComicSlider;
