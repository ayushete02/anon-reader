"use client";

import AuthGuard from "@/components/AuthGuard";
import { CONTRACT_ABI } from "@/components/contract/contractDetails";
import { Comic, GeneratedStory } from "@/lib/types";
import lighthouse from "@lighthouse-web3/sdk";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const GeneratedStoryViewerPage = () => {
  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [readingProgress, setReadingProgress] = useState<{
    [key: number]: boolean;
  }>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStage, setPublishingStage] = useState<
    "idle" | "uploading" | "blockchain" | "confirming" | "completed"
  >("idle");
  const [pendingLighthouseCid, setPendingLighthouseCid] = useState<
    string | null
  >(null);
  const imageViewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storyId = params.id as string;
    if (!storyId) {
      router.push("/browse");
      return;
    }

    // In a real app, this would fetch from an API or database
    // For now, we'll check localStorage for the generated story data
    const savedStories = localStorage.getItem("generatedStories");
    if (savedStories) {
      try {
        const stories = JSON.parse(savedStories);
        const foundStory = stories.find(
          (s: GeneratedStory) => s.id === storyId
        );
        if (foundStory) {
          setStory(foundStory);
        } else {
          router.push("/browse");
        }
      } catch (error) {
        console.error("Error loading story:", error);
        router.push("/browse");
      }
    } else {
      router.push("/browse");
    }

    setLoading(false);
  }, [params.id, router]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && pendingLighthouseCid && story) {
      console.log("Transaction confirmed! Story published successfully.");

      // Convert GeneratedStory to Comic format for browse page
      const publishedComic: Comic = {
        id: story.id,
        title: story.title,
        description: story.description,
        posterImage: story.posterImage || "/comics/placeholder.jpg",
        categories: story.categories,
        type: story.type,
        releaseDate: story.created_at,
        popularity: Math.floor(Math.random() * 100), // Random popularity
        rating: (4 + Math.random()).toFixed(1), // Rating as string
        // Use new unified format
        chapters: story.chapters,
        characters: story.characters,
        blockchainCid: pendingLighthouseCid, // Store the Lighthouse CID
        publishedAt: new Date().toISOString(),
        createdBy: story.createdBy,
      };

      // Save to published stories in localStorage (for now - until we fully migrate)
      const publishedStories = localStorage.getItem("publishedStories");
      let stories = [];

      if (publishedStories) {
        try {
          stories = JSON.parse(publishedStories);
        } catch (error) {
          console.error("Error parsing published stories:", error);
          stories = [];
        }
      }

      // Add the new story to published stories
      stories.push(publishedComic);
      localStorage.setItem("publishedStories", JSON.stringify(stories));

      // Update the current story status to published and add Lighthouse CID
      const updatedStory = {
        ...story,
        status: "published" as const,
        lighthouseCid: pendingLighthouseCid,
        publishedAt: new Date().toISOString(),
      };
      setStory(updatedStory);

      // Update the story in generatedStories as well
      const savedStories = localStorage.getItem("generatedStories");
      if (savedStories) {
        try {
          const generatedStories = JSON.parse(savedStories);
          const updatedStories = generatedStories.map((s: GeneratedStory) =>
            s.id === story.id ? updatedStory : s
          );
          localStorage.setItem(
            "generatedStories",
            JSON.stringify(updatedStories)
          );
        } catch (error) {
          console.error("Error updating generated stories:", error);
        }
      }

      // Reset publishing state
      setIsPublishing(false);
      setPublishingStage("completed");
      setPendingLighthouseCid(null);
    }
  }, [isConfirmed, pendingLighthouseCid, story]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError && isPublishing) {
      console.error("Blockchain transaction failed:", writeError);
      setIsPublishing(false);
      setPublishingStage("idle");
      setPendingLighthouseCid(null);
    }
  }, [writeError, isPublishing]);

  const handleChapterToggle = (chapterNumber: number) => {
    const newExpandedChapter =
      expandedChapter === chapterNumber ? null : chapterNumber;
    setExpandedChapter(newExpandedChapter);

    // If opening a chapter and it's an image story, scroll to the corresponding image
    if (newExpandedChapter && story?.type === "image") {
      const imageIndex = story.chapters.findIndex(
        (chapter) => chapter.chapter_number === chapterNumber
      );
      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
        // Use setTimeout to ensure the DOM is ready
        setTimeout(() => {
          scrollToImage(chapterNumber);
        }, 100);
      }
    }
  };

  const handleImageScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.target as HTMLDivElement;
    const scrollTop = container.scrollTop;
    const pageHeight = container.clientHeight;
    const newImageIndex = Math.round(scrollTop / pageHeight);

    if (newImageIndex !== currentImageIndex && story?.chapters) {
      setCurrentImageIndex(newImageIndex);
      // Auto-expand the corresponding chapter
      const correspondingChapter = story.chapters[newImageIndex];
      if (correspondingChapter) {
        setExpandedChapter(correspondingChapter.chapter_number);
      }
    }
  };

  const scrollToImage = (chapterNumber: number) => {
    if (imageViewerRef.current && story?.chapters) {
      const imageIndex = story.chapters.findIndex(
        (chapter) => chapter.chapter_number === chapterNumber
      );
      if (imageIndex !== -1) {
        const container = imageViewerRef.current.querySelector(
          ".instagram-scroll"
        ) as HTMLElement;
        if (container) {
          const pageHeight = container.clientHeight;
          container.scrollTo({
            top: imageIndex * pageHeight,
            behavior: "smooth",
          });
          // Update the current image index immediately
          setCurrentImageIndex(imageIndex);
        }
      }
    }
  };

  const markChapterAsRead = (chapterNumber: number) => {
    setReadingProgress((prev) => ({
      ...prev,
      [chapterNumber]: true,
    }));
  };

  const formatReadingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min read`;
  };

  const navigateToChapter = (direction: "next" | "previous") => {
    if (!story?.chapters || !expandedChapter) return;

    const currentIndex = story.chapters.findIndex(
      (ch) => ch.chapter_number === expandedChapter
    );
    let newIndex;

    if (direction === "next" && currentIndex < story.chapters.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === "previous" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return; // No navigation possible
    }

    const newChapter = story.chapters[newIndex];
    setExpandedChapter(newChapter.chapter_number);

    // For image stories, also scroll to the corresponding image
    if (story.type === "image") {
      setCurrentImageIndex(newIndex);
      scrollToImage(newChapter.chapter_number);
    }
  };

  const handleBack = () => {
    router.push("/producer");
  };

  const publishStoryToBlockchain = async (lighthouseCid: string) => {
    try {
      console.log("Publishing to blockchain with CID:", lighthouseCid);
      writeContract({
        abi: CONTRACT_ABI,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        functionName: "publishStory",
        args: [lighthouseCid],
      });
    } catch (error) {
      console.error("Error calling writeContract:", error);
      throw error;
    }
  };

  const handlePublishStory = async () => {
    if (!story) return;

    setIsPublishing(true);
    setPublishingStage("uploading");

    try {
      // Prepare story data for Lighthouse upload
      const storyData = {
        id: story.id,
        title: story.title,
        description: story.description,
        chapters: story.chapters,
        characters: story.characters,
        categories: story.categories,
        type: story.type,
        created_at: story.created_at,
      };

      // Upload story data to Lighthouse
      console.log("Uploading story to Lighthouse...");
      const lighthouseResponse = await lighthouse.uploadText(
        JSON.stringify(storyData),
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
        story.title
      );

      if (!lighthouseResponse.data?.Hash) {
        throw new Error("Failed to get IPFS hash from Lighthouse response");
      }

      const lighthouseCid = lighthouseResponse.data.Hash;
      console.log("Story uploaded to Lighthouse with CID:", lighthouseCid);

      // Store the CID and initiate blockchain transaction
      setPendingLighthouseCid(lighthouseCid);
      setPublishingStage("blockchain");

      // Publish to blockchain (will trigger confirmation waiting)
      await publishStoryToBlockchain(lighthouseCid);
      setPublishingStage("confirming");

      console.log(
        "Blockchain transaction submitted, waiting for confirmation..."
      );
    } catch (error) {
      console.error("Error publishing story:", error);
      setIsPublishing(false);
      setPublishingStage("idle");
      setPendingLighthouseCid(null);

      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes("Lighthouse")) {
          console.error("Lighthouse upload failed:", error.message);
        } else if (error.message.includes("blockchain")) {
          console.error("Blockchain publishing failed:", error.message);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-morphic-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary/50 mx-auto mb-4"></div>
          <p className="text-xl text-white/80">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-morphic-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-primary/20 border border-primary/30 rounded-xl text-white hover:bg-primary/30 transition-all duration-150"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const completedChapters = Object.keys(readingProgress).filter(
    (key) => readingProgress[parseInt(key)]
  ).length;
  const progressPercentage = (completedChapters / story.chapters.length) * 100;

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-morphic-dark text-white relative overflow-hidden">
        {/* Enhanced glossy background effects */}
        <div className="absolute inset-0">
          <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />
          <div className="absolute -inset-[500px] bg-[radial-gradient(circle_600px_at_0%_800px,rgba(93,93,255,0.07),transparent)] pointer-events-none" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute -bottom-8 right-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute bottom-24 left-24 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        {/* Top Navigation Bar */}
        <nav className="fixed w-full z-20 bg-morphic-gray/30 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="group flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300"
                >
                  <div className="p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl group-hover:bg-white/10 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  <span className="font-medium">Back to Creator</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">
                    Story Review: {story.title}
                  </h1>
                  <p className="text-white/60 text-sm">
                    {story.chapters.length} chapters •{" "}
                    {story.type === "text" ? "Text Story" : "Visual Story"} •
                    Review before publishing
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-white/60">
                  {completedChapters} / {story.chapters.length} chapters
                </div>
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/50 backdrop-blur-xl transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-primary">
                  {Math.round(progressPercentage)}%
                </div>

                {/* Publish Button */}
                {story.status !== "published" && (
                  <button
                    onClick={handlePublishStory}
                    disabled={isPublishing || isConfirming}
                    className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30 hover:border-green-500/40 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isPublishing || isConfirming ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {publishingStage === "uploading" &&
                          "Uploading to IPFS..."}
                        {publishingStage === "blockchain" &&
                          "Sending to blockchain..."}
                        {(publishingStage === "confirming" || isConfirming) &&
                          "Waiting for confirmation..."}
                        {publishingStage === "idle" && "Publishing..."}
                      </div>
                    ) : (
                      "Publish Story"
                    )}
                  </button>
                )}

                {story.status === "published" && (
                  <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium">
                    ✓ Published
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mt-20 container mx-auto px-6 py-8 relative z-10">
          <div className="flex gap-6">
            {/* Left Side - Main Content */}
            <div className="flex-1 ">
              {/* Story Info Section */}
              <div className="bg-morphic-gray/30 backdrop-blur-xl border  border-white/5 rounded-3xl p-8 mb-8 shadow-glossy">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-white mb-4 font-display">
                      Story Description
                    </h2>
                    <p className="text-white/80 leading-relaxed mb-6">
                      {story.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {story.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium backdrop-blur-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 font-display">
                      Characters ({story.characters.length})
                    </h3>
                    <div className="space-y-3">
                      {story.characters.slice(0, 3).map((character) => (
                        <div
                          key={character.id}
                          className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3"
                        >
                          <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                            {character.image_url ? (
                              <Image
                                src={character.image_url}
                                alt={character.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/40">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm truncate">
                              {character.name}
                            </h4>
                            <span className="text-xs text-white/60 capitalize">
                              {character.type.replace("-", " ")}
                            </span>
                          </div>
                        </div>
                      ))}
                      {story.characters.length > 3 && (
                        <div className="text-center">
                          <span className="text-sm text-white/60">
                            +{story.characters.length - 3} more characters
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapters Accordion */}
              <div className="bg-morphic-gray/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-glossy">
                <h2 className="text-2xl font-bold text-white mb-6 font-display">
                  Story Chapters
                </h2>

                <div className="space-y-4">
                  {story.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-glossy"
                    >
                      {/* Chapter Header */}
                      <button
                        onClick={() =>
                          handleChapterToggle(chapter.chapter_number)
                        }
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all duration-150"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              readingProgress[chapter.chapter_number]
                                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                                : "bg-primary/20 border border-primary/30 text-primary"
                            }`}
                          >
                            {readingProgress[chapter.chapter_number] ? (
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              chapter.chapter_number
                            )}
                          </div>
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-white">
                              {chapter.title}
                            </h3>
                            <p className="text-sm text-white/60">
                              {formatReadingTime(chapter.reading_time_seconds)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <svg
                            className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                              expandedChapter === chapter.chapter_number
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Chapter Content */}
                      {expandedChapter === chapter.chapter_number && (
                        <div className="px-6 pb-6 animate-fadeIn">
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            {/* For text stories, show a note that content is displayed in the right panel */}
                            {story.type === "text" ? (
                              <div className="text-center py-8">
                                <div className="flex items-center justify-center mb-4">
                                  <svg
                                    className="w-8 h-8 text-primary/60"
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
                                <p className="text-white/60 text-sm">
                                  Chapter content is displayed in the right
                                  panel →
                                </p>
                                <p className="text-white/40 text-xs mt-2">
                                  Scroll through the text content on the right
                                  side
                                </p>
                              </div>
                            ) : (
                              /* For image stories, show the text content */
                              <div className="prose prose-invert max-w-none">
                                <div className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm">
                                  {chapter.content}
                                </div>
                              </div>
                            )}

                            {!readingProgress[chapter.chapter_number] && (
                              <div className="mt-6 pt-4 border-t border-white/10">
                                <button
                                  onClick={() =>
                                    markChapterAsRead(chapter.chapter_number)
                                  }
                                  className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-primary hover:bg-primary/30 hover:border-primary/40 transition-all duration-150 text-sm font-medium"
                                >
                                  Mark as Read
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Publishing Section */}
              <div className="mt-8">
                {story.status === "published" ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">
                      Story Published Successfully!
                    </h3>
                    <p className="text-white/80 mb-4">
                      Your story is now available for readers to discover and
                      enjoy.
                    </p>
                    <button
                      onClick={() => router.push("/browse")}
                      className="px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all duration-150"
                    >
                      View in Browse Page
                    </button>
                  </div>
                ) : (
                  <div className="bg-morphic-gray/30 backdrop-blur-xl border border-white/5 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Ready to Publish?
                      </h3>
                      <p className="text-white/70">
                        Review your story above and publish it to make it
                        available for all readers to discover and enjoy.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={handlePublishStory}
                        className="px-8 py-4 bg-primary/20 border border-primary/30 rounded-xl text-primary hover:bg-primary/30 hover:border-primary/40 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isPublishing || isConfirming}
                      >
                        {isPublishing || isConfirming ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary/50 mr-2"></div>
                            <span className="font-semibold">
                              {publishingStage === "uploading" &&
                                "Uploading to IPFS..."}
                              {publishingStage === "blockchain" &&
                                "Sending to blockchain..."}
                              {(publishingStage === "confirming" ||
                                isConfirming) &&
                                "Waiting for confirmation..."}
                              {publishingStage === "idle" && "Publishing..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                            <span className="font-semibold">Publish Story</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Content Viewer */}
            <div className="sticky top-6 h-fit w-[400px] flex-shrink-0">
              {story.type === "image" &&
              story.chapters.some((ch) => ch.image_url) ? (
                /* Image Viewer */
                <div className="bg-morphic-gray/30 backdrop-blur-xl w-[400px] md:fixed md:mr-6 border border-white/5 rounded-3xl p-8 shadow-glossy">
                  <div className="h-[calc(100vh-200px)]">
                    <div
                      ref={imageViewerRef}
                      className="h-full bg-black relative overflow-hidden rounded-3xl border border-white/10"
                    >
                      {/* Instagram-style vertical scroll container */}
                      <div
                        className="h-full overflow-y-auto instagram-scroll"
                        onScroll={handleImageScroll}
                      >
                        {story.chapters.map((chapter, index) => (
                          <div
                            key={chapter.id}
                            className="h-full w-full instagram-scroll-item flex items-center justify-center relative bg-black"
                          >
                            {/* Image container */}
                            <div className="relative w-full h-full flex items-center justify-center">
                              {chapter.image_url ? (
                                <Image
                                  src={chapter.image_url}
                                  alt={`${story.title} - Chapter ${chapter.chapter_number}`}
                                  fill
                                  className="object-contain"
                                  priority={
                                    index === currentImageIndex ||
                                    index === currentImageIndex + 1 ||
                                    index === currentImageIndex - 1
                                  }
                                  sizes="400px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/40">
                                  <div className="text-center">
                                    <svg
                                      className="w-12 h-12 mx-auto mb-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <p className="text-sm font-medium">
                                      No image
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Chapter overlay info */}
                            <div className="absolute top-4 left-4 right-4 z-10">
                              <div className="flex justify-between items-center">
                                {/* Chapter title */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                                  <h3 className="text-white text-sm font-medium truncate max-w-[200px]">
                                    {chapter.title}
                                  </h3>
                                </div>
                                {/* Chapter indicator */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                                  <span className="text-white text-xs font-medium">
                                    {chapter.chapter_number} /{" "}
                                    {story.chapters.length}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Instagram-style progress bar */}
                      <div className="absolute top-2 left-4 right-4 z-20">
                        <div className="flex gap-1">
                          {story.chapters.map((_, index) => (
                            <div
                              key={index}
                              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                            >
                              <div
                                className={`h-full bg-white transition-all duration-300 ${
                                  index < currentImageIndex
                                    ? "w-full"
                                    : index === currentImageIndex
                                    ? "w-full animate-pulse"
                                    : "w-0"
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Text Viewer */
                <div className="bg-morphic-gray/30 backdrop-blur-xl w-[400px] md:fixed md:mr-6 border border-white/5 rounded-3xl p-8 shadow-glossy">
                  <div className="h-[calc(100vh-200px)] flex flex-col">
                    {expandedChapter &&
                    story.chapters.find(
                      (ch) => ch.chapter_number === expandedChapter
                    ) ? (
                      <>
                        {/* Chapter Header */}
                        <div className="border-b border-white/10 pb-4 mb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center">
                              <span className="text-primary text-sm font-bold">
                                {expandedChapter}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                              {
                                story.chapters.find(
                                  (ch) => ch.chapter_number === expandedChapter
                                )?.title
                              }
                            </h3>
                          </div>
                          <p className="text-white/60 text-sm">
                            Chapter {expandedChapter} of {story.chapters.length}
                          </p>
                        </div>

                        {/* Scrollable Chapter Content */}
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5 mb-4">
                          <div className="prose prose-invert max-w-none">
                            <div className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm">
                              {
                                story.chapters.find(
                                  (ch) => ch.chapter_number === expandedChapter
                                )?.content
                              }
                            </div>
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                          <button
                            onClick={() => navigateToChapter("previous")}
                            disabled={
                              story.chapters.findIndex(
                                (ch) => ch.chapter_number === expandedChapter
                              ) === 0
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition-all duration-150"
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
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Previous
                          </button>

                          <div className="text-xs text-white/40">
                            {story.chapters.findIndex(
                              (ch) => ch.chapter_number === expandedChapter
                            ) + 1}{" "}
                            / {story.chapters.length}
                          </div>

                          <button
                            onClick={() => navigateToChapter("next")}
                            disabled={
                              story.chapters.findIndex(
                                (ch) => ch.chapter_number === expandedChapter
                              ) ===
                              story.chapters.length - 1
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition-all duration-150"
                          >
                            Next
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
                      </>
                    ) : (
                      /* Empty State */
                      <div className="h-full flex items-center justify-center text-white/40">
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <p className="text-sm font-medium mb-2">
                            Select a Chapter
                          </p>
                          <p className="text-xs text-white/30">
                            Click on any chapter to view its content here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default GeneratedStoryViewerPage;
