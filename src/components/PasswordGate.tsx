"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type PasswordGateProps = {
  onUnlock: () => void;
};

const SECRET_PASSWORD = "Shawn_Frost";

type ViewMode = "password" | "countdown";

function getUnlockDate() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const thisYearUnlock = new Date(currentYear, 1, 14, 0, 0, 0);

  if (now.getTime() <= thisYearUnlock.getTime()) {
    return thisYearUnlock;
  }

  return new Date(currentYear + 1, 1, 14, 0, 0, 0);
}

function getCountdownParts(targetDate: Date) {
  const now = Date.now();
  const difference = Math.max(0, targetDate.getTime() - now);

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    total: difference,
    hours,
    minutes,
    seconds,
  };
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("password");
  const unlockDateRef = useRef(getUnlockDate());
  const [countdown, setCountdown] = useState(() => getCountdownParts(unlockDateRef.current));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value === SECRET_PASSWORD) {
      setError("");
      onUnlock();
    } else {
      setError("Wrong password");
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextValue = getCountdownParts(unlockDateRef.current);
      setCountdown(nextValue);
      if (nextValue.total <= 0) {
        window.clearInterval(timer);
        onUnlock();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [onUnlock]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black text-mist">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.16),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(148,163,184,0.12),_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl px-6 sm:px-10"
      >
        <div className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-400">
          Access Restricted
        </div>

        <div className="glass-card border-white/10 bg-black/70 p-8 sm:p-10 backdrop-blur-2xl">
          {viewMode === "password" ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-400">Password</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[0.18em] text-slate-100">ENTER KEYCODE</h1>
                <p className="mt-3 text-[11px] text-slate-500">
                  Private access only. Type the correct key to unlock the session.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="••••••••••"
                    className="w-full rounded-2xl border border-slate-600 bg-black/60 px-4 py-3.5 pr-11 text-base text-slate-100 outline-none transition focus:border-slate-300 focus:ring-0"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-2 right-3 flex items-center rounded-full bg-black/40 px-2 text-xs text-slate-400 transition hover:bg-slate-700/60 hover:text-slate-100"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                  <div className="pointer-events-none absolute inset-x-3 -bottom-4 flex justify-between text-[10px] text-slate-500">
                    <span>Case sensitive</span>
                    <span>v-02</span>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-slate-100/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.26em] text-slate-100 transition hover:bg-slate-100/20"
              >
                Unlock
              </button>

              <button
                type="button"
                onClick={() => setViewMode("countdown")}
                className="mt-3 w-full text-center text-xs text-slate-400 transition hover:text-slate-200"
              >
                ¿No te la sabes?
              </button>
            </form>
          ) : (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-400">Countdown</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[0.1em] text-slate-100 sm:text-3xl">
                La web se desbloqueará automáticamente en
              </h1>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-700 bg-black/55 p-3 text-center">
                  <p className="text-2xl font-semibold text-slate-100 sm:text-3xl">{countdown.hours}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Horas</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-black/55 p-3 text-center">
                  <p className="text-2xl font-semibold text-slate-100 sm:text-3xl">{countdown.minutes}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Minutos</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-black/55 p-3 text-center">
                  <p className="text-2xl font-semibold text-slate-100 sm:text-3xl">{countdown.seconds}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Segundos</p>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-500">
                Se desbloquea a las 00:00 del 14 de febrero (noche del 13).
              </p>

              <button
                type="button"
                onClick={() => setViewMode("password")}
                className="mt-5 w-full rounded-full border border-slate-700 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
              >
                Volver
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
