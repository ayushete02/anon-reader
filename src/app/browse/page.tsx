"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_COMICS } from "@/lib/mock-data";
import { Comic, UserPersona } from "@/lib/types";
import { filterComicsByPersona } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ComicRow from "@/components/ComicRow";
import ComicCard from "@/components/ComicCard";

const BrowsePage = () => {
  const [comics, setComics] = useState<Comic[]>(MOCK_COMICS);
  const [filteredComics, setFilteredComics] = useState<Comic[]>(MOCK_COMICS);
  const [userPersona, setUserPersona] = useState<Partial<UserPersona>>({});
  const [loading, setLoading] = useState(true);
  const [personaLoaded, setPersonaLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  // Get featured comic (highest rated one)
  const featuredComic = comics.sort((a, b) => b.rating - a.rating)[0];

  // Get all unique categories
  const allCategories = [
    "All",
    ...Array.from(new Set(MOCK_COMICS.flatMap((comic) => comic.categories))),
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
        MOCK_COMICS,
        userPersona as UserPersona
      );
      setComics(filteredByPersona);
    }
  }, [personaLoaded, userPersona]);

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
          return b.rating - a.rating;
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

  // Group comics by category
  const getComicsByCategory = (category: string) => {
    return filteredComics.filter((comic) =>
      comic.categories.includes(category)
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-morphic-dark text-white flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />
          <div className="absolute -inset-[500px] bg-[radial-gradient(circle_600px_at_0%_800px,rgba(93,93,255,0.07),transparent)] pointer-events-none" />
        </div>

        <div className="text-center flex-col justify-center relative z-10">
          <div className="relative flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl text-white/80 font-medium">
            Discovering amazing stories...
          </p>
        </div>
      </div>
    );
  }

  // Get personalized recommendations based on user persona
  const getPersonalizedRecommendations = () => {
    if (!personaLoaded || !userPersona.personaType) {
      // If no persona, return top-rated comics
      return MOCK_COMICS.sort((a, b) => b.rating - a.rating).slice(0, 10);
    }

    // Filter and sort based on persona preferences
    const personalizedComics = filterComicsByPersona(
      MOCK_COMICS,
      userPersona as UserPersona
    );

    // Sort by rating and recency for better recommendations
    return personalizedComics
      .sort((a, b) => {
        const ratingDiff = b.rating - a.rating;
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

    return MOCK_COMICS.filter(
      (comic) => new Date(comic.releaseDate) >= thirtyDaysAgo
    )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  };

  const personalizedComics = getPersonalizedRecommendations();
  const trendingComics = getTrendingComics();

  return (
    <div className="min-h-screen bg-morphic-dark text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />
        <div className="absolute -inset-[500px] bg-[radial-gradient(circle_600px_at_0%_800px,rgba(93,93,255,0.07),transparent)] pointer-events-none" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute -bottom-8 right-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-24 left-24 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <Navbar />
      {featuredComic && <HeroBanner comic={featuredComic} />}

      <main className="max-w-[90rem] mx-auto px-4 pt-8 pb-20 relative z-10">
        {/* Quick Stats Bar */}
        <div className="mb-8">
          <div className="morphic-glass rounded-2xl border border-white/5 p-6 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {comics.length}
                </div>
                <div className="text-sm text-white/60">Total Comics</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {allCategories.length - 1}
                </div>
                <div className="text-sm text-white/60">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-400/70 bg-clip-text text-transparent">
                  {comics.filter((c) => c.rating >= 4.5).length}
                </div>
                <div className="text-sm text-white/60">Top Rated</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-400/70 bg-clip-text text-transparent">
                  {
                    comics.filter(
                      (c) =>
                        new Date(c.releaseDate) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
                <div className="text-sm text-white/60">New This Month</div>
              </div>
            </div>
          </div>
        </div>
        {/* Quick Category Pills */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-bold text-white">Quick Browse</h3>
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary"
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
          </div>
          <div className="flex flex-wrap gap-3">
            {allCategories.slice(0, 6).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary/20 text-white border border-primary/30 shadow-lg shadow-primary/25"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 hover:border-white/20"
                }`}
              >
                {category}
              </button>
            ))}
            {allCategories.length > 6 && (
              <button className="px-4 py-2 bg-white/5 text-white/60 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300">
                +{allCategories.length - 6} more
              </button>
            )}
          </div>
        </div>
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="morphic-glass rounded-2xl border border-white/5 p-8 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-white/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search comics, categories, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                >
                  {allCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-morphic-dark"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
                >
                  <option value="rating" className="bg-morphic-dark">
                    Top Rated
                  </option>
                  <option value="newest" className="bg-morphic-dark">
                    Newest
                  </option>
                  <option value="oldest" className="bg-morphic-dark">
                    Classic
                  </option>
                  <option value="title" className="bg-morphic-dark">
                    A-Z
                  </option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory !== "All") && (
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-sm text-white/40">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-white rounded-full text-sm border border-primary/30">
                    Search: &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-white/80 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-white rounded-full text-sm border border-blue-500/30">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="ml-1 hover:text-white/80 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Results Summary */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-2">
              {searchQuery || selectedCategory !== "All"
                ? `Found ${filteredComics.length} comics`
                : "Browse Comics"}
            </h2>
            <p className="text-white/60">
              {searchQuery || selectedCategory !== "All"
                ? "Based on your search criteria"
                : "Discover your next favorite story"}
            </p>
          </div>
          <div className="text-sm text-white/40 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            {filteredComics.length} of {comics.length} comics
          </div>
        </div>{" "}
        {/* Content Sections */}
        {searchQuery || selectedCategory !== "All" ? (
          /* Filtered Results */
          <div className="space-y-8">
            {filteredComics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredComics.map((comic) => (
                  <div key={comic.id} className="animate-fadeIn">
                    <ComicCard comic={comic} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.06 2.378l-.896-.897a9.002 9.002 0 0113.912 0l-.896.897A7.962 7.962 0 0112 15z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No comics found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or filters to find more
                  comics.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 rounded-2xl border border-orange-600/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <h3 className="text-xl font-bold text-white">Trending Now</h3>
                  <p className="text-sm text-gray-400">
                    Most popular comics this week
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="flex items-center gap-1 text-orange-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Hot
                  </div>
                </div>{" "}
                <ComicRow title="" comics={trendingComics} showCount={false} />
              </div>{" "}
              {personaLoaded && userPersona.personaType && (
                <div className="bg-gradient-to-r from-red-600/10 via-purple-600/10 to-red-600/10 rounded-2xl border border-red-600/20 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/5 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/25">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            Recommended for You
                          </h3>
                          <p className="text-sm text-gray-400">
                            Curated based on your
                            <span className="text-red-400 font-medium">
                              {userPersona.personaType}
                            </span>
                            preferences
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-red-600/20 px-3 py-2 rounded-lg border border-red-600/30">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-red-400 text-sm font-medium">
                            {userPersona.personaType}
                          </span>
                        </div>

                        <Link
                          href="/onboarding"
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600"
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
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Adjust Preferences
                        </Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-red-600/10 rounded-lg p-3 border border-red-600/20">
                        <div className="text-lg font-bold text-white">
                          {comics.length}
                        </div>
                        <div className="text-xs text-gray-400">
                          Matched Comics
                        </div>
                      </div>
                      <div className="bg-purple-600/10 rounded-lg p-3 border border-purple-600/20">
                        <div className="text-lg font-bold text-white">
                          {Math.round(
                            (comics.reduce(
                              (acc, comic) => acc + comic.rating,
                              0
                            ) /
                              comics.length) *
                              10
                          ) / 10}
                        </div>
                        <div className="text-xs text-gray-400">Avg Rating</div>
                      </div>{" "}
                      <div className="bg-blue-600/10 rounded-lg p-3 border border-blue-600/20">
                        <div className="text-lg font-bold text-white">
                          {userPersona.vibes?.length || 0}
                        </div>
                        <div className="text-xs text-gray-400">Vibes</div>
                      </div>
                      <div className="bg-green-600/10 rounded-lg p-3 border border-green-600/20">
                        <div className="text-lg font-bold text-white">98%</div>
                        <div className="text-xs text-gray-400">Match Score</div>
                      </div>
                    </div>
                    <div className="mb-6 p-4 bg-gray-900/30 rounded-lg border border-gray-800/50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <svg
                            className="w-4 h-4 text-blue-400"
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
                          <h4 className="text-white font-medium mb-1">
                            Why these recommendations?
                          </h4>{" "}
                          <p className="text-gray-400 text-sm leading-relaxed">
                            Based on your {userPersona.personaType} persona,
                            we&apos;ve selected comics that match your
                            preferences for{" "}
                            {userPersona.vibes?.slice(0, 2).join(" and ") ||
                              "your preferred vibes"}
                            . These stories are curated to provide the perfect
                            balance of entertainment and engagement for your
                            reading style.
                          </p>
                        </div>
                      </div>
                    </div>{" "}
                    <ComicRow
                      title=""
                      comics={personalizedComics}
                      showCount={false}
                    />
                  </div>
                </div>
              )}
              {(!personaLoaded || !userPersona.personaType) && (
                <div className="bg-gradient-to-r from-gray-800/10 via-slate-700/10 to-gray-800/10 rounded-2xl border border-gray-600/20 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-600/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-600/5 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl flex items-center justify-center shadow-lg shadow-gray-600/25">
                          <svg
                            className="w-6 h-6 text-white"
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
                          <h3 className="text-2xl font-bold text-white">
                            For You
                          </h3>
                          <p className="text-sm text-gray-400">
                            Top-rated comics to get you started
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href="/onboarding"
                          className="flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-300"
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
                          <span className="text-sm font-medium">
                            Get Personalized
                          </span>
                        </Link>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-gray-900/30 rounded-lg border border-gray-800/50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <svg
                            className="w-4 h-4 text-blue-400"
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
                          <h4 className="text-white font-medium mb-1">
                            Want better recommendations?
                          </h4>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            Complete our quick personality quiz to get comics
                            tailored specifically to your tastes and reading
                            preferences.
                            <Link
                              href="/onboarding"
                              className="text-red-400 hover:text-red-300 ml-1 underline"
                            >
                              Take the quiz
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>

                    <ComicRow
                      title=""
                      comics={personalizedComics}
                      showCount={false}
                    />
                  </div>
                </div>
              )}
              {allCategories.slice(1).map((category, index) => {
                const categoryComics = getComicsByCategory(category);
                if (categoryComics.length === 0) return null;

                const categoryColors = [
                  "from-blue-600/10 to-cyan-600/10 border-blue-600/20",
                  "from-green-600/10 to-emerald-600/10 border-green-600/20",
                  "from-purple-600/10 to-violet-600/10 border-purple-600/20",
                  "from-yellow-600/10 to-orange-600/10 border-yellow-600/20",
                  "from-pink-600/10 to-rose-600/10 border-pink-600/20",
                  "from-indigo-600/10 to-blue-600/10 border-indigo-600/20",
                ];

                return (
                  <div
                    key={category}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`bg-gradient-to-r ${
                        categoryColors[index % categoryColors.length]
                      } rounded-2xl border p-6`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">
                            {category}
                          </h3>
                          <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                            {categoryComics.length} comics
                          </span>
                        </div>
                        <button className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors">
                          View All
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
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                      <ComicRow
                        title=""
                        comics={categoryComics}
                        showCount={false}
                      />
                    </div>
                  </div>
                );
              })}{" "}
              <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                    Can&apos;t find what you&apos;re looking for?
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                    Create your own amazing stories with our AI-powered comic
                    generator, or explore more personalized recommendations.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                      <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-5 h-5 text-red-400"
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
                      <h4 className="text-white font-semibold mb-2">
                        Create Stories
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Use AI to generate unique comics from your ideas
                      </p>
                    </div>

                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                      <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-5 h-5 text-purple-400"
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
                      <h4 className="text-white font-semibold mb-2">
                        Get Recommendations
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Improve your personalized comic suggestions
                      </p>
                    </div>

                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-white font-semibold mb-2">
                        Advanced Search
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Find comics by genre, style, or theme
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/producer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
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
                      Create Your Story
                    </Link>
                    <Link
                      href="/onboarding"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
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
                      Improve Recommendations
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowsePage;
