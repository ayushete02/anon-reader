"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import { getUserFromLocalStorage } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) {
      // If user already exists in local storage, redirect to browse page
      if (user.persona) {
        router.push("/browse");
      } else {
        router.push("/onboarding");
      }
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
      <main className="flex flex-col items-center justify-center max-w-6xl px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
          Comic Reader
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl text-gray-300">
          Discover stories that match your unique taste. Every panel, every
          frame, tailored just for you.
        </p>

        {showLoginForm ? (
          <LoginForm />
        ) : (
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-primary text-white font-bold gap-2 hover:bg-red-700 text-lg sm:text-xl h-14 sm:h-16 px-8 sm:px-10 w-64 sm:w-72"
              // onClick={() => setShowLoginForm(true)}
              onClick={() => {
                router.push("/onboarding");
              }}
            >
              Get Started
            </button>
          </div>
        )}

        <div className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            <div className="p-6 rounded-lg bg-black bg-opacity-30">
              <div className="text-primary text-3xl mb-3">📚</div>
              <h3 className="text-lg font-semibold mb-2">Massive Library</h3>
              <p className="text-gray-400 text-sm">
                Thousands of comics across every genre you can imagine
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black bg-opacity-30">
              <div className="text-primary text-3xl mb-3">🎧</div>
              <h3 className="text-lg font-semibold mb-2">Audio Immersion</h3>
              <p className="text-gray-400 text-sm">
                Experience stories with stunning visual and audio elements
              </p>
            </div>

            <div className="p-6 rounded-lg bg-black bg-opacity-30">
              <div className="text-primary text-3xl mb-3">🧩</div>
              <h3 className="text-lg font-semibold mb-2">Personalized</h3>
              <p className="text-gray-400 text-sm">
                Recommendations tailored to your unique taste in stories
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
