"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
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
            <h1 className="text-lg sm:text-2xl font-display text-white">
              Anon Reader
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
              asChild
            >
              <Link href="#about">About</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
              asChild
            >
              <Link href="#features">Features</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
              asChild
            >
              <Link href="/browse">Library</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/5 text-sm sm:text-base px-2 sm:px-4"
              onClick={() => privyLogin()}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="bg-primary text-white hover:text-white hover:bg-primary/90 text-sm sm:text-base px-2 sm:px-4"
              asChild
            >
              <Link href="/auth/signup">Get Started</Link>
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
              Discover Stories That Understand You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-8"
            >
              Experience personalized comic adventures tailored to your unique
              preferences. From fantasy epics to slice-of-life stories, find
              your perfect narrative match.
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
                  className="bg-primary text-white hover:bg-primary/90"
                  asChild
                >
                  <Link href="/auth/signup">Start Reading</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/5 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/browse">Explore Library</Link>
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
          <div className="sticky top-0 left-0 right-0 h-24 bg-gradient-to-b from-morphic-dark to-transparent z-10 pointer-events-none"></div>

          <div className="w-full max-w-5xl mx-auto z-10 overflow-y-auto scrollbar-hide ">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <AnimatedParagraph paragraph="Anon Reader revolutionizes how you discover and experience digital comics. Our intelligent recommendation system learns your preferences, story endings you love, and narrative styles that resonate with you. Whether you prefer tales of redemption, epic adventures, or intimate character studies, we curate the perfect reading experience tailored just for you. Join thousands of readers who have discovered their next favorite story through our personalized approach to digital storytelling." />
            </motion.div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-morphic-dark to-transparent z-10 pointer-events-none"></div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full bg-morphic-darker py-24 px-8 md:px-16 z-10"
        >
          <div className="w-full max-w-6xl mx-auto">
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
              {/* Feature 1 - Personalized Recommendations */}
              <div className="bg-morphic-dark rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Smart Recommendations
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Our AI learns your preferences through a personality quiz
                    and reading history to suggest comics that match your taste
                    perfectly.
                  </p>
                </div>
              </div>

              {/* Feature 2 - Immersive Reading */}
              <div className="bg-morphic-dark rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Rich Media Experience
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Enjoy comics with integrated audio narration, sound effects,
                    and smooth page transitions for an immersive reading
                    experience.
                  </p>
                </div>
              </div>

              {/* Feature 3 - Progress Tracking */}
              <div className="bg-morphic-dark rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-purple-400"
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
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Track Your Journey
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Never lose your place. Keep track of your reading progress,
                    bookmark favorites, and discover new series based on your
                    reading patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full bg-morphic-dark py-24 px-8 md:px-16 z-10">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Get personalized comic recommendations in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent hidden md:block transform -translate-y-1/2"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Take the Quiz
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Complete our personality assessment to help us understand your
                  storytelling preferences, favorite themes, and narrative
                  styles.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent hidden md:block transform -translate-y-1/2"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Get Recommendations
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Our AI analyzes your responses and curates a personalized
                  library of comics that match your unique taste and
                  preferences.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Start Reading
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Dive into your personalized comic library with rich media
                  experiences, progress tracking, and continuous recommendations
                  as you read.
                </p>
              </div>
            </div>
          </div>
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
                Perfect for Every Reader
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Whether you&apos;re new to comics or a seasoned enthusiast, find
                your perfect story
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Use Case 1 - New Readers */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors duration-300 z-0"></div>
                <div className="relative h-full bg-morphic-gray z-0 flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-blue-400 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    New to Comics
                  </h3>
                  <p className="text-white/90">
                    Discover the world of digital comics with curated starter
                    collections and guided recommendations based on your
                    interests.
                  </p>
                </div>
              </div>

              {/* Use Case 2 - Enthusiasts */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-green-600/20 group-hover:bg-green-600/30 transition-colors duration-300 z-0"></div>
                <div className="relative h-full bg-morphic-gray z-0 flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-green-400 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Comic Enthusiasts
                  </h3>
                  <p className="text-white/90">
                    Expand your reading horizons with AI-powered suggestions
                    that discover hidden gems matching your sophisticated
                    tastes.
                  </p>
                </div>
              </div>

              {/* Use Case 3 - Casual Readers */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors duration-300 z-0"></div>
                <div className="relative h-full bg-morphic-gray z-0 flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-purple-400 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Casual Readers
                  </h3>
                  <p className="text-white/90">
                    Find quick, engaging stories that fit your schedule. Perfect
                    for commutes, lunch breaks, or relaxing evenings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full bg-morphic-darker py-24 px-8 md:px-16 z-10">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Everything you need to know about Anon Reader
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-morphic-dark rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-3">
                  How does the personalization work?
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Our AI analyzes your responses to our personality quiz,
                  reading history, and preferences to recommend comics that
                  match your unique taste. The more you read, the better our
                  recommendations become.
                </p>
              </div>

              <div className="bg-morphic-dark rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Is Anon Reader free to use?
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Yes! You can start reading for free with access to our basic
                  library. Premium features like exclusive content, enhanced
                  audio experiences, and advanced recommendations are available
                  with our subscription plans.
                </p>
              </div>

              <div className="bg-morphic-dark rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-3">
                  What types of comics are available?
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We offer a diverse library spanning fantasy, sci-fi, romance,
                  horror, slice-of-life, action, mystery, and more. From epic
                  adventures to intimate character studies, there&apos;s
                  something for every reader.
                </p>
              </div>

              <div className="bg-morphic-dark rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Can I read offline?
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Yes! Premium subscribers can download comics for offline
                  reading. Perfect for commutes, travel, or when you don&apos;t
                  have internet access.
                </p>
              </div>

              <div className="bg-morphic-dark rounded-xl p-6 border border-white/5">
                <h3 className="text-xl font-semibold text-white mb-3">
                  How accurate are the recommendations?
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Our AI has a 98% accuracy rate in matching readers with comics
                  they love. Our recommendation engine continuously learns from
                  your reading patterns to improve suggestions over time.
                </p>
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
              Ready to discover your next favorite comic?
            </h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Join thousands of readers who have found their perfect stories
              through our personalized recommendations. Start your journey
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                className="px-8 py-4 rounded-xl bg-primary text-white text-lg hover:bg-primary/90 transition-all duration-300"
                onClick={() => router.push("/auth/signup")}
              >
                Start Reading for Free
              </button>
              <button
                className="px-8 py-4 rounded-xl bg-transparent border-2 border-white/30 text-white text-lg hover:border-white/60 transition-all duration-300"
                onClick={() => router.push("/browse")}
              >
                Explore Library
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
