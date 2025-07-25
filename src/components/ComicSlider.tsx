"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

export default function ComicSlider() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const process = document.querySelector(".process");
    if (process) {
      const sections = gsap.utils.toArray(".process__item");
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: process,
          markers: false,
          scrub: 1,
          pin: true,
          snap: 1 / (sections.length - 1),
          end: () =>
            "+=" +
            (document.querySelector(".process") as HTMLElement)?.offsetWidth,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div
        id="process"
        className="process-wrap overflow-hidden bg-morphic-darker"
      >
        <div className="process w-[500%] pt-8 md:pt-20 flex flex-nowrap self-center h-screen min-h-[600px]">
          {[
            {
              id: 1,
              title: "The Last Guardian",
              genre: "Fantasy • Adventure",
              description:
                "An epic tale of a young warrior protecting the last magical creature. Experience a world where courage meets destiny.",
              image: "/landingpage/comic1.png",
            },
            {
              id: 2,
              title: "Neon Dreams",
              genre: "Sci-Fi • Cyberpunk",
              description:
                "Navigate the digital underground of Neo-Tokyo. A thrilling cyberpunk adventure with stunning visuals.",
              image: "/landingpage/comic2.png",
            },
            {
              id: 3,
              title: "Heartstrings",
              genre: "Romance • Slice of Life",
              description:
                "A touching story of love, loss, and second chances. Perfect for readers who enjoy emotional narratives.",
              image: "/landingpage/comic3.png",
            },
            {
              id: 4,
              title: "Shadow Realm",
              genre: "Horror • Mystery",
              description:
                "Uncover dark secrets in this spine-chilling thriller. Not for the faint of heart, but perfect for mystery lovers.",
              image: "/landingpage/comic4.png",
            },
            {
              id: 5,
              title: "Cosmic Wanderers",
              genre: "Space Opera • Adventure",
              description:
                "Join an intergalactic crew on their journey across the universe. Epic space battles and alien civilizations await.",
              image: "/landingpage/comic5.png",
            },
          ].map((comic) => (
            <div
              key={comic.id}
              className="process__item flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-[100px]"
            >
              <div className="relative w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[48vw] max-w-[600px] h-[70vh] sm:h-[75vh] md:h-[80vh] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={comic.image}
                  alt={comic.title}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 60vw, 48vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6">
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-primary/90 text-white text-xs sm:text-sm font-medium rounded-full">
                    {comic.genre}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                    {comic.title}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {comic.description}
                  </p>
                  <div className="mt-2 sm:mt-4 flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white/80 text-xs sm:text-sm">
                        4.8
                      </span>
                    </div>
                    <div className="text-white/60 text-xs sm:text-sm">
                      12 chapters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
