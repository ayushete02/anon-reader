import React from "react";
import ComicCard from "./ComicCard";
import { Comic } from "@/lib/types";

interface ComicRowProps {
  title: string;
  comics: Comic[];
}

const ComicRow: React.FC<ComicRowProps> = ({ title, comics }) => {
  return (
    <div className="mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>

      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className="flex-shrink-0 w-[160px] sm:w-[200px]"
            >
              <ComicCard comic={comic} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicRow;
