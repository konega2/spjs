"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const noTexts = [
  "No",
  "¿Segura?",
  "Creo que te has equivocado 😏",
  "Piénsalo bien...",
  "Última oportunidad...",
];

const petalPositions = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  angle: (360 / 24) * index,
  distance: 90 + (index % 5) * 14,
  duration: 0.9 + (index % 4) * 0.15,
}));

function DaisyBurst() {
  return (
    <>
      {petalPositions.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-white"
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0.5],
            x: Math.cos((petal.angle * Math.PI) / 180) * petal.distance,
            y: Math.sin((petal.angle * Math.PI) / 180) * petal.distance,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: petal.duration, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }).map((_, index) => (
        <motion.span
          key={index}
          className={`absolute top-0 h-3 w-2 rounded ${index % 2 === 0 ? "bg-blush" : "bg-sky-300"}`}
          style={{ left: `${(index * 7) % 100}%` }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{ y: 280, opacity: 0, rotate: index % 2 === 0 ? 180 : -180 }}
          transition={{ duration: 1.4 + (index % 5) * 0.15, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function ValentineQuestion() {
  const [noTries, setNoTries] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const lastNoMoveRef = useRef(0);

  const noVisible = noTries < noTexts.length;
  const noText = noTexts[Math.min(noTries, noTexts.length - 1)];

  const noButtonPosition = useMemo(
    () => ({
      x: ((noTries * 53) % 180) - 90,
      y: ((noTries * 37) % 120) - 60,
      scale: Math.max(0.62, 1 - noTries * 0.1),
    }),
    [noTries],
  );

  const onNoTry = () => {
    const now = Date.now();
    if (now - lastNoMoveRef.current < 360) {
      return;
    }
    lastNoMoveRef.current = now;
    setNoTries((value) => Math.min(value + 1, noTexts.length));
  };

  return (
    <section className="relative mx-auto mt-10 max-w-5xl px-6 py-20 text-center">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        ¿Quieres ser mi San Valentín?
      </motion.h2>

      <div className="relative mx-auto mt-10 flex h-44 max-w-lg items-center justify-center gap-6">
        <motion.button
          className="rounded-full border border-sky-200/60 bg-sky-400/25 px-8 py-3 text-lg font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAccepted(true)}
        >
          Sí 💙
        </motion.button>

        <AnimatePresence>
          {noVisible && !accepted && (
            <motion.button
              className="absolute rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                x: noButtonPosition.x,
                y: noButtonPosition.y,
                scale: noButtonPosition.scale,
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onMouseEnter={onNoTry}
              onClick={onNoTry}
            >
              {noText}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {accepted && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DaisyBurst />
              <Confetti />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {accepted && (
          <motion.p
            className="mt-4 text-3xl font-bold text-blush md:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Sabía que dirías que sí 💙
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}