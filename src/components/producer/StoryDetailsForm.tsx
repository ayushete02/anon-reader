"use client";

import { useState } from "react";
import { StoryDraft, STORY_CATEGORIES } from "@/lib/types";

interface StoryDetailsFormProps {
  initialData: Partial<StoryDraft>;
  onSubmit: (details: Partial<StoryDraft>) => void;
}

const StoryDetailsForm: React.FC<StoryDetailsFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    plot: initialData.plot || "",
    type: initialData.type || ("text" as "text" | "image"),
    categories: initialData.categories || [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.plot.trim()) {
      newErrors.plot = "Plot is required";
    }

    if (formData.plot.length > 2000) {
      newErrors.plot = "Plot must be 2000 words or less";
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter((c) => c !== category)
      : [...formData.categories, category];

    setFormData({ ...formData, categories: newCategories });
  };

  const wordCount = formData.plot.trim().split(/\s+/).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
        Story Details
      </h2>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-2 text-white/80"
        >
          Story Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/20 backdrop-blur-sm transition-all duration-150 text-sm sm:text-base"
          placeholder="Enter your story title..."
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-2">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2 text-white/80"
        >
          Story Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/20 backdrop-blur-sm transition-all duration-150 text-sm sm:text-base resize-none"
          placeholder="Brief description of your story..."
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-2">{errors.description}</p>
        )}
      </div>

      {/* Story Type */}
      <div>
        <label className="block text-sm font-medium mb-3 text-white/80">
          Story Type *
        </label>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <label className="relative flex items-center group flex-1">
            <input
              type="radio"
              value="text"
              checked={formData.type === "text"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "text" | "image",
                })
              }
              className="sr-only peer"
            />
            <div className="w-full px-4 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 peer-checked:bg-primary/20 peer-checked:border-primary/30 backdrop-blur-sm transition-all duration-150 cursor-pointer hover:bg-white/10 hover:border-white/20 text-center">
              <span className="text-sm font-medium">Text-based Story</span>
            </div>
          </label>
          <label className="relative flex items-center group flex-1">
            <input
              type="radio"
              value="image"
              checked={formData.type === "image"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "text" | "image",
                })
              }
              className="sr-only peer"
            />
            <div className="w-full px-4 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 peer-checked:bg-primary/20 peer-checked:border-primary/30 backdrop-blur-sm transition-all duration-150 cursor-pointer hover:bg-white/10 hover:border-white/20 text-center">
              <span className="text-sm font-medium">Image-based Comic</span>
            </div>
          </label>
        </div>
      </div>

      {/* Plot */}
      <div>
        <label
          htmlFor="plot"
          className="block text-sm font-medium mb-2 text-white/80"
        >
          Story Plot *{" "}
          <span className="text-white/40">({wordCount}/2000 words)</span>
        </label>
        <textarea
          id="plot"
          value={formData.plot}
          onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
          rows={8}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/20 backdrop-blur-sm transition-all duration-150 text-sm sm:text-base resize-none"
          placeholder="Write your complete story plot here... (Maximum 2000 words)"
        />
        {errors.plot && (
          <p className="text-red-400 text-sm mt-2">{errors.plot}</p>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium mb-3 text-white/80">
          Story Categories *{" "}
          <span className="text-white/40">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {STORY_CATEGORIES.map((category) => (
            <label key={category} className="relative flex items-center group">
              <input
                type="checkbox"
                checked={formData.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="sr-only peer"
              />
              <div
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm transition-all duration-150 cursor-pointer text-center ${
                  formData.categories.includes(category)
                    ? "bg-primary/20 border border-primary/30 hover:bg-primary/30 hover:border-primary/40"
                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {category}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="text-red-400 text-sm mt-2">{errors.categories}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center sm:justify-end pt-4">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary/20 border border-primary/30 rounded-xl text-white font-medium backdrop-blur-sm hover:bg-primary/30 hover:border-primary/40 transition-all duration-150 text-sm sm:text-base"
        >
          Continue to Characters
        </button>
      </div>
    </form>
  );
};

export default StoryDetailsForm;
