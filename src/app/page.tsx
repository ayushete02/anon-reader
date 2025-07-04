"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import AnimatedParagraph from "@/components/AnimatedParagraph";
import { motion } from "framer-motion";
import ComicSlider from "@/components/ComicSlider";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { login: privyLogin } = usePrivy();
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
          if (persona.personaType && typeof persona.personaType === "string") {
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
      {/* Background blur effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      {/* Navigation */}
      <div className="w-full flex justify-center">
        <nav
          className={`
          fixed
          top-2 sm:top-6
          w-[95vw] sm:w-[85vw] lg:w-[70vw]
          flex justify-between items-center
          px-3 sm:px-6 py-3
          rounded-2xl
          bg-morphic-dark/70
          backdrop-blur-xl
          shadow-2xl
          border border-white/10
          z-50
          transition-all duration-300
          mx-auto
          ${isScrolled ? "backdrop-blur-2xl bg-morphic-dark/80 shadow-3xl" : ""}
        `}
        >
          <div className="flex items-center">
            <h1 className="text-lg sm:text-2xl text-white">Anon Reader</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                onClick={() => {
                  document.getElementById("about")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                About
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Features
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                onClick={() => router.push("/browse")}
              >
                Library
              </Button>
            </motion.div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              className="bg-primary text-white  border-white/70 hover:text-white hover:bg-primary/90 text-sm sm:text-base px-2 sm:px-4"
              onClick={() => privyLogin()}
            >
              Login
            </Button>
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
              className="w-full h-full object-cover opacity-30"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              <source
                src="https://ik.imagekit.io/y9lbsvfas/website-production/assets/video/hero-main.webm/ik-video.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-morphic-dark/80 via-morphic-dark/20 to-morphic-dark backdrop-blur-[1px]"></div>
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-morphic-dark/10 to-morphic-dark/50"></div>
          </div>

          <div className="w-full max-w-5xl mx-auto text-center z-10 mt-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
            >
              Discover Stories That Understand You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8"
            >
              Discover personalized comic adventures with AI that learns your
              taste and curates the perfect stories for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button
                  variant="default"
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 backdrop-blur-xl border border-primary/30 hover:border-primary/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transform-gpu group"
                  onClick={() => privyLogin()}
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Start Reading
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transform-gpu group"
                  onClick={() => router.push("/browse")}
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Explore Library
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Animated Paragraph Section */}
        <section
          id="about"
          className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 py-16 z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-morphic-dark/50 to-morphic-darker/50 backdrop-blur-sm"></div>
          <div className="sticky top-0 left-0 right-0 h-24 bg-gradient-to-b from-morphic-dark via-morphic-dark/80 to-transparent backdrop-blur-lg z-10 pointer-events-none"></div>

          <div className="w-full max-w-5xl mx-auto z-10 overflow-y-auto scrollbar-hide">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <AnimatedParagraph paragraph="Experience the future of storytelling with our intelligent AI engine that learns your reading patterns, understands your narrative preferences, and discovers your perfect comic matches. Our advanced machine learning algorithms analyze your choices and deliver personalized recommendations that evolve with your taste." />
            </motion.div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-morphic-dark via-morphic-dark/80 to-transparent backdrop-blur-lg z-10 pointer-events-none"></div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full bg-morphic-darker/80 backdrop-blur-sm py-24 px-8 md:px-16 z-10 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-morphic-darker via-morphic-dark/50 to-morphic-darker"></div>
          <div className="w-full max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose Anon Reader?
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience comics like never before with our personalized
                approach
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 - AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-morphic-dark/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/40 transition-all duration-500 hover:bg-morphic-dark/80 hover:shadow-2xl hover:shadow-blue-500/20 group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30 group-hover:bg-blue-500/30 group-hover:border-blue-500/50 transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                    AI-Powered Recommendations
                  </h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    Advanced machine learning algorithms analyze your reading
                    patterns, preferences, and favorite story elements to
                    suggest comics you&apos;ll love.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 - Personalized Discovery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-morphic-dark/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-green-500/40 transition-all duration-500 hover:bg-morphic-dark/80 hover:shadow-2xl hover:shadow-green-500/20 group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-green-500/30 group-hover:bg-green-500/30 group-hover:border-green-500/50 transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors duration-300">
                    Smart Discovery Engine
                  </h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    Our AI understands narrative styles, character development,
                    and plot structures to find stories that match your unique
                    taste profile.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 - Intelligent Reading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-morphic-dark/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/40 transition-all duration-500 hover:bg-morphic-dark/80 hover:shadow-2xl hover:shadow-purple-500/20 group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-purple-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-purple-500/30 group-hover:bg-purple-500/30 group-hover:border-purple-500/50 transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                    Adaptive Learning
                  </h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    The more you read, the smarter our recommendations become.
                    Track progress and discover new genres with intelligent
                    bookmarking.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full bg-morphic-dark/80 backdrop-blur-sm py-24 px-8 md:px-16 z-10">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Get personalized recommendations in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Take Quiz
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Quick personality assessment to understand your reading
                  preferences.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Get Matches
                </h3>
                <p className="text-white/70 leading-relaxed">
                  AI curates comics that perfectly match your taste and
                  interests.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Start Reading
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Enjoy your personalized library with immersive reading
                  experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comic Slider Section */}
        <ComicSlider />

        {/* CTA Section */}
        <section
          id="cta"
          className="w-full bg-morphic-dark/90 backdrop-blur-xl py-24 px-8 md:px-16 z-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/5 to-transparent opacity-50"></div>
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="w-full max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Find Your Next Favorite Comic?
            </h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Join thousands of readers discovering their perfect stories
              through AI-powered recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 rounded-xl bg-primary/90 backdrop-blur-sm text-white text-lg hover:bg-primary transition-all duration-300 border border-primary/30 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                onClick={() => privyLogin()}
              >
                Start Reading for Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-xl bg-transparent backdrop-blur-sm border-2 border-white/30 text-white text-lg hover:border-white/60 hover:bg-white/5 transition-all duration-300 hover:scale-105"
                onClick={() => router.push("/browse")}
              >
                Explore Library
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
