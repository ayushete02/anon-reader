"use client";

import { useUser } from "@/context/UserContext";
import { Comic } from "@/lib/types";
import Image from "next/image";
import React, { TouchEvent, useEffect, useRef, useState } from "react";

interface ComicViewerProps {
  comic: Comic;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

// Define the structure for a comic page
interface ComicPage {
  id: string;
  imageUrl: string;
  hasAudio: boolean;
  audioUrl?: string;
  caption?: string;
}

const ComicViewer: React.FC<ComicViewerProps> = ({
  comic,
  initialPage = 0,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, updateUser } = useUser();

  // Mock comic pages (in a real app, these would come from the API)
  const mockPages: ComicPage[] = Array.from({ length: 10 }, (_, i) => ({
    id: `page-${i}`,
    imageUrl: comic.posterImage || `/comics/page-${i}.jpg`,
    hasAudio: i === 0 || i === 3 || i === 7, // Only some pages have audio
    audioUrl:
      i === 0
        ? "/audio/page1.mp3"
        : i === 3
        ? "/audio/page4.mp3"
        : i === 7
        ? "/audio/page8.mp3"
        : undefined,
    caption: `Page ${i + 1} of ${comic.title}`,
  }));

  // Auto-save reading progress
  useEffect(() => {
    if (!user || !comic) return;

    // Debounce the save operation to avoid too many updates
    const saveTimeout = setTimeout(() => {
      saveReadingProgress(currentPage);
    }, 500);

    return () => clearTimeout(saveTimeout);
  }, [currentPage, comic.id]);

  // Handle touch events for vertical swiping
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe up - go to next page
      navigateToPage(currentPage + 1);
    } else if (touchStart - touchEnd < -100) {
      // Swipe down - go to previous page
      navigateToPage(currentPage - 1);
    }

    // Show controls temporarily when tapping
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  // Handle wheel event for mouse scrolling
  const handleWheel = (e: React.WheelEvent) => {
    // Prevent default scrolling behavior
    e.preventDefault();

    // Wait until animation is complete to prevent rapid scrolling
    if (autoScrollActive) return;

    if (e.deltaY > 0) {
      // Scroll down - go to next page
      setAutoScrollActive(true);
      navigateToPage(currentPage + 1);
      setTimeout(() => setAutoScrollActive(false), 700); // Animation duration
    } else if (e.deltaY < 0) {
      // Scroll up - go to previous page
      setAutoScrollActive(true);
      navigateToPage(currentPage - 1);
      setTimeout(() => setAutoScrollActive(false), 700); // Animation duration
    }
  };

  // Toggle controls visibility when clicking the screen
  const handleScreenTap = () => {
    setShowControls(!showControls);
    setTimeout(() => setShowControls(false), 3000);
  };

  // Save reading progress
  const saveReadingProgress = (page: number) => {
    if (!user || !comic) return;

    // Calculate progress percentage
    const progress = Math.round((page / mockPages.length) * 100);

    // Create new history item
    const historyItem = {
      comicId: comic.id,
      lastReadPage: page,
      lastReadAt: new Date().toISOString(),
      progress,
    };

    // Check if we already have a history entry for this comic
    const existingHistoryIndex = user.history.findIndex(
      (h) => h.comicId === comic.id
    );

    // Create a new history array
    let newHistory;
    if (existingHistoryIndex >= 0) {
      // Update existing entry
      newHistory = [...user.history];
      newHistory[existingHistoryIndex] = historyItem;
    } else {
      // Add new entry
      newHistory = [...user.history, historyItem];
    }

    // Update user
    updateUser({ history: newHistory });
  };

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(isNaN(progress) ? 0 : progress);
    }
  };

  // Handle audio playback ending
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
    }

    setIsPlaying(!isPlaying);
  };

  const navigateToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < mockPages.length) {
      setCurrentPage(pageIndex);

      // Call the onPageChange callback if provided
      if (onPageChange) {
        onPageChange(pageIndex);
      }

      // Pause audio when changing pages
      if (isPlaying) {
        setIsPlaying(false);
      }

      // Reset audio progress
      setAudioProgress(0);
    }
  };

  const currentPageData = mockPages[currentPage];

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
      {/* Hidden audio element */}
      {currentPageData.hasAudio && currentPageData.audioUrl && (
        <audio
          ref={audioRef}
          src={currentPageData.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          preload="auto"
          hidden
        />
      )}

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

      {/* Audio indicator */}
      {currentPageData.hasAudio && (
        <div className="absolute top-4 right-4 p-2 bg-primary/80 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Minimal Controls - shown only when tapped */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent transition-opacity duration-300">
          <div className="flex justify-between items-center">
            {/* Page indicator */}
            <div className="text-white/80 font-medium">
              {currentPage + 1} / {mockPages.length}
            </div>

            {/* Audio controls if available */}
            {currentPageData.hasAudio && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="p-2 bg-primary/80 rounded-full"
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Navigation guide */}
          <div className="text-center mt-2 text-white/60 text-xs">
            Swipe up/down or scroll to navigate between pages
          </div>
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <div className="flex flex-col space-y-1">
          {mockPages.map((_, index) => (
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
};

export default ComicViewer;
