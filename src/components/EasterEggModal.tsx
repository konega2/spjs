"use client";

import { AnimatePresence, motion } from "framer-motion";

type EasterEggModalProps = {
  open: boolean;
  onClose: () => void;
};

export function EasterEggModal({ open, onClose }: EasterEggModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl rounded-2xl border border-sky-200/35 bg-gradient-to-br from-slate-900 via-navy to-slate-800 p-8 text-center"
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 8 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-sky-200/70">Easter Egg // PAUL</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Fast & Furious Vibes</h3>
            <p className="mt-6 text-lg italic text-sky-100">
              If one day speed separates us, I&apos;ll still find my way back to you.
            </p>
            <button
              className="mt-8 rounded-full bg-white/15 px-6 py-2 text-sm font-semibold text-white hover:bg-white/20"
              onClick={onClose}
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}