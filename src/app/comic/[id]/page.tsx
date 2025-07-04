"use client";

import ComicViewer from "@/components/ComicViewer";
import { useUser } from "@/context/UserContext";
import { Comic } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} from "@/components/contract/contractDetails";
import { useReadContract } from "wagmi";
import type { Abi } from "viem";

const ComicReaderPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = CONTRACT_ADDRESS as `0x${string}`;
  const comicId = params.id as string;

  // Get the story from the contract by ID
  const {
    data: contractStory,
    isLoading: contractLoading,
    error: contractError,
  } = useReadContract({
    abi: CONTRACT_ABI as Abi,
    address: contractAddress,
    functionName: "getStory",
    args: [BigInt(comicId?.replace("blockchain-", "") || "0")],
  });

  // Get reading progress if it exists
  const readingProgress = user?.history.find((h) => h.comicId === params.id);

  // On mount, load the comic by ID from contract
  useEffect(() => {
    const loadComic = async () => {
      if (!comicId) {
        router.push("/browse");
        return;
      }

      if (contractLoading) {
        setLoading(true);
        return;
      }

      if (contractError) {
        console.error("Contract error:", contractError);
        setError("Failed to load comic from blockchain");
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
            `Failed to fetch comic data for CID: ${lighthouseCid}`
          );
        }

        const storyData = await response.json();

        // Convert to Comic format
        const comicData: Comic = {
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
        console.log("Loaded comic data:", comicData);

        setComic(comicData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading comic:", error);
        setError("Failed to load comic content");
        setLoading(false);
      }
    };

    loadComic();
  }, [comicId, contractStory, contractLoading, contractError, router]);

  // Return button handler
  const handleReturn = () => {
    router.push(`/story/${params.id}`);
  };

  if (loading || !comic) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <p className="text-white/70">Loading comic from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-400 text-xl">⚠️</div>
          <h2 className="text-white text-lg font-semibold">
            Failed to Load Comic
          </h2>
          <p className="text-white/70">{error}</p>
          <button
            onClick={() => router.push("/browse")}
            className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-lg text-white hover:bg-primary/30 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Full screen comic viewer */}
      <div className="h-screen">
        {comic.title}
        <ComicViewer
          comic={comic}
          initialPage={readingProgress?.lastReadPage || 0}
        />
      </div>

      {/* Close button - goes back to story details */}
      <button
        onClick={handleReturn}
        className="absolute top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ComicReaderPage;
