"use client";

import React from "react";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
      <div className="text-accent text-4xl mb-8">Tailwind CSS Test</div>

      {/* Primary color test */}
      <div className="bg-primary text-white p-4 rounded mb-4">
        This should have a Netflix red background (Tailwind)
      </div>

      {/* Direct CSS test */}
      <div className="bg-primary-direct text-white-direct p-4 rounded mb-4">
        This should have a Netflix red background (Direct CSS)
      </div>

      {/* Flex and spacing test */}
      <div className="flex space-x-4 mb-4">
        <div className="p-4 bg-gray-800 rounded">Item 1</div>
        <div className="p-4 bg-gray-700 rounded">Item 2</div>
        <div className="p-4 bg-gray-600 rounded">Item 3</div>
      </div>

      {/* Border and hover test */}
      <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
        Hover me
      </button>
    </div>
  );
}
