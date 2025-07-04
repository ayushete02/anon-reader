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
        <div className="process w-[500%] pt-20 flex flex-nowrap self-center h-screen">
          {[
            {
              id: 1,
              title: "The Last Guardian",
              genre: "Fantasy • Adventure",
              description:
                "An epic tale of a young warrior protecting the last magical creature. Experience a world where courage meets destiny.",
              image: "/comics/comic1.jpg",
            },
            {
              id: 2,
              title: "Neon Dreams",
              genre: "Sci-Fi • Cyberpunk",
              description:
                "Navigate the digital underground of Neo-Tokyo. A thrilling cyberpunk adventure with stunning visuals.",
              image: "/comics/comic2.jpg",
            },
            {
              id: 3,
              title: "Heartstrings",
              genre: "Romance • Slice of Life",
              description:
                "A touching story of love, loss, and second chances. Perfect for readers who enjoy emotional narratives.",
              image: "/comics/comic3.jpg",
            },
            {
              id: 4,
              title: "Shadow Realm",
              genre: "Horror • Mystery",
              description:
                "Uncover dark secrets in this spine-chilling thriller. Not for the faint of heart, but perfect for mystery lovers.",
              image: "/comics/comic4.jpg",
            },
            {
              id: 5,
              title: "Cosmic Wanderers",
              genre: "Space Opera • Adventure",
              description:
                "Join an intergalactic crew on their journey across the universe. Epic space battles and alien civilizations await.",
              image: "/comics/page-1.jpg",
            },
          ].map((comic) => (
            <div
              key={comic.id}
              className="process__item flex items-center justify-center px-[100px]"
            >
              <div className="relative w-[48vw] max-w-[600px] h-[80vh] rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={comic.image}
                  alt={comic.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 48vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-primary/90 text-white text-sm font-medium rounded-full">
                    {comic.genre}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {comic.title}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed line-clamp-3">
                    {comic.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white/80 text-sm">4.8</span>
                    </div>
                    <div className="text-white/60 text-sm">12 chapters</div>
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
