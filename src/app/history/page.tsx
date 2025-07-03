"use client";

import React from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { MOCK_COMICS } from "@/lib/mock-data";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

export default function HistoryPage() {
  const { user } = useUser();
  // Get comics from user's reading history with additional data
  const historyComics = user
    ? user.history
        .map((historyItem) => {
          const comic = MOCK_COMICS.find((c) => c.id === historyItem.comicId);
          return {
            ...historyItem,
            comic,
          };
        })
        .filter((item) => item.comic)
    : []; // Remove any items where comic wasn't found

  // Sort by most recently read
  historyComics.sort(
    (a, b) =>
      new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reading History
            </h1>{" "}
            <p className="text-gray-600">
              Comics you&apos;ve read and your progress
            </p>
          </div>

          {historyComics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reading history yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start reading some comics to see your history!
              </p>
              <a
                href="/browse"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Comics
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {historyComics.map((item) => (
                <div
                  key={item.comicId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {" "}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.comic!.posterImage}
                        alt={item.comic!.title}
                        width={64}
                        height={80}
                        className="w-16 h-20 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/comic/${item.comicId}`}
                            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {item.comic!.title}
                          </Link>{" "}
                          <p className="text-sm text-gray-600 mt-1">
                            {item.comic!.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Last read: {formatDate(item.lastReadAt)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {" "}
                          <span className="text-sm text-gray-500">
                            Page {item.lastReadPage} of{" "}
                            {item.comic!.chapters?.length ||
                              item.comic!.pages?.length ||
                              item.comic!.textContent?.length ||
                              10}
                          </span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {item.progress}% complete
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-3">
                        <Link
                          href={`/comic/${item.comicId}?page=${item.lastReadPage}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Continue Reading
                        </Link>
                        <Link
                          href={`/comic/${item.comicId}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Start Over
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
