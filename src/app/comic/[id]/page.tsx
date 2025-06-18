"use client";

import ComicViewer from "@/components/ComicViewer";
import { useUser } from "@/context/UserContext";
import { MOCK_COMICS } from "@/lib/mock-data";
import { Comic } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ComicReaderPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);

  // Get reading progress if it exists
  const readingProgress = user?.history.find((h) => h.comicId === params.id);

  // On mount, load the comic by ID from params
  useEffect(() => {
    const comicId = params.id;
    if (!comicId) {
      router.push("/browse");
      return;
    }

    const foundComic = MOCK_COMICS.find((c) => c.id === comicId);
    if (foundComic) {
      setComic(foundComic);
    } else {
      router.push("/browse");
    }

    setLoading(false);
  }, [params.id, router]);

  // Return button handler
  const handleReturn = () => {
    router.push(`/story/${params.id}`);
  };

  if (loading || !comic) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Full screen comic viewer */}
      <div className="h-screen">
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
