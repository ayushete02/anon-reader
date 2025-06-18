"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MOCK_COMICS } from "@/lib/mock-data";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Get comics from user history
  const historyComics = user.history.map((history) => {
    const comic = MOCK_COMICS.find((c) => c.id === history.comicId);
    return {
      comic,
      lastReadPage: history.lastReadPage,
      lastReadAt: formatDate(history.lastReadAt),
      progress: history.progress,
    };
  });

  // Get favorited comics
  const favoriteComics = MOCK_COMICS.filter((comic) =>
    user.favorites.includes(comic.id)
  );

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-5xl font-bold text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{user.name || "User"}</h1>
            <p className="text-gray-400 mb-4">{user.email}</p>

            {/* User Persona */}
            {user.persona && (
              <div className="mb-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-20 text-primary">
                  {user.persona.personaType}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md">
                Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Continue Reading Section */}
        {historyComics.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Continue Reading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyComics.map(
                (item) =>
                  item.comic && (
                    <div
                      key={item.comic.id}
                      className="bg-gray-900 rounded-lg overflow-hidden"
                    >
                      <Link
                        href={`/comic/${item.comic.id}`}
                        className="block group"
                      >
                        <div className="relative aspect-[2/1] overflow-hidden">
                          <Image
                            src={item.comic.posterImage}
                            alt={item.comic.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-medium truncate">
                                {item.comic.title}
                              </h3>
                              <span className="text-primary text-xs">
                                {item.progress}% complete
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="p-4 border-t border-gray-800">
                        <p className="text-xs text-gray-400">
                          Last read on {item.lastReadAt}
                        </p>
                        <button className="mt-3 w-full py-2 bg-primary hover:bg-red-700 text-white rounded-md text-sm font-medium">
                          Resume Reading
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          </section>
        )}

        {/* Favorites Section */}
        {favoriteComics.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favoriteComics.map((comic) => (
                <Link
                  key={comic.id}
                  href={`/comic/${comic.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                    <Image
                      src={comic.posterImage}
                      alt={comic.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {comic.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* User Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Your Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {user.history.length}
              </p>
              <p className="text-sm text-gray-400">Comics Read</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {favoriteComics.length}
              </p>
              <p className="text-sm text-gray-400">Favorites</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {user.history.reduce((total, h) => total + h.lastReadPage, 0)}
              </p>
              <p className="text-sm text-gray-400">Pages Read</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
