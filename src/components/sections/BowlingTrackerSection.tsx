"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const CHART_WIDTH = 760;
const CHART_HEIGHT = 220;
const CHART_PADDING_X = 24;
const CHART_PADDING_Y = 18;

type Winner = "Spiderjusl" | "Esteban" | "Empate";

type BowlingMatch = {
  id: number;
  youScore: number;
  meScore: number;
  winner: Winner;
  playedAt: string;
};

function buildLinePoints(values: number[], scoreMax: number) {
  if (values.length === 0) {
    return "";
  }

  const innerWidth = CHART_WIDTH - CHART_PADDING_X * 2;
  const innerHeight = CHART_HEIGHT - CHART_PADDING_Y * 2;

  return values
    .map((value, index) => {
      const x =
        values.length === 1
          ? CHART_PADDING_X + innerWidth / 2
          : CHART_PADDING_X + (index / (values.length - 1)) * innerWidth;
      const normalized = value / scoreMax;
      const y = CHART_HEIGHT - CHART_PADDING_Y - normalized * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");
}

export function BowlingTrackerSection() {
  const { storedValue: matches, setStoredValue: setMatches } = useLocalStorage<BowlingMatch[]>(
    "valentine-bowling-matches",
    [],
  );
  const [imageRevealed, setImageRevealed] = useState(false);
  const [youScore, setYouScore] = useState(120);
  const [meScore, setMeScore] = useState(110);
  const [winner, setWinner] = useState<Winner>("Spiderjusl");

  const scoreMax = useMemo(() => {
    const topScore = Math.max(1, ...matches.flatMap((match) => [match.youScore, match.meScore]));
    return Math.ceil(topScore / 10) * 10;
  }, [matches]);

  const youPoints = useMemo(() => {
    if (matches.length === 0) {
      return "";
    }
    return buildLinePoints(matches.map((match) => match.youScore), scoreMax);
  }, [matches, scoreMax]);

  const mePoints = useMemo(() => {
    if (matches.length === 0) {
      return "";
    }
    return buildLinePoints(matches.map((match) => match.meScore), scoreMax);
  }, [matches, scoreMax]);

  const chartDots = useMemo(() => {
    if (matches.length === 0) {
      return [];
    }

    const innerWidth = CHART_WIDTH - CHART_PADDING_X * 2;
    const innerHeight = CHART_HEIGHT - CHART_PADDING_Y * 2;

    return matches.map((match, index) => {
      const x =
        matches.length === 1
          ? CHART_PADDING_X + innerWidth / 2
          : CHART_PADDING_X + (index / (matches.length - 1)) * innerWidth;

      const youY =
        CHART_HEIGHT - CHART_PADDING_Y - (Math.max(0, match.youScore) / scoreMax) * innerHeight;
      const meY =
        CHART_HEIGHT - CHART_PADDING_Y - (Math.max(0, match.meScore) / scoreMax) * innerHeight;

      return {
        x,
        youY,
        meY,
        id: match.id,
      };
    });
  }, [matches, scoreMax]);

  const addBowlingMatch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newMatch: BowlingMatch = {
      id: Date.now(),
      youScore: Math.max(0, youScore),
      meScore: Math.max(0, meScore),
      winner,
      playedAt: new Date().toISOString(),
    };

    setMatches((current) => [newMatch, ...current]);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title">Representación gráfica de bolos</h2>
      <p className="section-subtitle mt-3">
        Añade cuánto habéis quedado, quién ganó y guarda vuestro historial de partidas.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-mist/85">Historial y gráfica de partidas</p>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-mist/90">
              {matches.length} total
            </span>
          </div>

          <form onSubmit={addBowlingMatch} className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="text-xs text-mist/80">
              Spiderjusl
              <input
                type="number"
                min={0}
                max={300}
                value={youScore}
                onChange={(event) => setYouScore(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-mist outline-none ring-0"
              />
            </label>
            <label className="text-xs text-mist/80">
              Esteban
              <input
                type="number"
                min={0}
                max={300}
                value={meScore}
                onChange={(event) => setMeScore(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-mist outline-none ring-0"
              />
            </label>
            <label className="text-xs text-mist/80">
              Ganador
              <select
                value={winner}
                onChange={(event) => setWinner(event.target.value as Winner)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-mist outline-none ring-0"
              >
                <option value="Spiderjusl" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
                  Spiderjusl
                </option>
                <option value="Esteban" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
                  Esteban
                </option>
                <option value="Empate" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
                  Empate
                </option>
              </select>
            </label>

            <button
              type="submit"
              className="md:col-span-3 rounded-full bg-blush/35 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blush/50"
            >
              + Añadir ida a los bolos
            </button>
          </form>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-midnight/30 p-3">
            {matches.length === 0 ? (
              <p className="py-12 text-center text-sm text-mist/70">Aún no hay partidas registradas.</p>
            ) : (
              <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-56 w-full">
                <line
                  x1={CHART_PADDING_X}
                  y1={CHART_HEIGHT - CHART_PADDING_Y}
                  x2={CHART_WIDTH - CHART_PADDING_X}
                  y2={CHART_HEIGHT - CHART_PADDING_Y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <line
                  x1={CHART_PADDING_X}
                  y1={CHART_PADDING_Y}
                  x2={CHART_PADDING_X}
                  y2={CHART_HEIGHT - CHART_PADDING_Y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />

                <motion.polyline
                  points={youPoints}
                  fill="none"
                  stroke="rgba(253, 164, 175, 0.95)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                <motion.polyline
                  points={mePoints}
                  fill="none"
                  stroke="rgba(186, 230, 253, 0.95)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                />

                {chartDots.map((dot) => (
                  <g key={dot.id}>
                    <motion.circle
                      cx={dot.x}
                      cy={dot.youY}
                      r="5.5"
                      fill="rgba(255,255,255,0.95)"
                      stroke="rgba(253, 164, 175, 0.95)"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.22 }}
                    />
                    <motion.circle
                      cx={dot.x}
                      cy={dot.meY}
                      r="5.5"
                      fill="rgba(255,255,255,0.95)"
                      stroke="rgba(186, 230, 253, 0.95)"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.24 }}
                    />
                  </g>
                ))}
              </svg>
            )}
          </div>

          {matches.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex gap-3 text-xs text-mist/80">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" /> Spiderjusl
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-200" /> Esteban
                </span>
              </div>

              <div className="max-h-52 space-y-2 overflow-auto pr-1">
                {matches.map((match, index) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-mist/90"
                  >
                    <p className="font-medium">
                      Partida {matches.length - index}: Spiderjusl {match.youScore} - Esteban {match.meScore}
                    </p>
                    <p className="text-xs text-mist/70">
                      Ganó: {match.winner} · {new Date(match.playedAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="glass-card rounded-3xl p-5 md:p-6">
          <p className="text-sm text-mist/85">Imagen de ChatGPT (clic para revelar)</p>
          <motion.button
            type="button"
            onClick={() => setImageRevealed(true)}
            className="relative mt-4 block w-full overflow-hidden rounded-2xl border border-white/15"
            whileTap={{ scale: 0.99 }}
          >
            <motion.div
              className="relative h-72 w-full bg-white/10"
              animate={{
                filter: imageRevealed ? "blur(0px)" : "blur(18px)",
                scale: imageRevealed ? 1 : 1.03,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image
                src="/chatgpt-bolos.png"
                alt="Imagen de ChatGPT"
                fill
                className="object-cover"
              />
            </motion.div>
            {!imageRevealed && (
              <motion.span
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 text-sm font-semibold text-white"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                Haz click para quitar el borroso
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
