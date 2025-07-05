"use client";
import AuthGuard from "@/components/AuthGuard";
import CharacterCreator from "@/components/producer/CharacterCreator";
import StoryDetailsForm from "@/components/producer/StoryDetailsForm";
import StoryPreview from "@/components/producer/StoryPreview";
import { useUser } from "@/context/UserContext";
import { Character, StoryDraft } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Step = "details" | "characters" | "preview";

const ProducerPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("details");
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
      <div className="min-h-screen bg-morphic-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary/50 mx-auto mb-4"></div>
          <p className="text-xl text-white/80">Loading...</p>
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
    try {
      console.log("Story generated successfully:", finalStory);

      // Save the generated story to localStorage for viewing
      const savedStories = localStorage.getItem("generatedStories");
      let stories = [];

      if (savedStories) {
        try {
          stories = JSON.parse(savedStories);
        } catch (error) {
          console.error("Error parsing saved stories:", error);
          stories = [];
        }
      }

      // Add the new story to the list
      stories.push(finalStory);
      localStorage.setItem("generatedStories", JSON.stringify(stories));

      // Clear the draft from localStorage after successful generation
      localStorage.removeItem("storyDraft");

      // Redirect to the generated story viewer page
      if (finalStory.id) {
        router.push(`/story/generated/${finalStory.id}`);
      } else {
        console.error("No story ID found");
        router.push("/browse");
      }
    } catch (error) {
      console.error("Error handling published story:", error);
      // Remove alert, handle error silently or show in UI
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
      <div className="min-h-screen bg-morphic-dark text-white relative overflow-hidden">
        {/* Enhanced glossy background effects */}
        <div className="absolute inset-0">
          <div className="absolute -inset-[300px] md:-inset-[500px] bg-[radial-gradient(circle_400px_at_100%_100px,rgba(93,93,255,0.1),transparent)] md:bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />
          <div className="absolute -inset-[300px] md:-inset-[500px] bg-[radial-gradient(circle_300px_at_0%_400px,rgba(93,93,255,0.07),transparent)] md:bg-[radial-gradient(circle_600px_at_0%_800px,rgba(93,93,255,0.07),transparent)] pointer-events-none" />
          <div className="absolute top-0 -left-4 w-48 h-48 md:w-96 md:h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute -bottom-8 right-0 w-48 h-48 md:w-96 md:h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute bottom-24 left-24 w-36 h-36 md:w-72 md:h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        {/* Top Navigation Bar */}
        <nav className="z-20 bg-morphic-gray/30 backdrop-blur-xl border-b border-white/5 sticky top-0">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm xs:text-base sm:text-lg">
                    S
                  </span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-white truncate">
                    Story Creator
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm truncate">
                    Create your next masterpiece
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
                {/* Step Indicators - Mobile */}
                <div className="flex xs:hidden items-center justify-center space-x-1 text-xs text-white/60 overflow-x-auto pb-1">
                  <span
                    className={`whitespace-nowrap px-2 py-1 rounded ${
                      currentStep === "details"
                        ? "text-white font-medium bg-white/10"
                        : ""
                    }`}
                  >
                    Details
                  </span>
                  <span className="text-white/40">→</span>
                  <span
                    className={`whitespace-nowrap px-2 py-1 rounded ${
                      currentStep === "characters"
                        ? "text-white font-medium bg-white/10"
                        : ""
                    }`}
                  >
                    Characters
                  </span>
                  <span className="text-white/40">→</span>
                  <span
                    className={`whitespace-nowrap px-2 py-1 rounded ${
                      currentStep === "preview"
                        ? "text-white font-medium bg-white/10"
                        : ""
                    }`}
                  >
                    Preview
                  </span>
                </div>

                {/* Step Indicators - Tablet/Desktop */}
                <div className="hidden xs:flex sm:hidden items-center space-x-2 text-xs text-white/60">
                  <span
                    className={
                      currentStep === "details" ? "text-white font-medium" : ""
                    }
                  >
                    1
                  </span>
                  <span>→</span>
                  <span
                    className={
                      currentStep === "characters"
                        ? "text-white font-medium"
                        : ""
                    }
                  >
                    2
                  </span>
                  <span>→</span>
                  <span
                    className={
                      currentStep === "preview" ? "text-white font-medium" : ""
                    }
                  >
                    3
                  </span>
                </div>

                <div className="hidden sm:flex md:hidden items-center space-x-2 text-sm text-white/60">
                  <span
                    className={currentStep === "details" ? "text-white" : ""}
                  >
                    Details
                  </span>
                  <span>→</span>
                  <span
                    className={currentStep === "characters" ? "text-white" : ""}
                  >
                    Characters
                  </span>
                  <span>→</span>
                  <span
                    className={currentStep === "preview" ? "text-white" : ""}
                  >
                    Preview
                  </span>
                </div>

                <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
                  <span
                    className={currentStep === "details" ? "text-white" : ""}
                  >
                    Story Details
                  </span>
                  <span>→</span>
                  <span
                    className={currentStep === "characters" ? "text-white" : ""}
                  >
                    Characters
                  </span>
                  <span>→</span>
                  <span
                    className={currentStep === "preview" ? "text-white" : ""}
                  >
                    Preview & Publish
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full xs:w-24 sm:w-32 lg:w-40 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary/40 backdrop-blur-xl transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 min-h-[calc(100vh-80px)]">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
            <div className="max-w-5xl xl:max-w-7xl mx-auto">
              {/* Action Buttons */}
              <div className="flex flex-col-reverse xs:flex-row xs:justify-end items-stretch xs:items-center gap-3 xs:gap-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 w-full xs:w-auto">
                  {currentStep !== "details" && (
                    <button
                      onClick={handleBackStep}
                      className="w-full xs:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-200 text-sm sm:text-base font-medium flex items-center justify-center gap-2"
                    >
                      <span>←</span>
                      <span className="hidden xs:inline">Back</span>
                    </button>
                  )}
                  <button
                    onClick={handleStartOver}
                    className="w-full xs:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 backdrop-blur-sm transition-all duration-200 text-sm sm:text-base font-medium"
                  >
                    Start Over
                  </button>
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-morphic-gray/30 backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-3 xs:p-4 sm:p-6 lg:p-8">
                  {currentStep === "details" && (
                    <StoryDetailsForm
                      initialData={storyDraft}
                      onSubmit={handleStoryDetailsSubmit}
                    />
                  )}
                  {currentStep === "characters" && (
                    <CharacterCreator
                      initialCharacters={storyDraft.characters || []}
                      onSubmit={handleCharactersSubmit}
                      onBack={() => setCurrentStep("details")}
                    />
                  )}
                  {currentStep === "preview" && (
                    <StoryPreview
                      storyDraft={storyDraft as StoryDraft}
                      onPublish={handlePublishStory}
                      onBack={() => setCurrentStep("characters")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default ProducerPage;
