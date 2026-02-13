"use client";

import { motion } from "framer-motion";

function GiantDaisy() {
  const petals = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    angle: index * 20,
  }));

  return (
    <motion.div
      className="relative mx-auto mt-10 w-full max-w-[360px]"
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg viewBox="0 0 420 520" className="h-auto w-full" role="img" aria-label="Margarita blanca">
        <defs>
          <radialGradient id="soft-bg" cx="50%" cy="35%" r="58%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="stem-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7ed18e" />
            <stop offset="100%" stopColor="#4f9d5f" />
          </linearGradient>
          <radialGradient id="center-gradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffe985" />
            <stop offset="100%" stopColor="#f4c32f" />
          </radialGradient>
        </defs>

        <rect x="35" y="28" width="350" height="460" rx="160" fill="url(#soft-bg)" />

        <motion.g
          style={{ originX: 0.5, originY: 0.92 }}
          animate={{ rotate: [0, 1.8, -1.8, 0], x: [0, 2, -2, 0] }}
          transition={{ duration: 5.4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.path
            d="M210 246 C206 310, 206 362, 208 450"
            fill="none"
            stroke="url(#stem-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          />

          <motion.path
            d="M206 340 C170 324, 160 306, 180 286 C205 294, 216 316, 206 340"
            fill="#6ec47f"
            initial={{ scale: 0.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.95 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.75 }}
          />
          <motion.path
            d="M210 372 C240 358, 258 338, 246 318 C220 324, 206 346, 210 372"
            fill="#72c985"
            initial={{ scale: 0.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.95 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.88 }}
          />

          {petals.map((petal, index) => (
            <motion.ellipse
              key={petal.id}
              cx="210"
              cy="166"
              rx="16"
              ry="62"
              transform={`rotate(${petal.angle} 210 210)`}
              fill="rgba(255,255,255,0.98)"
              stroke="rgba(236,240,245,0.9)"
              strokeWidth="1.3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 1 + index * 0.05 }}
            />
          ))}

          <motion.circle
            cx="210"
            cy="210"
            r="36"
            fill="url(#center-gradient)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 1.95 }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

export function EssenceSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="glass-card relative overflow-hidden rounded-3xl p-8 md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-watercolor opacity-80" />
        <div className="relative z-10">
          <h2 className="section-title">Tu arte. Tu flow. Tu manera de ser.</h2>
          <motion.div
            className="mt-3 h-1.5 rounded-full bg-blush/75"
            initial={{ width: 0 }}
            whileInView={{ width: "70%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          <div className="mt-6 space-y-4 text-base leading-relaxed text-mist/95 md:text-lg">
            <p>
              Eres la mejor artista que he conocido en mi vida. Tienes un talento que no se puede explicar,
              un don único que no todo el mundo tiene, y de verdad no quiero que nunca te rindas, porque vas
              a llegar lejísimos. Estoy segurísimo de eso.
            </p>
            <p>
              Eres súper inteligente, pero no solo en lo que haces, sino en cómo piensas, cómo ves las cosas
              y cómo entiendes a la gente. Y aunque seas increíble en mil cosas, lo que más me gusta de ti es
              la persona que eres. Eres la mejor persona que he conocido jamás.
            </p>
            <p>
              Eres la chica más guapa que he visto, pero lo que de verdad me enamora es cómo haces que todo
              conmigo sea más fácil, más bonito y más feliz. Gracias por esta segunda oportunidad, por no dejar
              de pensar en mi incluso 1 año despes de no hablarnos y por hacerme sentir feliz cada día.
            </p>
            <p>Te amo muchísimo mi niña hermosa. ❤️</p>
          </div>

          <GiantDaisy />
        </div>
      </div>
    </section>
  );
}