"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import AnimatedParagraph from "@/components/AnimatedParagraph";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine which section is currently in view
      const sections = [
        "hero",
        "about",
        "mission",
        "features",
        "usecases",
        "cta",
      ];
      const sectionElements = sections.map((id) => document.getElementById(id));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(sections[i]);
            break;
          }
        }
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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-morphic-gray border-t-primary mx-auto mb-4"></div>
          </div>
          <p className="text-morphic-light text-lg font-medium">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-morphic-dark font-sans relative overflow-hidden scroll-smooth">
      {/* Navigation */}
      <nav
        className={`w-full py-5 px-8 md:px-16 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-morphic-dark/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">Anon Reader</h1>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/studio"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Studio
          </Link>
          <Link
            href="/showcase"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Showcase
          </Link>
          <Link
            href="/pricing"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Pricing
          </Link>
          <div className="relative group">
            <button className="text-white/70 hover:text-white transition-colors text-sm flex items-center">
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
            className="text-white/90 hover:text-white transition-colors text-sm"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 pt-24 pb-20 z-10 snap-start"
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
        className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 py-16 z-10 snap-start"
      >
        <div className="sticky top-0 left-0 right-0 h-24 bg-gradient-to-b from-morphic-dark to-transparent z-10 pointer-events-none"></div>

        <div className="w-full max-w-5xl mx-auto z-10 overflow-y-auto scrollbar-hide py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <AnimatedParagraph paragraph="Anon Reader is transforming the future of storytelling using breakthrough technologies. Our platform combines cutting-edge AI with intuitive design to create immersive narrative experiences. We believe in the power of stories to shape our understanding of the world and connect people across cultures and backgrounds. Through innovative tools and a passionate community, we're building a new way to experience and create stories that resonate deeply with readers." />
          </motion.div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-morphic-dark to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* Mission Statement */}
      <section
        id="mission"
        className="w-full bg-morphic-darker py-32 px-8 md:px-16 z-10 relative overflow-hidden snap-start"
      >
        <div className="absolute inset-0 bg-gradient-radial from-morphic-accent/5 to-transparent opacity-30"></div>
        <div className="w-full max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-4xl mx-auto">
            Stories have the power to shape the world. Our mission is to fuel
            profound narratives with advanced machine learning, turning visions
            into cinematic realities.
          </h2>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full bg-morphic-dark py-24 px-8 md:px-16 z-10 snap-start"
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              From ideation to final story.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-morphic-gray rounded-2xl p-8 hover:bg-morphic-lightgray transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6">Canvas</h3>
              <p className="text-white/70">
                Collaboratively generate, edit images and videos on canvas.
                Transform Images into Videos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-morphic-gray rounded-2xl p-8 hover:bg-morphic-lightgray transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6">Copilot</h3>
              <p className="text-white/70">
                Get intelligent suggestions and assistance as you craft your
                stories and characters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-morphic-gray rounded-2xl p-8 hover:bg-morphic-lightgray transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6">Compose</h3>
              <p className="text-white/70">
                Turn sketches into a finished scene or simply create from a
                single prompt with our advanced tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section
        id="usecases"
        className="w-full bg-morphic-darker py-24 px-8 md:px-16 z-10 snap-start"
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
                  A canvas and end-to-end editor that merges advanced AI with a
                  user-friendly design.
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
                  Serving as a production partner and crafting inspiring stories
                  in-house.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="w-full bg-morphic-dark py-24 px-8 md:px-16 z-10 relative overflow-hidden snap-start"
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-50"></div>
        <div className="w-full max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Transforming the future of storytelling using breakthrough
            technologies.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              className="px-8 py-4 rounded-xl bg-primary text-white text-lg font-medium hover:bg-primary/90 transition-all duration-300"
              onClick={() => router.push("/auth/signup")}
            >
              Get Started
            </button>
            <button
              className="px-8 py-4 rounded-xl bg-transparent border-2 border-white/30 text-white text-lg font-medium hover:border-white/60 transition-all duration-300"
              onClick={() =>
                window.open("https://discord.gg/yourdiscord", "_blank")
              }
            >
              Join Discord
            </button>
          </div>
        </div>
      </section>

      {/* Floating navigation dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {["hero", "about", "mission", "features", "usecases", "cta"].map(
          (section) => (
            <button
              key={section}
              onClick={() => {
                document
                  .getElementById(section)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section
                  ? "bg-primary"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Scroll to ${section} section`}
            />
          )
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-morphic-darker py-16 px-8 md:px-16 z-10 border-t border-white/10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <h3 className="text-white font-medium mb-4">Studio</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Company
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Blog</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    News
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Updates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Manifesto</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Our Vision
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Philosophy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Future
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white">Anon Reader</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-left">
              <a
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Terms of Use
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Anon Reader, Inc.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
