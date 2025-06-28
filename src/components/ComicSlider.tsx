"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

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
      <div className="empty h-screen flex flex-col items-center justify-center bg-morphic-dark">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Featured Stories
        </h2>
        <p className="text-xl text-white/70 max-w-2xl text-center mb-8">
          Discover amazing stories created by our community. Get inspired and
          start your own creative journey.
        </p>
        <Link
          href="/auth/signup"
          className="px-8 py-4 rounded-xl bg-primary text-white text-lg font-medium hover:bg-primary/90 transition-all duration-300"
        >
          Start Reading
        </Link>
      </div>
      <div className="process-wrap overflow-hidden bg-morphic-darker">
        <div className="process w-[500%] pt-20 flex flex-nowrap self-center h-screen">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="process__item flex items-center justify-center px-[100px]"
            >
              <div className="relative w-[48vw] max-w-[600px] h-[80vh] rounded-2xl overflow-hidden group">
                <img
                  src="https://images.pexels.com/photos/4061662/pexels-photo-4061662.jpeg"
                  alt={`Process ${num}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">{num}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Story Title {num}
                  </h3>
                  <p className="text-white/90 text-base line-clamp-3">
                    Whatever the solution, it is only a first step of a great
                    journey. We&apos;ll be by your side when the need for
                    further improvements, optimization or additional
                    functionality arises.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="empty h-screen flex flex-col items-center justify-center bg-morphic-dark">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Create Your Story
        </h2>
        <p className="text-xl text-white/70 max-w-2xl text-center mb-8">
          Turn your imagination into reality. Our AI-powered platform makes it
          easy to create stunning visual stories.
        </p>
        <Link
          href="/producer"
          className="px-8 py-4 rounded-xl bg-primary text-white text-lg font-medium hover:bg-primary/90 transition-all duration-300"
        >
          Start Creating
        </Link>
      </div>
    </>
  );
}
