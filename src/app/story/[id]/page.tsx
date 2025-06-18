"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MOCK_COMICS } from "@/lib/mock-data";
import { Comic } from "@/lib/types";
import { useUser } from "@/context/UserContext";

const StoryDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [story, setStory] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);

  const readingProgress = user?.history.find((h) => h.comicId === params.id);

  useEffect(() => {
    const storyId = params.id;
    if (!storyId) {
      router.push("/browse");
      return;
    }

    const foundStory = MOCK_COMICS.find((c) => c.id === storyId);
    if (foundStory) {
      setStory(foundStory);
    } else {
      router.push("/browse");
    }

    setLoading(false);
  }, [params.id, router]);

  const handlePlay = () => {
    router.push(`/comic/${story?.id}`);
  };

  const handleBack = () => {
    router.push("/browse");
  };

  if (loading || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 p-6">
        <button
          onClick={handleBack}
          className="group flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
        >
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-white/20 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span className="font-medium">Back to Browse</span>
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Poster Section */}
            <div className="lg:col-span-2">
              <div className="relative group">
                {/* Glowing effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />

                <div className="relative">
                  <Image
                    src={story.posterImage}
                    alt={story.title}
                    width={500}
                    height={750}
                    className="w-full h-auto rounded-xl shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Story Type Badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-sm font-semibold ${
                        story.type === "text"
                          ? "bg-blue-500/80 text-white shadow-lg shadow-blue-500/25"
                          : "bg-emerald-500/80 text-white shadow-lg shadow-emerald-500/25"
                      }`}
                    >
                      {story.type === "text"
                        ? "📖 Text Story"
                        : "🎨 Visual Story"}
                    </div>
                  </div>

                  {/* Reading Progress Overlay */}
                  {readingProgress && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-300">
                            Progress
                          </span>
                          <span className="text-xs text-primary font-semibold">
                            {readingProgress.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-primary to-purple-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${readingProgress.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-3 space-y-8">
              {/* Title and Meta */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                    {story.title}
                  </h1>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{story.rating}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{new Date(story.releaseDate).getFullYear()}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span>{story.popularity}% Match</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-3">
                  {story.categories.map((category, index) => (
                    <span
                      key={category}
                      className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 ${
                        index % 3 === 0
                          ? "bg-primary/20 text-primary-300"
                          : index % 3 === 1
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-200">
                  Story Description
                </h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {story.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={handlePlay}
                  className="group relative w-full sm:w-auto"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5h10a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {readingProgress ? "Continue Reading" : "Start Reading"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
