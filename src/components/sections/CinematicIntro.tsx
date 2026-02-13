"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const introLines = [
  "No sé explicarlo perfecto, pero contigo todo se siente distinto.",
  "Hace 3 años nos conocimos...",
  "La vida nos separó un tiempo...",
  "Pero en febrero de 2025 volviste.",
  "Y desde ahí, todo empezó a tener sentido otra vez.",
  "Esto es para ti, de mí para ti.",
];

function useTypewriter(lines: string[]) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) {
      return;
    }

    const activeLine = lines[lineIndex];
    const isLineDone = charIndex >= activeLine.length;
    const delay = isLineDone ? 800 : 35;

    const timer = setTimeout(() => {
      if (isLineDone) {
        setLineIndex((current) => current + 1);
        setCharIndex(0);
      } else {
        setCharIndex((current) => current + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIndex, lineIndex, lines]);

  return useMemo(() => {
    return lines.map((line, index) => {
      if (index < lineIndex) {
        return line;
      }
      if (index === lineIndex) {
        return line.slice(0, charIndex);
      }
      return "";
    });
  }, [charIndex, lineIndex, lines]);
}

type CinematicIntroProps = {
  onDiscover: () => void;
};

export function CinematicIntro({ onDiscover }: CinematicIntroProps) {
  const renderedLines = useTypewriter(introLines);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      <motion.div
        className="glass-card relative z-10 w-full max-w-4xl rounded-3xl p-8 md:p-12"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="space-y-3 text-lg leading-relaxed md:text-2xl">
          {renderedLines.map((line, index) => (
            <p key={`${line}-${index}`} className="min-h-8 text-mist">
              {line}
              {index === renderedLines.findIndex((value) => value.length === 0) - 1 &&
                line.length > 0 && (
                  <motion.span
                    className="ml-1 inline-block h-6 w-1 bg-blush align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
            </p>
          ))}
        </div>

        <motion.button
          className="mt-10 rounded-full border border-blush/60 bg-blush/25 px-8 py-3 text-base font-semibold text-white transition hover:bg-blush/40"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onDiscover}
        >
          Descubre lo que siento por ti
        </motion.button>
      </motion.div>
    </section>
  );
}