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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Story Details</h2>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Story Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
          placeholder="Enter your story title..."
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Story Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
          placeholder="Brief description of your story..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Story Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Story Type *</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
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
              className="mr-2"
            />
            <span>Text-based Story</span>
          </label>
          <label className="flex items-center">
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
              className="mr-2"
            />
            <span>Image-based Comic</span>
          </label>
        </div>
      </div>

      {/* Plot */}
      <div>
        <label htmlFor="plot" className="block text-sm font-medium mb-2">
          Story Plot *{" "}
          <span className="text-gray-400">({wordCount}/2000 words)</span>
        </label>
        <textarea
          id="plot"
          value={formData.plot}
          onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
          rows={12}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
          placeholder="Write your complete story plot here... (Maximum 2000 words)"
        />
        {errors.plot && (
          <p className="text-red-500 text-sm mt-1">{errors.plot}</p>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Story Categories *{" "}
          <span className="text-gray-400">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {STORY_CATEGORIES.map((category) => (
            <label
              key={category}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                formData.categories.includes(category)
                  ? "bg-primary text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="mr-2"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Next: Add Characters
        </button>
      </div>
    </form>
  );
};

export default StoryDetailsForm;
