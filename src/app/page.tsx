"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import AnimatedParagraph from "@/components/AnimatedParagraph";
import { motion } from "framer-motion";
import ComicSlider from "@/components/ComicSlider";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) {
      // Check if user has completed persona onboarding
      const savedPersona = localStorage.getItem("userPersona");
      if (savedPersona) {
        try {
          const persona = JSON.parse(savedPersona);
          if (persona.personaType) {
            // User has completed persona - redirect to browse
            router.push("/browse");
            return;
          } else {
            // User has incomplete persona - redirect to onboarding
            router.push("/onboarding");
            return;
          }
        } catch (error) {
          console.error("Error parsing user persona:", error);
          // If persona data is corrupted, redirect to onboarding
          router.push("/onboarding");
          return;
        }
      } else {
        // No persona found - redirect to onboarding
        router.push("/onboarding");
        return;
      }
    }
    // If no user, stay on landing page
    setIsCheckingAuth(false);
  }, [router]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-morphic-dark flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-morphic-gray border-t-[#030712] mx-auto mb-4"></div>
          </div>
          <p className="text-morphic-light text-lg font-medium">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-morphic-dark relative overflow-hidden">
      {/* Navigation */}
      <div className="w-full flex justify-center">
        <nav
          className={`
          
          fixed
          top-6
          w-[70vw]
          flex justify-between items-center
          px-6 py-3
          rounded-2xl
          bg-morphic-dark/80
          backdrop-blur-lg
          shadow-lg
          z-50
          transition-all duration-300
          mx-auto
          ${isScrolled ? "border border-white/10" : ""}
        `}
        >
          <div className="flex items-center">
            <h1 className="text-2xl font-la-nord-bold text-white">
              Anon Reader
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/studio"
              className="text-white/70 hover:text-white transition-colors text-sm font-la-nord"
            >
              Studio
            </Link>
            <Link
              href="/showcase"
              className="text-white/70 hover:text-white transition-colors text-sm font-la-nord"
            >
              Showcase
            </Link>
            <Link
              href="/pricing"
              className="text-white/70 hover:text-white transition-colors text-sm font-la-nord"
            >
              Pricing
            </Link>
            <div className="relative group">
              <button className="text-white/70 hover:text-white transition-colors text-sm font-la-nord flex items-center">
                Resources
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-white/90 hover:text-white transition-colors text-sm font-la-nord"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-sm font-la-nord"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section - Removed La Nord font */}
        <section
          id="hero"
          className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 pt-24 pb-20 z-10"
        >
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-20"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              <source
                src="https://ik.imagekit.io/y9lbsvfas/website-production/assets/video/hero-main.webm/ik-video.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-morphic-dark via-transparent to-morphic-dark"></div>
          </div>

          <div className="w-full max-w-5xl mx-auto text-center z-10 mt-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
            >
              A new era of storytelling.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            >
              <button
                className="px-8 py-4 rounded-xl bg-primary text-white text-lg font-medium hover:bg-primary/90 transition-all duration-300"
                onClick={() => router.push("/auth/signup")}
              >
                Get Started
              </button>
              <button
                className="px-8 py-4 rounded-xl bg-morphic-gray text-white text-lg font-medium hover:bg-morphic-lightgray transition-all duration-300"
                onClick={() =>
                  window.open("https://discord.gg/yourdiscord", "_blank")
                }
              >
                Join Discord
              </button>
            </motion.div>
          </div>
        </section>

        {/* Animated Paragraph Section */}
        <section
          id="about"
          className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 py-16 z-10"
        >
          <div className="sticky top-0 left-0 right-0 h-24 bg-gradient-to-b from-morphic-dark to-transparent z-10 pointer-events-none"></div>

          <div className="w-full max-w-5xl mx-auto z-10 overflow-y-auto scrollbar-hide ">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <AnimatedParagraph paragraph="Anon Reader is transforming the future of storytelling using breakthrough technologies. Our platform combines cutting-edge AI with intuitive design to create immersive narrative experiences. We believe in the power of stories to shape our understanding of the world and connect people across cultures and." />
            </motion.div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-morphic-dark to-transparent z-10 pointer-events-none"></div>
        </section>

        {/* Comic Slider Section */}
        <ComicSlider />

        {/* Use Cases Section */}
        <section
          id="usecases"
          className="w-full bg-morphic-darker py-24 px-8 md:px-16 z-10"
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                The power of Anon Reader.
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Across Industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Use Case 1 */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors duration-300 z-0"></div>
                <div className="relative h-full bg-morphic-gray z-0">
                  {/* Background image would go here */}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Creatives
                  </h3>
                  <p className="text-white/90">
                    A canvas and end-to-end editor that merges advanced AI with
                    a user-friendly design.
                  </p>
                </div>
              </div>

              {/* Use Case 2 */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-green-600/20 group-hover:bg-green-600/30 transition-colors duration-300 z-0"></div>
                <div className="relative h-full bg-morphic-gray z-0">
                  {/* Background image would go here */}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Game Designers
                  </h3>
                  <p className="text-white/90">
                    Providing tools for creating interactive gaming experiences.
                    Reducing time to market.
                  </p>
                </div>
              </div>

              {/* Use Case 3 */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors duration-300 z-0"></div>
                <div className="relative h-full bg-morphic-gray z-0">
                  {/* Background image would go here */}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Filmmakers
                  </h3>
                  <p className="text-white/90">
                    Serving as a production partner and crafting inspiring
                    stories in-house.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="cta"
          className="w-full bg-morphic-dark py-24 px-8 md:px-16 z-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-50"></div>
          <div className="w-full max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Transforming the future of storytelling using breakthrough
              technologies.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                className="px-8 py-4 rounded-xl bg-primary text-white text-lg font-la-nord hover:bg-primary/90 transition-all duration-300"
                onClick={() => router.push("/auth/signup")}
              >
                Get Started
              </button>
              <button
                className="px-8 py-4 rounded-xl bg-transparent border-2 border-white/30 text-white text-lg font-la-nord hover:border-white/60 transition-all duration-300"
                onClick={() =>
                  window.open("https://discord.gg/yourdiscord", "_blank")
                }
              >
                Join Discord
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
