"use client";

import { Comic } from "@/lib/types";
import React from "react";
import ImageComicViewer from "./ImageComicViewer";
import TextComicViewer from "./TextComicViewer";

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
  const isTextStory = comic.type === "text";
  const isImageStory = comic.type === "image";

  if (isTextStory) {
    return <TextComicViewer comic={comic} />;
  }
  if (isImageStory) {
    return (
      <ImageComicViewer
        comic={comic}
        initialPage={initialPage}
        onPageChange={onPageChange}
      />
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
