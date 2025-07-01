import React, { useRef, useState } from "react";
import { Comic } from "@/lib/types";
import Image from "next/image";

interface ImageComicViewerProps {
  comic: Comic;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const ImageComicViewer: React.FC<ImageComicViewerProps> = ({ comic, initialPage = 0, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagePages = comic.pages || [];

  return (
    <div ref={containerRef} className="h-full bg-black relative overflow-hidden">
      {/* Instagram-style vertical scroll container */}
      <div
        className="h-full overflow-y-auto instagram-scroll"
        onScroll={(e) => {
          const container = e.target as HTMLDivElement;
          const scrollTop = container.scrollTop;
          const pageHeight = container.clientHeight;
          const newPage = Math.round(scrollTop / pageHeight);
          if (newPage !== currentPage && newPage >= 0 && newPage < imagePages.length) {
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
                priority={index === currentPage || index === currentPage + 1 || index === currentPage - 1}
                sizes="100vw"
              />
            </div>
            {/* Page overlay info */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="flex justify-between items-center">
                {/* Story title */}
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                  <h3 className="text-white text-sm font-medium truncate max-w-[200px]">{comic.title}</h3>
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
            <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
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
    </div>
  );
};

export default ImageComicViewer;
