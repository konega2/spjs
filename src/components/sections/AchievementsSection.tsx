"use client";

import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const achievements: Achievement[] = [
  {
    id: "mountain-day",
    title: "Día de montaña juntos",
    description: "Esa ruta donde acabamos cansados pero felices.",
    icon: "⛰️",
  },
  {
    id: "three-bowling",
    title: "Ir a los bolos 3 semanas seguidas",
    description: "Nuestra mejor racha en la pista.",
    icon: "🎳",
  },
  {
    id: "rain-date",
    title: "Cita bajo la lluvia",
    description: "Porque incluso mojados seguimos siendo un buen plan.",
    icon: "🌧️",
  },
  {
    id: "late-call",
    title: "Llamada hasta tarde",
    description: "Horas hablando que se sienten como minutos.",
    icon: "📱",
  },
  {
    id: "random-trip",
    title: "Escapada random",
    description: "Ir a ningún sitio concreto, pero juntos.",
    icon: "🗺️",
  },
  {
    id: "movie-marathon",
    title: "Maratón de pelis",
    description: "Varias pelis seguidas con manta, comida y cero prisas.",
    icon: "🎬",
  },
  {
    id: "dance-session",
    title: "Baile épico juntos",
    description: "Ese baile donde te luciste y yo solo intenté seguirte.",
    icon: "💃",
  },
];

export function AchievementsSection() {
  const { storedValue: unlocked, setStoredValue: setUnlocked } = useLocalStorage<
    Record<string, boolean>
  >("valentine-achievements", {});

  const unlockedCount = achievements.filter((item) => unlocked[item.id]).length;

  const toggleAchievement = (id: string) => {
    setUnlocked((current: Record<string, boolean>) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title text-blush">Logros de pareja</h2>
      <p className="section-subtitle mt-3 text-mist/90">
        Medallitas por todas las cosas que ya hemos vivido (y las que faltan).
      </p>

      <div className="mt-6 flex items-center gap-3 text-sm text-mist/85">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-mist/90">
          {unlockedCount} / {achievements.length} logros desbloqueados
        </span>
        <span className="text-xs text-mist/65">Puedes marcarlos cuando sientas que ese logro ya es nuestro.</span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((item, index) => {
          const isUnlocked = Boolean(unlocked[item.id]);
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => toggleAchievement(item.id)}
              className={`flex h-full flex-col items-start rounded-3xl border p-4 text-left transition ${
                isUnlocked
                  ? "border-emerald-300/60 bg-emerald-400/10 shadow-[0_12px_30px_rgba(16,185,129,0.25)]"
                  : "border-white/12 bg-white/6 hover:border-blush/45 hover:bg-blush/10"
              }`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
            >
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${
                  isUnlocked ? "bg-emerald-400/20" : "bg-black/40"
                }`}
              >
                <span>{item.icon}</span>
              </div>
              <p className="text-sm font-semibold text-mist md:text-base">{item.title}</p>
              <p className="mt-1 text-xs text-mist/75 md:text-sm">{item.description}</p>

              <span
                className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  isUnlocked
                    ? "bg-emerald-400/25 text-emerald-100"
                    : "bg-white/8 text-mist/70"
                }`}
              >
                {isUnlocked ? "Desbloqueado" : "Pendiente"}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
