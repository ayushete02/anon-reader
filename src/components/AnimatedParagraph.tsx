"use client";

import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

interface ParagraphProps {
  paragraph: string;
}

export default function AnimatedParagraph({ paragraph }: ParagraphProps) {
  const container = useRef<HTMLDivElement>(null);
  const [isInCenter, setIsInCenter] = useState(false);

  // Track if element is in center of viewport
  useEffect(() => {
    const checkIfInCenter = () => {
      if (!container.current) return;

      const rect = container.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if element is in center of viewport (with some tolerance)
      const isCentered =
        rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2;

      setIsInCenter(isCentered);
    };

    window.addEventListener("scroll", checkIfInCenter);
    // Initial check
    checkIfInCenter();

    return () => window.removeEventListener("scroll", checkIfInCenter);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.6", "end 0.4"],
  });

  const words = paragraph.split(" ");

  return (
    <div
      ref={container}
      className={`text-2xl md:text-3xl lg:text-4xl max-w-4xl mx-auto mb-12 leading-relaxed min-h-[300px] py-12 will-change-transform font-medium transition-colors duration-500 ${
        isInCenter ? "text-primary" : "text-morphic-light"
      }`}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            isInCenter={isInCenter}
          >
            {word}
          </Word>
        );
      })}
    </div>
  );
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
  isInCenter: boolean;
}

const Word = ({ children, progress, range, isInCenter }: WordProps) => {
  const amount = range[1] - range[0];
  const step = amount / children.length;
  const opacity = useTransform(progress, [range[0], range[1]], [0.2, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.25em] whitespace-nowrap transition-colors duration-500`}
    >
      {children.split("").map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        return (
          <Char
            key={`c_${i}`}
            progress={progress}
            range={[start, end]}
            isInCenter={isInCenter}
          >
            {char}
          </Char>
        );
      })}
    </motion.span>
  );
};

interface CharProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
  isInCenter: boolean;
}

const Char = ({ children, progress, range, isInCenter }: CharProps) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block will-change-opacity">
      <span
        className={`opacity-20 absolute transition-colors duration-500 ${
          isInCenter ? "text-primary/20" : "text-morphic-light/20"
        }`}
      >
        {children}
      </span>
      <motion.span
        style={{ opacity }}
        className={`transition-colors duration-500 ${
          isInCenter ? "text-primary" : "text-morphic-light"
        }`}
      >
        {children}
      </motion.span>
    </span>
  );
};
