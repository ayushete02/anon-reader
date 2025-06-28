"use client";

import { useState } from "react";
import { StoryDraft } from "@/lib/types";
import Image from "next/image";

interface StoryPreviewProps {
  storyDraft: StoryDraft;
  onPublish: (story: StoryDraft) => void;
  onBack: () => void;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({
  storyDraft,
  onPublish,
  onBack,
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [posterImage, setPosterImage] = useState<string>("");

  const handlePosterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPosterImage(imageUrl);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    // Add poster image to story draft
    const finalStory = {
      ...storyDraft,
      posterImage: posterImage || "/comics/placeholder.jpg",
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
      status: "generating" as const,
    };

    // Simulate some processing time
    setTimeout(() => {
      setIsPublishing(false);
      onPublish(finalStory);
    }, 2000);
  };

  const wordCount = storyDraft.plot?.trim().split(/\s+/).length || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 font-display">
            Story Preview
          </h2>
          <p className="text-white/60">
            Review your story details before publishing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 font-display">
              Story Information
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Title
                </label>
                <p className="text-lg font-semibold text-white">
                  {storyDraft.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description
                </label>
                <p className="text-white/80 leading-relaxed">
                  {storyDraft.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Type
                  </label>
                  <p className="text-white/80 capitalize">
                    {storyDraft.type}-based Story
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Plot Length
                  </label>
                  <p className="text-white/80">{wordCount} words</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {storyDraft.categories?.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium backdrop-blur-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Plot Preview */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 font-display">
              Plot
            </h3>
            <div className="max-h-60 overflow-y-auto text-white/80 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5 pr-4">
              {storyDraft.plot}
            </div>
          </div>

          {/* Characters */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 font-display">
              Characters ({storyDraft.characters?.length || 0})
            </h3>

            {storyDraft.characters && storyDraft.characters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storyDraft.characters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                      {character.imageUrl ? (
                        <Image
                          src={character.imageUrl}
                          alt={character.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40">
                          <svg
                            className="w-8 h-8"
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
                      <h4 className="font-semibold text-white truncate">
                        {character.name}
                      </h4>
                      <span className="inline-block px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-full text-xs font-medium backdrop-blur-sm mt-1">
                        {character.type.replace("-", " ")}
                      </span>
                      <p className="text-sm text-white/60 mt-2 line-clamp-2">
                        {character.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60">No characters added</p>
            )}
          </div>
        </div>

        {/* Poster Image and Actions */}
        <div className="space-y-6">
          {/* Poster Image */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 font-display">
              Story Poster
            </h3>

            <div className="aspect-[2/3] bg-white/5 rounded-xl overflow-hidden mb-6 border border-white/10">
              {posterImage ? (
                <Image
                  src={posterImage}
                  alt="Story poster"
                  width={300}
                  height={450}
                  className="object-cover w-full h-full"
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
                    <p className="text-sm font-medium">No poster image</p>
                    <p className="text-xs mt-1">
                      Upload an image to set as your story poster
                    </p>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center justify-center w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-150">
              <svg
                className="w-5 h-5 mr-2 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-sm font-medium text-white/80">
                Upload Poster Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full px-6 py-4 bg-primary/20 border border-primary/30 rounded-xl text-white font-medium backdrop-blur-sm hover:bg-primary/30 hover:border-primary/40 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Publishing...
                </div>
              ) : (
                "Publish Story"
              )}
            </button>
            <button
              onClick={onBack}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white/80 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-150"
            >
              Back to Characters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
