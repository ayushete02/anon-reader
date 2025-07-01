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
  const textChapters = useMemo(
    () => comic.textContent || [],
    [comic.textContent]
  );
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
        </div>
      </div>
      <main className="flex-1 flex flex-col pt-24">
        <section className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 py-16 z-10">
          <div className="sticky top-0 left-0 right-0 h-24 bg-gradient-to-b from-morphic-dark to-transparent z-10 pointer-events-none"></div>

          <div className="w-full max-w-5xl mx-auto z-10 overflow-y-auto scrollbar-hide ">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <AnimatedParagraph paragraph={currentChapterFullText} />
            </motion.div>

            {/* Next Chapter Button */}
            {currentChapter < textChapters.length - 1 && (
              <div className="text-center py-12">
                <button
                  onClick={() => setCurrentChapter(currentChapter + 1)}
                  className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg"
                >
                  Next Chapter
                </button>
              </div>
            )}

            {/* End of story indicator */}
            {currentChapter === textChapters.length - 1 && (
              <div className="text-center py-12">
                <span className="text-gray-400 text-lg">End of story</span>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-morphic-dark to-transparent z-10 pointer-events-none"></div>
        </section>
      </main>

      {/* Fixed bottom controls - always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentChapter > 0) setCurrentChapter(currentChapter - 1);
              }}
              disabled={currentChapter === 0}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-all duration-200"
            >
              Previous Chapter
            </button>
            <div className="text-center">
              <div className="text-white text-sm font-medium">
                Chapter {currentChapter + 1} of {textChapters.length}
              </div>
              <div className="text-gray-400 text-xs">
                {currentChapterData.title}
              </div>
            </div>
            <button
              onClick={() => {
                if (currentChapter < textChapters.length - 1)
                  setCurrentChapter(currentChapter + 1);
              }}
              disabled={currentChapter === textChapters.length - 1}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-all duration-200"
            >
              Next Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextComicViewer;
