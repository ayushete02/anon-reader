"use client";

import { useUser } from "@/context/UserContext";
import { Comic } from "@/lib/types";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

interface ComicViewerProps {
  comic: Comic;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const ComicViewer: React.FC<ComicViewerProps> = ({
  comic,
  initialPage = 0,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showControls, setShowControls] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const { user, updateUser } = useUser();

  // Determine if this is a text or image story
  const isTextStory = comic.type === "text";
  const isImageStory = comic.type === "image";
  // Get content based on story type
  const imagePages = comic.pages || [];
  const textChapters = useMemo(
    () => comic.textContent || [],
    [comic.textContent]
  );
  const totalPages = isTextStory
    ? textChapters.reduce(
        (total, chapter) => total + chapter.paragraphs.length,
        0
      )
    : imagePages.length;
  // Calculate current position for text stories
  const getCurrentTextPosition = useCallback(() => {
    let position = 0;
    for (let i = 0; i < currentChapter; i++) {
      position += textChapters[i].paragraphs.length;
    }
    position += currentParagraph;
    return position;
  }, [currentChapter, currentParagraph, textChapters]);
  // Toggle controls visibility
  const handleScreenTap = () => {
    setShowControls(!showControls);
    setTimeout(() => setShowControls(false), 3000);
  };

  // Navigation functions for text stories only
  const navigateNextText = () => {
    const currentChapterData = textChapters[currentChapter];
    if (currentParagraph < currentChapterData.paragraphs.length - 1) {
      setCurrentParagraph((prev) => prev + 1);
    } else if (currentChapter < textChapters.length - 1) {
      setCurrentChapter((prev) => prev + 1);
      setCurrentParagraph(0);
    }
  };

  const navigatePreviousText = () => {
    if (currentParagraph > 0) {
      setCurrentParagraph((prev) => prev - 1);
    } else if (currentChapter > 0) {
      setCurrentChapter((prev) => prev - 1);
      setCurrentParagraph(
        textChapters[currentChapter - 1].paragraphs.length - 1
      );
    }
  }; // Save reading progress
  const saveReadingProgress = useCallback(() => {
    if (!user || !comic) return;

    const currentPosition = isTextStory
      ? getCurrentTextPosition()
      : currentPage;
    const progress = Math.round(
      (currentPosition / Math.max(totalPages - 1, 1)) * 100
    );

    const historyItem = {
      comicId: comic.id,
      lastReadPage: currentPosition,
      lastReadAt: new Date().toISOString(),
      progress: Math.min(progress, 100),
    };

    const existingHistoryIndex = user.history.findIndex(
      (h) => h.comicId === comic.id
    );

    let newHistory;
    if (existingHistoryIndex >= 0) {
      newHistory = [...user.history];
      newHistory[existingHistoryIndex] = historyItem;
    } else {
      newHistory = [...user.history, historyItem];
    }

    updateUser({ history: newHistory });
  }, [
    user,
    comic,
    currentPage,
    isTextStory,
    totalPages,
    updateUser,
    getCurrentTextPosition,
  ]);

  // Auto-save reading progress
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveReadingProgress();
    }, 500);
    return () => clearTimeout(saveTimeout);
  }, [saveReadingProgress]);

  // Auto-scroll text into view
  useEffect(() => {
    if (isTextStory && textContainerRef.current) {
      const activeElement =
        textContainerRef.current.querySelector(".paragraph-active");
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentParagraph, currentChapter, isTextStory]);

  if (isTextStory) {
    const currentChapterData = textChapters[currentChapter];
    if (!currentChapterData) return null;
    return (
      <div
        ref={containerRef}
        className="h-full bg-gradient-to-br from-slate-950 via-gray-900 to-black relative overflow-hidden"
        onClick={handleScreenTap}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Header with chapter info */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentChapter + 1}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {currentChapterData.title}
                  </h2>
                  <p className="text-gray-400 text-sm">{comic.title}</p>
                </div>
              </div>

              {/* Reading progress circle */}
              <div className="relative w-16 h-16">
                <svg
                  className="w-16 h-16 transform -rotate-90"
                  viewBox="0 0 64 64"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={175.9}
                    strokeDashoffset={
                      175.9 *
                      (1 -
                        getCurrentTextPosition() / Math.max(totalPages - 1, 1))
                    }
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#E50914" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {Math.round(
                      (getCurrentTextPosition() / Math.max(totalPages - 1, 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Chapter progress bar */}
            <div className="flex gap-1">
              {currentChapterData.paragraphs.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-500 ${
                      index < currentParagraph
                        ? "w-full bg-gradient-to-r from-primary to-purple-600"
                        : index === currentParagraph
                        ? "w-full bg-gradient-to-r from-primary to-purple-600 animate-pulse"
                        : "w-0 bg-white/20"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced text content with better typography */}
        <div
          ref={textContainerRef}
          className="flex-grow instagram-scroll px-6 pb-32"
          onWheel={(e) => {
            // Handle wheel scrolling for text navigation
            if (Math.abs(e.deltaY) > 50) {
              e.preventDefault();
              if (e.deltaY > 0) {
                navigateNextText();
              } else {
                navigatePreviousText();
              }
            }
          }}
        >
          <div className="max-w-4xl mx-auto py-8 space-y-12">
            {currentChapterData.paragraphs.map((paragraph, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-700 transform ${
                  index === currentParagraph
                    ? "scale-105 translate-y-0"
                    : index < currentParagraph
                    ? "scale-95 -translate-y-2"
                    : "scale-95 translate-y-2"
                }`}
              >
                {/* Paragraph number indicator */}
                <div
                  className={`absolute -left-12 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    index === currentParagraph
                      ? "bg-gradient-to-br from-primary to-purple-600 text-white scale-110"
                      : index < currentParagraph
                      ? "bg-gray-600 text-gray-300"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                {/* Enhanced paragraph styling */}{" "}
                <div
                  className={`relative p-8 rounded-2xl transition-all duration-700 cursor-pointer ${
                    index === currentParagraph
                      ? "paragraph-active bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl shadow-primary/20 paragraph-glow"
                      : index < currentParagraph
                      ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                      : "bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setCurrentParagraph(index);
                  }}
                >
                  {/* Active paragraph glow effect */}
                  {index === currentParagraph && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl blur-xl -z-10 animate-pulse" />
                  )}
                  {/* Reading line indicator for active paragraph */}
                  {index === currentParagraph && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-600 rounded-r-full animate-pulse" />
                  )}{" "}
                  <p
                    className={`text-xl leading-relaxed font-light transition-all duration-500 reading-font text-shadow-reading ${
                      index === currentParagraph
                        ? "text-white"
                        : index < currentParagraph
                        ? "text-gray-300"
                        : "text-gray-400"
                    }`}
                    style={{
                      letterSpacing: "0.025em",
                      lineHeight: "1.8",
                    }}
                  >
                    {paragraph}
                  </p>
                  {/* Word count for active paragraph */}
                  {index === currentParagraph && (
                    <div className="absolute top-2 right-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded-full">
                      {paragraph.split(" ").length} words
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Chapter end indicator */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">
                  {currentChapter < textChapters.length - 1
                    ? "Scroll down for next chapter"
                    : "End of story"}
                </span>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced floating controls */}
        {showControls && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {/* Navigation panel */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-2xl">
                <div className="flex items-center gap-6">
                  {/* Chapter navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentChapter > 0) {
                          setCurrentChapter(currentChapter - 1);
                          setCurrentParagraph(0);
                        }
                      }}
                      disabled={currentChapter === 0}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
                    >
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <div className="text-center px-4">
                      <div className="text-white text-sm font-medium">
                        Chapter {currentChapter + 1} of {textChapters.length}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Paragraph {currentParagraph + 1} of{" "}
                        {currentChapterData.paragraphs.length}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentChapter < textChapters.length - 1) {
                          setCurrentChapter(currentChapter + 1);
                          setCurrentParagraph(0);
                        }
                      }}
                      disabled={currentChapter === textChapters.length - 1}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
                    >
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="w-px h-8 bg-white/20" />

                  {/* Paragraph navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigatePreviousText();
                      }}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                    >
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
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>

                    <span className="text-white/60 text-xs px-2">Navigate</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateNextText();
                      }}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
                    >
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="text-center mt-3 text-white/50 text-xs">
                  Tap paragraphs to jump • Scroll or use arrows to navigate
                </div>
              </div>
            </div>

            {/* Reading mode indicator */}
            <div className="absolute top-8 left-8 pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">
                  Reading Mode
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  // Image story rendering - Instagram-style scroll
  if (isImageStory && imagePages.length > 0) {
    return (
      <div
        ref={containerRef}
        className="h-full bg-black relative overflow-hidden"
        onClick={handleScreenTap}
      >
        {" "}
        {/* Instagram-style vertical scroll container */}
        <div
          className="h-full overflow-y-auto instagram-scroll"
          onScroll={(e) => {
            const container = e.target as HTMLDivElement;
            const scrollTop = container.scrollTop;
            const pageHeight = container.clientHeight;
            const newPage = Math.round(scrollTop / pageHeight);

            if (
              newPage !== currentPage &&
              newPage >= 0 &&
              newPage < imagePages.length
            ) {
              setCurrentPage(newPage);
              if (onPageChange) {
                onPageChange(newPage);
              }
            }
          }}
        >
          {imagePages.map((page, index) => (
            <div
              key={index}
              className="h-screen w-full instagram-scroll-item flex items-center justify-center relative bg-black"
            >
              {/* Image container */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={page.imageUrl}
                  alt={`${comic.title} - Page ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={
                    index === currentPage ||
                    index === currentPage + 1 ||
                    index === currentPage - 1
                  }
                  sizes="100vw"
                />
              </div>{" "}
              {/* Page overlay info */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex justify-between items-center">
                  {/* Story title */}
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                    <h3 className="text-white text-sm font-medium truncate max-w-[200px]">
                      {comic.title}
                    </h3>
                  </div>

                  {/* Page indicator */}
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">
                      {index + 1} / {imagePages.length}
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
            {imagePages.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    index < currentPage
                      ? "w-full"
                      : index === currentPage
                      ? "w-full animate-pulse"
                      : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Controls overlay */}
        {showControls && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {/* Navigation hints */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 pointer-events-auto">
                <div className="flex items-center gap-2 text-white/80 text-sm">
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
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  <span>Scroll to navigate</span>
                </div>
              </div>
            </div>

            {/* Jump to page controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const container = containerRef.current?.querySelector(
                      ".overflow-y-auto"
                    ) as HTMLDivElement;
                    if (container && currentPage > 0) {
                      container.scrollTo({
                        top: (currentPage - 1) * container.clientHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="pointer-events-auto bg-black/50 backdrop-blur-sm rounded-full p-2 text-white/70 hover:text-white hover:bg-black/70 transition-all duration-200"
                  disabled={currentPage === 0}
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
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const container = containerRef.current?.querySelector(
                      ".overflow-y-auto"
                    ) as HTMLDivElement;
                    if (container && currentPage < imagePages.length - 1) {
                      container.scrollTo({
                        top: (currentPage + 1) * container.clientHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="pointer-events-auto bg-black/50 backdrop-blur-sm rounded-full p-2 text-white/70 hover:text-white hover:bg-black/70 transition-all duration-200"
                  disabled={currentPage === imagePages.length - 1}
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback for stories without content
  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-4">{comic.title}</h2>
        <p className="text-gray-400">No content available for this story.</p>
      </div>
    </div>
  );
};

export default ComicViewer;
