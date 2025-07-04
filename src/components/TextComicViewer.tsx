import { useUser } from "@/context/UserContext";
import { Comic } from "@/lib/types";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AnimatedParagraph from "./AnimatedParagraph";

interface TextComicViewerProps {
  comic: Comic;
}

const TextComicViewer: React.FC<TextComicViewerProps> = ({ comic }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const { user, updateUser } = useUser();

  // Handle both legacy textContent format and new chapters format
  const textChapters = useMemo(() => {
    if (comic.chapters) {
      // New format: convert chapters to TextChapter format
      return comic.chapters.map((chapter) => ({
        id: chapter.chapter_number,
        title: chapter.title,
        paragraphs: chapter.content.split("\n").filter((p) => p.trim()),
      }));
    }
    // Legacy format
    return comic.textContent || [];
  }, [comic.textContent, comic.chapters]);

  const totalPages = textChapters.length;
  const getCurrentTextPosition = useCallback(
    () => currentChapter,
    [currentChapter]
  );

  // Save reading progress
  const saveReadingProgress = useCallback(() => {
    if (!user || !comic) return;
    const currentPosition = getCurrentTextPosition();
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
  }, [user, comic, getCurrentTextPosition, totalPages, updateUser]);

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveReadingProgress();
    }, 500);
    return () => clearTimeout(saveTimeout);
  }, [saveReadingProgress]);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentChapter]);

  const currentChapterData = textChapters[currentChapter];
  const currentChapterFullText = useMemo(() => {
    return currentChapterData
      ? currentChapterData.paragraphs.join(" ")
      : "\n\n";
  }, [currentChapterData]);
  if (!currentChapterData) return null;

  return (
    <div className="min-h-screen w-full flex flex-col bg-morphic-dark relative overflow-hidden">
      {/* Header with chapter info */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">
                  {currentChapter + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 truncate">
                  {currentChapterData.title}
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  {comic.title}
                </p>
              </div>
            </div>
            {/* Reading progress circle */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90"
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
                    (1 - getCurrentTextPosition() / Math.max(totalPages - 1, 1))
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
                <span className="text-white text-xs sm:text-xs font-medium">
                  {Math.round(
                    (getCurrentTextPosition() / Math.max(totalPages - 1, 1)) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col pt-16 sm:pt-24 sm:pb-24 h-full">
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 py-8 sm:py-16 z-10">
          {/* <div className="sticky top-0 left-0 right-0 h-12 sm:h-24 bg-gradient-to-b from-morphic-dark to-transparent z-10 pointer-events-none"></div> */}

          <div className="w-full py-96 md:py-40 max-w-4xl lg:max-w-5xl mx-auto z-10 overflow-y-auto scrollbar-hide">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-8 sm:mb-16"
            >
              <AnimatedParagraph paragraph={currentChapterFullText} />
            </motion.div>

            {/* End of story indicator */}
            {currentChapter === textChapters.length - 1 && (
              <div className="text-center py-8 sm:py-12">
                <span className="text-gray-400 text-base sm:text-lg">
                  End of story
                </span>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 left-0 right-0 h-12 sm:h-24 bg-gradient-to-t from-morphic-dark to-transparent z-10 pointer-events-none"></div>
        </section>
      </div>

      {/* Fixed bottom controls - always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentChapter > 0) setCurrentChapter(currentChapter - 1);
              }}
              disabled={currentChapter === 0}
              className="px-3 sm:px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200"
            >
              <span className="hidden sm:inline">Previous Chapter</span>
              <span className="sm:hidden">Previous</span>
            </button>
            <div className="text-center flex-1 mx-2 sm:mx-4">
              <div className="text-white text-xs sm:text-sm font-medium">
                Chapter {currentChapter + 1} of {textChapters.length}
              </div>
              <div className="text-gray-400 text-xs truncate max-w-[120px] sm:max-w-none mx-auto">
                {currentChapterData.title}
              </div>
            </div>
            <button
              onClick={() => {
                if (currentChapter < textChapters.length - 1)
                  setCurrentChapter(currentChapter + 1);
              }}
              disabled={currentChapter === textChapters.length - 1}
              className="px-3 sm:px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200"
            >
              <span className="hidden sm:inline">Next Chapter</span>
              <span className="sm:hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextComicViewer;
