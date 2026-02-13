"use client";

import { motion } from "framer-motion";

export function SeparatorBrush() {
  return (
    <div className="relative my-10 h-16 w-full overflow-hidden">
      <div className="brush-separator absolute inset-0" />
      <motion.div
        className="absolute left-[10%] top-1/2 h-1.5 rounded-full bg-blush/70"
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "80%", opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </div>
  );
}