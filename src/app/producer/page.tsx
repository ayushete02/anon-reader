"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { StoryDraft, Character } from "@/lib/types";
import StoryDetailsForm from "@/components/producer/StoryDetailsForm";
import CharacterCreator from "@/components/producer/CharacterCreator";
import StoryPreview from "@/components/producer/StoryPreview";
import AuthGuard from "@/components/AuthGuard";

type Step = "details" | "characters" | "preview";

const ProducerPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyDraft, setStoryDraft] = useState<Partial<StoryDraft>>({
    title: "",
    description: "",
    plot: "",
    type: "text",
    characters: [],
    categories: [],
    createdBy: "",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Update createdBy when user becomes available
  useEffect(() => {
    if (user && !storyDraft.createdBy) {
      setStoryDraft((prev) => ({
        ...prev,
        createdBy: user.id,
      }));
    }
  }, [user, storyDraft.createdBy]);

  // Handle user authentication redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Save draft to localStorage
  useEffect(() => {
    if (storyDraft.title || storyDraft.description || storyDraft.plot) {
      localStorage.setItem("storyDraft", JSON.stringify(storyDraft));
    }
  }, [storyDraft]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("storyDraft");
    if (savedDraft && user) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.createdBy === user.id) {
          setStoryDraft(parsed);
        }
      } catch (error) {
        console.error("Error loading saved draft:", error);
      }
    }
  }, [user]); // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary text-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }
  const handleStoryDetailsSubmit = (details: Partial<StoryDraft>) => {
    const updatedDraft = {
      ...storyDraft,
      ...details,
      updatedAt: new Date().toISOString(),
    };
    setStoryDraft(updatedDraft);
    setCurrentStep("characters");
  };

  const handleCharactersSubmit = (characters: Character[]) => {
    const updatedDraft = {
      ...storyDraft,
      characters,
      updatedAt: new Date().toISOString(),
    };
    setStoryDraft(updatedDraft);
    setCurrentStep("preview");
  };

  const handlePublishStory = async (finalStory: StoryDraft) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would call an API to publish the story
      console.log("Publishing story:", finalStory);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear the draft from localStorage after successful publish
      localStorage.removeItem("storyDraft");

      // Show success message
      alert(
        "Story published successfully! Your comic is now available to readers."
      );

      // Redirect to browse page
      router.push("/browse");
    } catch (error) {
      console.error("Error publishing story:", error);
      alert("Failed to publish story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackStep = () => {
    if (currentStep === "characters") {
      setCurrentStep("details");
    } else if (currentStep === "preview") {
      setCurrentStep("characters");
    }
  };

  const handleStartOver = () => {
    if (
      confirm(
        "Are you sure you want to start over? All your progress will be lost."
      )
    ) {
      localStorage.removeItem("storyDraft");
      setStoryDraft({
        title: "",
        description: "",
        plot: "",
        type: "text",
        characters: [],
        categories: [],
        createdBy: user?.id || "",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setCurrentStep("details");
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "details":
        return 33;
      case "characters":
        return 66;
      case "preview":
        return 100;
      default:
        return 0;
    }
  };
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>
        </div>

        {/* Top Navigation Bar */}
        <nav className="relative z-20 bg-black/30 backdrop-blur-md border-b border-gray-800/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Story Creator
                  </h1>
                  <p className="text-gray-400 text-xs">
                    AI-Powered Comic Generation
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push("/browse")}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg text-sm transition-all duration-300 text-gray-300 hover:text-white backdrop-blur-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span>Exit</span>
                </button>
                <button
                  onClick={handleStartOver}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-sm transition-all duration-300 text-red-400 hover:text-red-300 backdrop-blur-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8 relative z-10 max-w-6xl">
          {/* Main Header */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Create Your Story
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transform your imagination into stunning visual stories with our
              advanced AI comic generation platform
            </p>
          </div>{" "}
          {/* Enhanced Progress Section */}
          <div className="mb-12">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-400">
                  Progress
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-2 shadow-inner border border-gray-800">
                <div
                  className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 h-2 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${getProgressPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Steps Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Story Details */}
              <div
                className={`relative group cursor-pointer transition-all duration-300 ${
                  currentStep === "details" ? "scale-105" : ""
                }`}
              >
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    currentStep === "details"
                      ? "bg-red-600/10 border-red-600/50 shadow-lg shadow-red-600/20"
                      : getProgressPercentage() > 33
                      ? "bg-green-600/10 border-green-600/30 shadow-lg shadow-green-600/10"
                      : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        currentStep === "details"
                          ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                          : getProgressPercentage() > 33
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {getProgressPercentage() > 33 ? "✓" : "1"}
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentStep === "details"
                          ? "bg-red-600"
                          : getProgressPercentage() > 33
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    ></div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                      currentStep === "details" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    Story Details
                  </h3>{" "}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Define your story&apos;s core elements, plot, and categories
                  </p>
                </div>
              </div>

              {/* Step 2: Characters */}
              <div
                className={`relative group cursor-pointer transition-all duration-300 ${
                  currentStep === "characters" ? "scale-105" : ""
                }`}
              >
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    currentStep === "characters"
                      ? "bg-red-600/10 border-red-600/50 shadow-lg shadow-red-600/20"
                      : getProgressPercentage() > 66
                      ? "bg-green-600/10 border-green-600/30 shadow-lg shadow-green-600/10"
                      : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        currentStep === "characters"
                          ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                          : getProgressPercentage() > 66
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {getProgressPercentage() > 66 ? "✓" : "2"}
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentStep === "characters"
                          ? "bg-red-600"
                          : getProgressPercentage() > 66
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    ></div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                      currentStep === "characters"
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    Characters
                  </h3>{" "}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Create and customize your story&apos;s main characters
                  </p>
                </div>
              </div>

              {/* Step 3: Preview & Publish */}
              <div
                className={`relative group cursor-pointer transition-all duration-300 ${
                  currentStep === "preview" ? "scale-105" : ""
                }`}
              >
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    currentStep === "preview"
                      ? "bg-red-600/10 border-red-600/50 shadow-lg shadow-red-600/20"
                      : "bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        currentStep === "preview"
                          ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      3
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentStep === "preview" ? "bg-red-600" : "bg-gray-600"
                      }`}
                    ></div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                      currentStep === "preview" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    Preview & Publish
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Review your creation and publish to the world
                  </p>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Main Content Area */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800/50 relative overflow-hidden">
            {/* Content background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-transparent to-gray-900/10 rounded-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600"></div>

            <div className="relative z-10 p-8 md:p-12">
              {isSubmitting && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
                  <div className="bg-gray-900/95 backdrop-blur-xl p-10 rounded-3xl text-center border border-gray-800/50 shadow-2xl max-w-md mx-4">
                    <div className="relative mb-6">
                      <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-700 border-t-red-600 mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Publishing Your Story
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Our AI is generating your comic. This magical process may
                      take a few moments...
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "details" && (
                <div className="animate-fadeIn">
                  <StoryDetailsForm
                    initialData={storyDraft}
                    onSubmit={handleStoryDetailsSubmit}
                  />
                </div>
              )}

              {currentStep === "characters" && (
                <div className="animate-fadeIn">
                  <CharacterCreator
                    initialCharacters={storyDraft.characters || []}
                    onSubmit={handleCharactersSubmit}
                    onBack={handleBackStep}
                  />
                </div>
              )}

              {currentStep === "preview" && (
                <div className="animate-fadeIn">
                  <StoryPreview
                    storyDraft={storyDraft as StoryDraft}
                    onPublish={handlePublishStory}
                    onBack={handleBackStep}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Enhanced Footer */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-3 bg-gray-900/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-800/50 shadow-lg">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-sm font-medium text-gray-300">
                Auto-save enabled
              </span>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>{" "}
              <span className="text-xs text-gray-500">
                Your progress is continuously saved
              </span>{" "}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProducerPage;
