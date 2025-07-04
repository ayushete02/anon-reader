"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Comic } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import { useAuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} from "@/components/contract/contractDetails";
import { useReadContract } from "wagmi";
import type { Abi } from "viem";

const StoryDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { requireAuth, LoginModal } = useAuthGuard();
  const [story, setStory] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = CONTRACT_ADDRESS as `0x${string}`;
  const storyId = params.id as string;

  // Get the story from the contract by ID
  const {
    data: contractStory,
    isLoading: contractLoading,
    error: contractError,
  } = useReadContract({
    abi: CONTRACT_ABI as Abi,
    address: contractAddress,
    functionName: "getStory",
    args: [BigInt(storyId?.replace("blockchain-", "") || "0")],
  });

  const readingProgress = user?.history.find((h) => h.comicId === params.id);

  useEffect(() => {
    const loadStory = async () => {
      if (!storyId) {
        router.push("/browse");
        return;
      }

      if (contractLoading) {
        setLoading(true);
        return;
      }

      if (contractError) {
        console.error("Contract error:", contractError);
        setError("Failed to load story from blockchain");
        setLoading(false);
        return;
      }

      if (!contractStory) {
        router.push("/browse");
        return;
      }

      try {
        // Destructure the contract story data
        const {
          id: contractStoryId,
          cid: ipfsCid,
          publishedAt: createdAt,
        } = contractStory as {
          id: bigint;
          cid: string;
          publishedAt: bigint;
          writer: string;
        };

        // Handle different CID formats
        let lighthouseCid = ipfsCid;
        if (ipfsCid.includes("gateway.lighthouse.storage/ipfs/")) {
          lighthouseCid = ipfsCid.split("/ipfs/")[1];
        } else if (ipfsCid.includes("ipfs/")) {
          lighthouseCid = ipfsCid.split("ipfs/")[1];
        }

        // Fetch story data from Lighthouse
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
        const storyComic: Comic = {
          id: `blockchain-${contractStoryId.toString()}`,
          title: storyData.title || `Story ${contractStoryId.toString()}`,
          description: storyData.description || "A story from the blockchain",
          posterImage: storyData.posterImage || "", // Use posterImage from storyData
          categories: storyData.categories || ["Blockchain"],
          type: storyData.type || "text",
          releaseDate: new Date(Number(createdAt) * 1000).toISOString(),
          popularity: Math.floor(Math.random() * 100),
          rating: (4 + Math.random()).toFixed(1), // String format
          // Use new unified format
          chapters: storyData.chapters || [],
          characters: storyData.characters || [],
          blockchainCid: lighthouseCid,
          publishedAt: new Date(Number(createdAt) * 1000).toISOString(),
        };

        setStory(storyComic);
        setLoading(false);
      } catch (error) {
        console.error("Error loading story:", error);
        setError("Failed to load story content");
        setLoading(false);
      }
    };

    loadStory();
  }, [storyId, contractStory, contractLoading, contractError, router]);

  const handlePlay = () => {
    requireAuth(() => {
      router.push(`/comic/${story?.id}`);
    });
  };

  const handleBack = () => {
    router.push("/browse");
  };

  if (loading || !story) {
    return (
      <div className="min-h-screen bg-morphic-dark flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-morphic-gray border-t-primary mx-auto"></div>
          <p className="text-white/70">Loading story from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-morphic-dark flex justify-center items-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-400 text-xl">⚠️</div>
          <h2 className="text-white text-lg font-semibold">
            Failed to Load Story
          </h2>
          <p className="text-white/70">{error}</p>
          <Button onClick={() => router.push("/browse")} variant="outline">
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-morphic-dark text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-20 left-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/3 to-purple-500/3 rounded-full blur-2xl" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 p-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 hover:bg-white/5"
        >
          <div className="p-1 bg-white/5 backdrop-blur-sm rounded-full group-hover:bg-white/10 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span className="font-medium text-sm">Back to Browse</span>
        </Button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Poster Section */}
            <div className="lg:col-span-2">
              <div className="relative group">
                {/* Glowing effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500" />

                <div className="relative">
                  <Image
                    src={story.posterImage}
                    alt={story.title}
                    width={400}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-glossy border border-white/10 group-hover:scale-102 transition-transform duration-500"
                  />
                  {/* Story Type Badge */}
                  <div className="absolute top-3 right-3">
                    <div
                      className={`px-3 py-1 rounded-full backdrop-blur-md border border-white/20 text-xs font-semibold ${
                        story.type === "text"
                          ? "bg-blue-500/40 text-white shadow-md shadow-blue-500/25"
                          : "bg-emerald-500/40 text-white shadow-md shadow-emerald-500/25"
                      }`}
                    >
                      {story.type === "text"
                        ? "📖 Text Story"
                        : "🎨 Visual Story"}
                    </div>
                  </div>
                  {/* Reading Progress Overlay */}
                  {readingProgress && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="morphic-glass rounded-md p-2 border border-white/20">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-white/70">
                            Progress
                          </span>
                          <span className="text-xs text-primary font-semibold">
                            {readingProgress.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1">
                          <div
                            className="bg-gradient-to-r from-primary to-purple-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${readingProgress.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title and Meta */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent leading-tight">
                    {story.title}
                  </h1>
                </div>
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3 text-white/80">
                  <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-md px-2 py-1 border border-white/10">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-xs">
                      {story.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-md px-2 py-1 border border-white/10">
                    <svg
                      className="w-4 h-4 text-white/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs">
                      {new Date(story.releaseDate).getFullYear()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-md px-2 py-1 border border-white/10">
                    <svg
                      className="w-4 h-4 text-green-400"
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
                    <span className="text-xs">{story.popularity}% Match</span>
                  </div>
                </div>
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {story.categories.map((category, index) => (
                    <span
                      key={category}
                      className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 transition-all duration-300 ${
                        index % 3 === 0
                          ? "bg-primary/20 text-primary"
                          : index % 3 === 1
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  Story Description
                </h2>
                <div className="morphic-glass rounded-lg p-4 border border-white/10 shadow-glossy">
                  <p className="text-white/90 leading-relaxed text-sm">
                    {story.description}
                  </p>
                </div>
              </div>
              {/* Action Button */}
              <div className="pt-2">
                <Button onClick={handlePlay} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5h10a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {readingProgress ? "Continue Reading" : "Start Reading"}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal />
    </div>
  );
};

export default StoryDetailPage;
