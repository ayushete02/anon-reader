"use client";

import { useState } from "react";
import { StoryDraft, StoryRead, GeneratedChapter } from "@/lib/types";
import Image from "next/image";
import {
  uploadBase64ToLighthouse,
  uploadMultipleBase64ToLighthouse,
} from "@/lib/lighthouse";

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
  const [showGeneratedPreview, setShowGeneratedPreview] = useState(false);
  const [generatedStoryData, setGeneratedStoryData] =
    useState<StoryRead | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(
    storyDraft.posterImage || null
  );

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      // Prepare the story data for API
      const storyCreateData = {
        title: storyDraft.title,
        description: storyDraft.description,
        plot: storyDraft.plot,
        type: storyDraft.type,
        categories: storyDraft.categories || [],
        characters:
          storyDraft.characters?.map((char) => ({
            name: char.name,
            type: char.type,
            description: char.description,
            image_url: char.imageUrl || "",
          })) || [],
      };

      // Call the API to generate the story
      const response = await fetch("/api/stories/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyCreateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate story");
      }

      const generatedStoryData = await response.json();
      console.log("Generated Story Data:", generatedStoryData.poster_image);

      // Handle image upload to Lighthouse for image-type stories
      let processedStoryData = generatedStoryData;

      if (storyDraft.type === "image" && generatedStoryData.chapters) {
        console.log("Processing image uploads to Lighthouse...");
        setUploadingImages(true);

        try {
          // Extract base64 images from chapters
          const imagesToUpload = generatedStoryData.chapters
            .filter((chapter: GeneratedChapter) => chapter.image_url)
            .map((chapter: GeneratedChapter) => ({
              base64: chapter.image_url!,
              chapterNumber: chapter.chapter_number,
              title: chapter.title,
            }));

          if (imagesToUpload.length > 0) {
            console.log(
              `Uploading ${imagesToUpload.length} images to Lighthouse...`
            );

            // Upload all images to Lighthouse
            const uploadedImages = await uploadMultipleBase64ToLighthouse(
              imagesToUpload
            );

            // Update chapters with Lighthouse URLs
            processedStoryData = {
              ...generatedStoryData,
              chapters: generatedStoryData.chapters.map(
                (chapter: GeneratedChapter) => {
                  const uploadedImage = uploadedImages.find(
                    (img) => img.chapterNumber === chapter.chapter_number
                  );
                  return {
                    ...chapter,
                    image_url: uploadedImage?.imageUrl || chapter.image_url,
                  };
                }
              ),
            };

            console.log("Successfully uploaded all images to Lighthouse!");
          }
        } catch (imageUploadError) {
          console.error(
            "Error uploading images to Lighthouse:",
            imageUploadError
          );
          // Continue with base64 images if upload fails
          console.log("Continuing with base64 images...");
        } finally {
          setUploadingImages(false);
        }
      }

      // Store the processed data for preview
      setGeneratedStoryData(processedStoryData);
      setShowGeneratedPreview(true);

      // upload poster image to Lighthouse if available
      if (generatedStoryData.poster_image) {
        try {
          console.log("Uploading poster image to Lighthouse...");
          const posterURL = await uploadBase64ToLighthouse(
            generatedStoryData.poster_image
          );
          processedStoryData.poster_image = posterURL;
          setPosterImage(posterURL);
          console.log("Poster image uploaded successfully:", posterURL);
        } catch (error) {
          console.error("Error uploading poster image:", error);
        }
      }

      // Create the final story object with the unified structure
      const finalStory: StoryDraft = {
        ...storyDraft,
        id: processedStoryData.id,
        generated_story: processedStoryData.generated_story,
        chapters: processedStoryData.chapters, // This will include Lighthouse URLs for image stories
        characters: processedStoryData.chapters
          ? storyDraft.characters
          : processedStoryData.characters,
        posterImage: processedStoryData.poster_image,
        status: "generated" as const,
        updatedAt: new Date().toISOString(),
      };

      setIsPublishing(false);
      onPublish(finalStory);
    } catch (error) {
      console.error("Error generating story:", error);
      setIsPublishing(false);
      // TODO: Show error in UI instead of alert
      // You can add a toast notification here or show error state
    }
  };

  const wordCount = storyDraft.plot?.trim().split(/\s+/).length || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Story Preview</h2>
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
            <h3 className="text-xl font-semibold text-white mb-6">
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
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 capitalize">
                      {storyDraft.type}-based Story
                    </p>
                    {storyDraft.type === "image" && (
                      <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-medium text-blue-400">
                        Images will be generated
                      </span>
                    )}
                  </div>
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
            <h3 className="text-xl font-semibold text-white mb-6">Plot</h3>
            <div className="max-h-60 overflow-y-auto text-white/80 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-white/5 pr-4">
              {storyDraft.plot}
            </div>
          </div>

          {/* Characters */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
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

          {/* Generated Story Preview */}
          {showGeneratedPreview && generatedStoryData && (
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Generated Story Preview (
                {generatedStoryData.chapters?.length || 0} chapters)
              </h3>

              {storyDraft.type === "image" && generatedStoryData.chapters ? (
                <div className="space-y-6">
                  <p className="text-white/60 text-sm mb-4">
                    Showing first 3 chapters with generated images:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedStoryData.chapters.slice(0, 3).map((chapter) => (
                      <div
                        key={chapter.id}
                        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
                      >
                        {chapter.image_url && (
                          <div className="aspect-[4/3] bg-white/5 rounded-lg overflow-hidden mb-3">
                            <Image
                              src={chapter.image_url}
                              alt={chapter.title}
                              width={400}
                              height={300}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-white text-sm mb-2">
                          Chapter {chapter.chapter_number}: {chapter.title}
                        </h4>
                        <p className="text-xs text-white/60 line-clamp-3">
                          {chapter.content.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/60 text-sm mb-4">
                    Showing first 2 chapters:
                  </p>
                  {generatedStoryData.chapters?.slice(0, 2).map((chapter) => (
                    <div
                      key={chapter.id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
                    >
                      <h4 className="font-semibold text-white mb-2">
                        Chapter {chapter.chapter_number}: {chapter.title}
                      </h4>
                      <p className="text-white/70 text-sm line-clamp-4">
                        {chapter.content.substring(0, 300)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Poster Image and Actions */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            {!showGeneratedPreview ? (
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
                    {uploadingImages
                      ? "Uploading Images to Lighthouse..."
                      : `Generating ${
                          storyDraft.type === "image" ? "Images &" : ""
                        } Story...`}
                  </div>
                ) : (
                  `Generate ${
                    storyDraft.type === "image" ? "Images &" : ""
                  } Story`
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Story generated successfully!
                    {storyDraft.type === "image" &&
                      " Images uploaded to Lighthouse IPFS."}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (generatedStoryData) {
                      const finalStory: StoryDraft = {
                        ...storyDraft,
                        id: generatedStoryData.id,
                        generated_story: generatedStoryData.generated_story,
                        chapters: generatedStoryData.chapters, // This now contains Lighthouse URLs
                        characters: storyDraft.characters,
                        posterImage:
                          posterImage ||
                          generatedStoryData.poster_image ||
                          "/comics/placeholder.jpg",
                        status: "generated" as const,
                        updatedAt: new Date().toISOString(),
                      };
                      onPublish(finalStory);
                    }
                  }}
                  className="w-full px-6 py-4 bg-primary/20 border border-primary/30 rounded-xl text-white font-medium backdrop-blur-sm hover:bg-primary/30 hover:border-primary/40 transition-all duration-150"
                >
                  View Full Story
                </button>
                <button
                  onClick={() => {
                    setShowGeneratedPreview(false);
                    setGeneratedStoryData(null);
                    setPosterImage(null);
                  }}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white/80 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-150"
                >
                  Generate Again
                </button>
              </div>
            )}
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
