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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Story Preview</h2>
        <div className="text-sm text-gray-400">
          Ready to publish your story?
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Story Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <p className="text-lg font-semibold">{storyDraft.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <p className="text-gray-200">{storyDraft.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                  </label>
                  <p className="capitalize">{storyDraft.type}-based Story</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Plot Length
                  </label>
                  <p>{wordCount} words</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {storyDraft.categories?.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-primary text-white text-sm rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Plot Preview */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Plot</h3>
            <div className="max-h-40 overflow-y-auto text-gray-200 leading-relaxed">
              {storyDraft.plot}
            </div>
          </div>

          {/* Characters */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              Characters ({storyDraft.characters?.length || 0})
            </h3>

            {storyDraft.characters && storyDraft.characters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storyDraft.characters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                      {character.imageUrl ? (
                        <Image
                          src={character.imageUrl}
                          alt={character.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{character.name}</h4>
                      <p className="text-sm text-gray-300 capitalize">
                        {character.type.replace("-", " ")}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {character.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No characters added</p>
            )}
          </div>
        </div>

        {/* Poster Image and Actions */}
        <div className="space-y-6">
          {/* Poster Image */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Story Poster</h3>

            <div className="aspect-[2/3] bg-gray-600 rounded-lg overflow-hidden mb-4">
              {posterImage ? (
                <Image
                  src={posterImage}
                  alt="Story poster"
                  width={300}
                  height={450}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm">No poster uploaded</p>
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handlePosterImageUpload}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <p className="text-xs text-gray-400 mt-2">
              Upload a poster image for your story (optional)
            </p>
          </div>

          {/* Generation Info */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>AI will analyze your plot and characters</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Generate{" "}
                  {storyDraft.type === "image"
                    ? "comic panels and artwork"
                    : "formatted text chapters"}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Create character images (if not provided)</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Publish to the reader platform</p>
              </div>
            </div>
          </div>

          {/* Estimated time */}
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="font-semibold text-blue-200">Generation Time</h4>
            </div>
            <p className="text-sm text-blue-300">
              Estimated:{" "}
              {storyDraft.type === "image" ? "10-15 minutes" : "3-5 minutes"}
            </p>{" "}
            <p className="text-xs text-blue-400 mt-1">
              You&apos;ll receive an email when your story is ready
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-600">
        <button
          onClick={onBack}
          disabled={isPublishing}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
        >
          Back to Characters
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isPublishing ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Publishing...</span>
            </>
          ) : (
            <span>Publish Story</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default StoryPreview;
