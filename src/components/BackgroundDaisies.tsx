"use client";

import { motion } from "framer-motion";

const daisyItems = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 13) % 100}%`,
  size: 16 + ((index * 7) % 18),
  duration: 12 + (index % 8),
  delay: (index % 6) * 0.8,
}));

function Daisy({ size }: { size: number }) {
  return (
    <div
      className="relative rounded-full bg-yellow-200/90"
      style={{ width: size * 0.34, height: size * 0.34 }}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <span
          key={index}
          className="absolute left-1/2 top-1/2 block rounded-full bg-white/95"
          style={{
            width: size * 0.46,
            height: size * 0.26,
            transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-${
              size * 0.35
            }px)`,
          }}
        />
      ))}
    </div>
  );
}

export function BackgroundDaisies() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {daisyItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute -bottom-20 opacity-55"
          style={{ left: item.left }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: -1200,
            x: [0, 30, -20, 10, 0],
            rotate: [0, 20, -15, 10, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: item.delay,
          }}
        >
          <Daisy size={item.size} />
        </motion.div>
      ))}
    </div>
  );
}