"use client";

import ComicCard from "@/components/ComicCard";
import ComicRow from "@/components/ComicRow";
import { CONTRACT_ABI } from "@/components/contract/contractDetails";
import HeroBanner from "@/components/HeroBanner";
import Navbar from "@/components/Navbar";
import { Comic, UserPersona } from "@/lib/types";
import { filterComicsByPersona } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Abi } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

const BrowsePage = () => {
  const { login: privyLogin } = usePrivy();

  const [comics, setComics] = useState<Comic[]>([]);
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);
  const [userPersona, setUserPersona] = useState<Partial<UserPersona>>({});
  const [loading, setLoading] = useState(true);
  const [comicsLoading, setComicsLoading] = useState(true);
  const [personaLoaded, setPersonaLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy] = useState("rating");
  const [allComics, setAllComics] = useState<Comic[]>([]);

  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  console.log("contractAddress ;", contractAddress);
  const { data: numberOfStories } = useReadContract({
    abi: CONTRACT_ABI,
    address: contractAddress,
    functionName: "totalStories",
  });

  console.log("numberOfStories ;", numberOfStories);

  const contractCalls = Array.from({ length: Number(numberOfStories) }).map(
    (_, index) => ({
      abi: CONTRACT_ABI as Abi,
      address: contractAddress,
      functionName: "getStory",
      args: [index + 1],
    })
  );

  console.log("contractCalls ;", contractCalls);

  const { data: stories, isLoading: storiesLoading } = useReadContracts({
    contracts: contractCalls,
  });

  console.log("stories ;", stories);

  // Load comics from blockchain contract only
  useEffect(() => {
    const loadComics = async () => {
      setComicsLoading(true);
      let combinedComics: Comic[] = [];

      // Load stories from blockchain if available
      if (stories && stories.length > 0) {
        try {
          const blockchainComics = await Promise.all(
            stories
              .filter((story) => story.status === "success" && story.result) // Only process successful calls
              .map(async (story, index) => {
                try {
                  // Updated destructuring to match the actual contract response structure
                  const {
                    id: storyId,
                    cid: ipfsCid,
                    publishedAt: createdAt,
                  } = story.result as {
                    id: bigint;
                    cid: string;
                    publishedAt: bigint;
                    writer: string;
                  };

                  // Handle different CID formats - some might be full URLs, others just CIDs
                  let lighthouseCid = ipfsCid;
                  if (ipfsCid.includes("gateway.lighthouse.storage/ipfs/")) {
                    // Extract CID from full URL
                    lighthouseCid = ipfsCid.split("/ipfs/")[1];
                  } else if (ipfsCid.includes("ipfs/")) {
                    // Extract CID from partial URL
                    lighthouseCid = ipfsCid.split("ipfs/")[1];
                  }

                  // Fetch story data from Lighthouse using the IPFS CID
                  const response = await fetch(
                    `https://gateway.lighthouse.storage/ipfs/${lighthouseCid}`
                  );
                  if (!response.ok) {
                    throw new Error(
                      `Failed to fetch story data for CID: ${lighthouseCid}`
                    );
                  }

                  const storyData = await response.json();

                  // Convert to Comic format
                  const blockchainComic: Comic = {
                    id: `blockchain-${storyId.toString()}`,
                    title: storyData.title || `Story ${storyId.toString()}`,
                    description:
                      storyData.description || "A story from the blockchain",
                    posterImage: "/comics/placeholder.jpg", // Default poster
                    categories: storyData.categories || ["Blockchain"],
                    type: storyData.type || "text",
                    releaseDate: new Date(
                      Number(createdAt) * 1000
                    ).toISOString(),
                    popularity: Math.floor(Math.random() * 100),
                    rating: (4 + Math.random()).toFixed(1), // String format
                    // Use new unified format
                    chapters: storyData.chapters || [],
                    characters: storyData.characters || [],
                    blockchainCid: lighthouseCid,
                    publishedAt: new Date(
                      Number(createdAt) * 1000
                    ).toISOString(),
                  };

                  return blockchainComic;
                } catch (error) {
                  console.error(
                    `Error processing blockchain story ${index}:`,
                    error
                  );
                  return null; // Return null for failed stories
                }
              })
          );

          // Filter out null values and add to combined comics
          const validBlockchainComics = blockchainComics.filter(
            (comic): comic is Comic => comic !== null
          );
          combinedComics = validBlockchainComics;

          console.log(
            `Loaded ${validBlockchainComics.length} stories from blockchain`
          );
        } catch (error) {
          console.error("Error loading stories from blockchain:", error);
        }
      }

      setAllComics(combinedComics);
      setComics(combinedComics);
      setFilteredComics(combinedComics);
      setComicsLoading(false);
    };

    // Only load comics when we have contract data or when there are no stories
    if (
      !storiesLoading &&
      ((stories && stories.length > 0) || numberOfStories === BigInt(0))
    ) {
      loadComics();
    } else if (storiesLoading) {
      setComicsLoading(true);
    }
  }, [stories, storiesLoading, numberOfStories]);

  // Get all unique categories from all comics (including published)
  const allCategories = [
    "All",
    ...Array.from(new Set(allComics.flatMap((comic) => comic.categories))),
  ];

  // Load user persona from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPersona = localStorage.getItem("userPersona");
      if (savedPersona) {
        try {
          const persona = JSON.parse(savedPersona);
          setUserPersona(persona);
          setPersonaLoaded(true);
        } catch (error) {
          console.error("Error parsing user persona:", error);
        }
      }
      setLoading(false);
    }
  }, []);

  // Filter comics when persona is loaded
  useEffect(() => {
    if (personaLoaded && Object.keys(userPersona).length > 0) {
      const filteredByPersona = filterComicsByPersona(
        allComics,
        userPersona as UserPersona
      );
      setComics(filteredByPersona);
    } else {
      setComics(allComics);
    }
  }, [personaLoaded, userPersona, allComics]);

  // Apply filters and search
  useEffect(() => {
    let result = comics;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (comic) =>
          comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comic.categories.some((cat) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((comic) =>
        comic.categories.includes(selectedCategory)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "newest":
          return (
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredComics(result);
  }, [comics, searchQuery, selectedCategory, sortBy]);

  if (loading || comicsLoading || storiesLoading) {
    return (
      <div className="min-h-screen bg-morphic-dark text-white flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Background effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="text-center flex-col justify-center relative z-10">
          <div className="relative flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl text-white/80 font-medium">
            {storiesLoading || comicsLoading
              ? "Loading stories from blockchain..."
              : "Discovering amazing AI-powered stories..."}
          </p>
        </div>
      </div>
    );
  }

  // Get personalized recommendations based on user persona
  const getPersonalizedRecommendations = () => {
    if (!personaLoaded || !userPersona.personaType) {
      // If no persona, return top-rated comics
      return allComics
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        .slice(0, 10);
    }

    // Filter and sort based on persona preferences
    const personalizedComics = filterComicsByPersona(
      allComics,
      userPersona as UserPersona
    );

    // Sort by rating and recency for better recommendations
    return personalizedComics
      .sort((a, b) => {
        const ratingDiff = parseFloat(b.rating) - parseFloat(a.rating);
        const dateDiff =
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        return ratingDiff * 0.7 + (dateDiff / (1000 * 60 * 60 * 24)) * 0.3; // Weight rating more than recency
      })
      .slice(0, 10);
  };

  // Get trending comics (highest rated recent releases)
  const getTrendingComics = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return allComics
      .filter((comic) => new Date(comic.releaseDate) >= thirtyDaysAgo)
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 8);
  };

  const personalizedComics = getPersonalizedRecommendations();
  const trendingComics = getTrendingComics();

  return (
    <div className="min-h-screen bg-morphic-dark text-white relative overflow-hidden">
      {/* Enhanced Background blur effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute -inset-[500px] bg-[radial-gradient(circle_600px_at_0%_800px,rgba(147,51,234,0.1),transparent)] pointer-events-none" />
      </div>

      <Navbar />

      {filteredComics.length > 0 && (
        <HeroBanner comics={filteredComics.slice(0, 5)} />
      )}

      <main className="max-w-[90rem] mx-auto px-3 sm:px-4 lg:px-6 pt-8 pb-20 relative z-10">
        {/* AI Recommendation Banner for users without persona */}
        {(!personaLoaded || !userPersona.personaType) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mb-8"
          >
            <div className="p-6 bg-morphic-dark/60 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:bg-morphic-dark/80">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/30">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2 text-lg">
                    🤖 Unlock AI-Powered Recommendations
                  </h4>
                  <p className="text-white/70 leading-relaxed mb-4">
                    Complete our intelligent personality quiz to get AI-powered
                    comic recommendations tailored specifically to your unique
                    reading preferences and storytelling taste.
                  </p>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 bg-primary/90 hover:bg-primary text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 backdrop-blur-sm"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Take AI Quiz
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* For You Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-col sm:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 backdrop-blur-sm border border-primary/30">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  🤖 AI Curated For You
                </h3>
                <p className="text-xs sm:text-sm text-white/60">
                  {!personaLoaded || !userPersona.personaType
                    ? "Top-rated comics to get you started"
                    : `Smart recommendations based on your ${userPersona.personaType} persona`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => privyLogin()}
                className="flex items-center gap-2 bg-primary/20 px-3 sm:px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/30 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <svg
                  className="w-4 h-4"
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
                <span className="text-xs sm:text-sm font-medium">
                  Get AI Recommendations
                </span>
              </motion.button>
            </div>
          </div>

          <ComicRow comics={personalizedComics} />
        </motion.div>

        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 backdrop-blur-sm border border-orange-500/30">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                🔥 Trending Now
              </h3>
              <p className="text-xs sm:text-sm text-white/60">
                AI-detected popular comics this month
              </p>
            </div>
          </div>
          <ComicRow comics={trendingComics} />
        </motion.div>

        {/* Quick Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="my-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Quick Browse
            </h3>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-morphic-gray/30 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/60 focus:border-primary/50 focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {allCategories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 w-fit whitespace-nowrap py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg flex-shrink-0 backdrop-blur-sm ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-gray-800/50 text-zinc-400 hover:bg-gray-700/50 border border-gray-700/50"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
        >
          {filteredComics.map((comic, index) => (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ComicCard comic={comic} />
            </motion.div>
          ))}
        </motion.div>

        {/* Create Your Story CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-600 to-blue-600"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              🤖 Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Create your own amazing stories with our AI-powered comic
              generator, or explore more personalized recommendations powered by
              machine learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/producer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25 backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                🤖 Create AI Story
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600 backdrop-blur-sm hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Improve AI Recommendations
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BrowsePage;
