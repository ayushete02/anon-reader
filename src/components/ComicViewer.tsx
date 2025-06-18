"use client";

import { useUser } from "@/context/UserContext";
import { Comic } from "@/lib/types";
import Image from "next/image";
import React, {
  TouchEvent,
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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
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

  // Handle touch events for navigation
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe up - go to next page/paragraph
      navigateNext();
    } else if (touchStart - touchEnd < -100) {
      // Swipe down - go to previous page/paragraph
      navigatePrevious();
    }

    // Show controls temporarily when tapping
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  // Handle wheel event for mouse scrolling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (autoScrollActive) return;
    if (Math.abs(e.deltaY) < 50) return;

    if (e.deltaY > 0) {
      setAutoScrollActive(true);
      navigateNext();
      setTimeout(() => setAutoScrollActive(false), 500);
    } else if (e.deltaY < 0) {
      setAutoScrollActive(true);
      navigatePrevious();
      setTimeout(() => setAutoScrollActive(false), 500);
    }
  };

  // Toggle controls visibility
  const handleScreenTap = () => {
    setShowControls(!showControls);
    setTimeout(() => setShowControls(false), 3000);
  };

  // Navigation functions
  const navigateNext = () => {
    if (isTextStory) {
      const currentChapterData = textChapters[currentChapter];
      if (currentParagraph < currentChapterData.paragraphs.length - 1) {
        setCurrentParagraph((prev) => prev + 1);
      } else if (currentChapter < textChapters.length - 1) {
        setCurrentChapter((prev) => prev + 1);
        setCurrentParagraph(0);
      }
    } else {
      navigateToPage(currentPage + 1);
    }
  };

  const navigatePrevious = () => {
    if (isTextStory) {
      if (currentParagraph > 0) {
        setCurrentParagraph((prev) => prev - 1);
      } else if (currentChapter > 0) {
        setCurrentChapter((prev) => prev - 1);
        setCurrentParagraph(
          textChapters[currentChapter - 1].paragraphs.length - 1
        );
      }
    } else {
      navigateToPage(currentPage - 1);
    }
  };

  const navigateToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < imagePages.length) {
      setCurrentPage(pageIndex);
      if (onPageChange) {
        onPageChange(pageIndex);
      }
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
        className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={handleScreenTap}
      >
        {/* Chapter Title */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            {currentChapterData.title}
          </h2>
        </div>

        {/* Text Content */}
        <div
          ref={textContainerRef}
          className="flex-grow px-6 pb-20 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {currentChapterData.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed transition-all duration-500 ${
                  index === currentParagraph
                    ? "paragraph-active text-white bg-white/5 p-6 rounded-xl border-l-4 border-primary shadow-lg"
                    : index < currentParagraph
                    ? "text-gray-400 opacity-60"
                    : "text-gray-500 opacity-40"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Controls for Text Stories */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <div className="flex justify-between items-center text-white">
              <div className="text-sm">
                Chapter {currentChapter + 1} of {textChapters.length}
              </div>
              <div className="text-sm">
                Paragraph {currentParagraph + 1} of{" "}
                {currentChapterData.paragraphs.length}
              </div>
            </div>
            <div className="text-center mt-2 text-white/60 text-xs">
              Swipe up/down or scroll to navigate
            </div>
          </div>
        )}

        {/* Progress indicator for text */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-1 bg-gray-600 rounded-full h-32">
            <div
              className="w-full bg-primary rounded-full transition-all duration-300"
              style={{
                height: `${
                  (getCurrentTextPosition() / Math.max(totalPages - 1, 1)) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Image story rendering
  if (isImageStory && imagePages.length > 0) {
    const currentPageData = imagePages[currentPage];

    return (
      <div
        ref={containerRef}
        className="flex flex-col h-full bg-black relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={handleScreenTap}
      >
        {/* Comic Content */}
        <div className="flex-grow flex justify-center items-center bg-black">
          <div
            className={`transform transition-transform duration-700 ${
              autoScrollActive ? "scale-95 opacity-90" : "scale-100 opacity-100"
            }`}
          >
            <Image
              src={currentPageData.imageUrl}
              alt={`${comic.title} - Page ${currentPage + 1}`}
              width={800}
              height={1200}
              className="max-h-[calc(100vh-100px)] w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Controls for Image Stories */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <div className="flex justify-between items-center">
              <div className="text-white/80 font-medium">
                {currentPage + 1} / {imagePages.length}
              </div>
            </div>
            <div className="text-center mt-2 text-white/60 text-xs">
              Swipe up/down or scroll to navigate between pages
            </div>
          </div>
        )}

        {/* Progress dots for images */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col space-y-1">
            {imagePages.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentPage ? "bg-primary" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
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
