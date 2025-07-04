"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserFromLocalStorage } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import AnimatedParagraph from "@/components/AnimatedParagraph";
import { motion } from "framer-motion";
import ComicSlider from "@/components/ComicSlider";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAccount, useBalance, useChainId } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address: address,
  });
  const { login: privyLogin, ready, authenticated, user, logout } = usePrivy();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const disableLogout = !ready || (ready && !authenticated);

  // Function to get chain icon and name
  const getChainInfo = (chainId: number) => {
    const chains = {
      1: {
        name: "Ethereum",
        icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
        color: "text-blue-400",
      },
      137: {
        name: "Polygon",
        icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
        color: "text-purple-400",
      },
      56: {
        name: "BSC",
        icon: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg",
        color: "text-yellow-400",
      },
      43114: {
        name: "Avalanche",
        icon: "https://cryptologos.cc/logos/avalanche-avax-logo.svg",
        color: "text-red-400",
      },
      250: {
        name: "Fantom",
        icon: "https://cryptologos.cc/logos/fantom-ftm-logo.svg",
        color: "text-blue-300",
      },
      42161: {
        name: "Arbitrum",
        icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg",
        color: "text-blue-500",
      },
      10: {
        name: "Optimism",
        icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg",
        color: "text-red-500",
      },
      8453: {
        name: "Base",
        icon: "https://www.coinbase.com/img/assets/crypto/base/base_logo.svg",
        color: "text-blue-600",
      },
      747: {
        name: "Flow",
        icon: "https://cdn.prod.website-files.com/5f734f4dbd95382f4fdfa0ea/67e1750c3eb15026e1ca6618_Flow_Icon_Color.svg",
        color: "text-green-500",
      },
      545: {
        name: "Flow",
        icon: "https://cdn.prod.website-files.com/5f734f4dbd95382f4fdfa0ea/67e1750c3eb15026e1ca6618_Flow_Icon_Color.svg",
        color: "text-green-500",
      },
    };
    return (
      chains[chainId as keyof typeof chains] || {
        name: "Unknown",
        icon: "https://cdn-icons-png.flaticon.com/512/4213/4213891.png",
        color: "text-gray-400",
      }
    );
  };

  const chainInfo = getChainInfo(chainId);

  const login = () => {
    if (ready && !authenticated) {
      privyLogin();
    }
  };

  const startReading = () => {
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
  };

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
            <h1 className="text-lg sm:text-2xl font-display text-white">
              Anon Reader
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {" "}
                    {address && (
                      <>
                        <div className="flex items-center  gap-2 bg-white/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                          {/* Chain icon */}
                          <Image
                            src={chainInfo.icon}
                            alt={chainInfo.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-full"
                            title={chainInfo.name}
                          />
                          {/* Balance */}
                          {balance && (
                            <span className="text-white text-xs sm:text-sm font-medium">
                              {parseFloat(balance.formatted).toFixed(2)}{" "}
                              {balance.symbol}
                            </span>
                          )}
                          <span
                            className="text-white text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[180px]"
                            title={address}
                          >
                            {address
                              ? `${address.slice(0, 6)}...${address.slice(-4)}`
                              : "Connected"}
                          </span>
                        </div>
                      </>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 border border-white/20 backdrop-blur-lg rounded-lg shadow-lg">
                    <DropdownMenuItem
                      onClick={logout}
                      className="border-white/40  text-white bg-black hover:text-white hover:bg-black/80 "
                      disabled={disableLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="outline"
                className="bg-primary text-white border-white/70 hover:text-white hover:bg-primary/90 text-sm sm:text-base px-2 sm:px-4"
                onClick={login}
              >
                Login
              </Button>
            )}
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
                  onClick={() => startReading()}
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

        {/* Comic Slider Section */}
        <ComicSlider />

        {/* CTA Section */}
        <section
          id="cta"
          className="w-full bg-morphic-dark/90 backdrop-blur-xl pt-24 px-8 md:px-16 z-10 relative overflow-hidden"
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
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-xl bg-transparent backdrop-blur-sm border-2 border-white/30 text-white text-lg hover:border-white/60 hover:bg-white/5 transition-all duration-300 hover:scale-105"
                onClick={() => router.push("/browse")}
              >
                Explore Library
              </Button>
            </div>
          </div>
          <div className="w-full  mx-auto text-center relative z-10">
            {/* Footer */}
            <Footer />
          </div>
        </section>
      </main>
    </div>
  );
}
