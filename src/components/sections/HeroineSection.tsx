"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroineSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title text-blush">Mi heroína fav</h2>
      <p className="section-subtitle mt-3 text-mist/90">
        Mi super heroína favorita del multiverso entero.
      </p>

      <div className="mt-10 flex justify-center">
        <motion.div
          className="relative inline-block rounded-[32px] bg-gradient-to-br from-red-700 via-slate-900 to-sky-600 p-[3px] shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-[28px] bg-slate-950/90">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(248,113,113,0.35),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(56,189,248,0.35),transparent_55%)] opacity-80" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,transparent_60%,rgba(255,255,255,0.12)_61%,transparent_63%),radial-gradient(circle_at_100%_100%,transparent_60%,rgba(255,255,255,0.12)_61%,transparent_63%)] opacity-70 mix-blend-screen" />

            <div className="relative border border-white/15 p-4 sm:p-6 md:p-8">
              <div className="relative mx-auto aspect-[3/4] w-[320px] sm:w-[420px] md:w-[560px] lg:w-[640px] max-h-[980px] overflow-hidden rounded-3xl border border-red-400/60 bg-black/70">
                <Image
                  src="/heroina-fav.jpeg"
                  alt="Retrato de mi heroína favorita"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 720px, 80vw"
                  priority
                />

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.22),transparent_55%)] mix-blend-soft-light" />

                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/12" />
                  <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-white/12" />
                  <div className="absolute left-[18%] top-0 h-full w-px bg-white/5" />
                  <div className="absolute right-[18%] top-0 h-full w-px bg-white/5" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-mist/70">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                <span>Mi heroína favorita</span>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
