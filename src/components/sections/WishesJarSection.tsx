"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type WishEntry = {
  id: number;
  text: string;
  createdAt: string;
  done: boolean;
};

const MAX_WISHES = 60;

export function WishesJarSection() {
  const { storedValue: wishes, setStoredValue: setWishes } = useLocalStorage<WishEntry[]>(
    "valentine-wishes-jar",
    [],
  );
  const [input, setInput] = useState("");

  const sortedWishes = useMemo(
    () => [...wishes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [wishes],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;

    const newWish: WishEntry = {
      id: Date.now(),
      text: value,
      createdAt: new Date().toISOString(),
      done: false,
    };

    setWishes((current) => [newWish, ...current].slice(0, MAX_WISHES));
    setInput("");
  };

  const toggleDone = (id: number) => {
    setWishes((current) =>
      current.map((wish) => (wish.id === id ? { ...wish, done: !wish.done } : wish)),
    );
  };

  const doneCount = sortedWishes.filter((wish) => wish.done).length;

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="section-title text-blush">Bote de deseos</h2>
      <p className="section-subtitle mt-3 text-mist/90">
        Un sitio donde tú puedes dejar planes o deseos que te apetece que hagamos juntos, y luego los vamos
        marcando como cumplidos.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.05fr_1.25fr]">
        <form
          onSubmit={handleSubmit}
          className="glass-card flex flex-col justify-between rounded-3xl p-5 md:p-6"
        >
          <div>
            <p className="text-sm text-mist/85">Nuevo deseo</p>
            <p className="mt-1 text-xs text-mist/65">
              Escribe un plan o algo que te haga ilusión hacer conmigo. Lo guardaremos en este bote.
            </p>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={220}
              rows={4}
              className="mt-4 w-full resize-none rounded-2xl border border-white/15 bg-white/8 px-3 py-3 text-sm text-mist outline-none ring-0 placeholder:text-mist/40"
              placeholder="Ir juntos a... / Quiero que un día..."
            />
            <div className="mt-1 text-right text-[11px] text-mist/60">{input.length}/220</div>
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blush/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blush/55"
          >
            Guardar deseo en el bote
          </button>
        </form>

        <div className="glass-card rounded-3xl p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-mist/90">Lista de deseos</p>
              <p className="mt-0.5 text-[11px] text-mist/65">
                Podemos ir marcando los que ya hayamos cumplido.
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-mist/70">
              {doneCount} cumplidos · {sortedWishes.length} en el bote
            </span>
          </div>

          {sortedWishes.length === 0 ? (
            <p className="mt-6 text-sm text-mist/70">
              Aún no hay deseos en el bote. Empieza escribiendo el primero que te haga ilusión.
            </p>
          ) : (
            <div className="mt-4 max-h-[320px] space-y-3 overflow-auto pr-1">
              <AnimatePresence>
                {sortedWishes.map((wish) => (
                  <motion.button
                    key={wish.id}
                    type="button"
                    onClick={() => toggleDone(wish.id)}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className={`flex w-full flex-col items-start rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                      wish.done
                        ? "border-emerald-300/60 bg-emerald-400/10 text-mist/95 shadow-[0_10px_25px_rgba(16,185,129,0.22)]"
                        : "border-white/10 bg-white/6 text-mist/95 hover:border-blush/45 hover:bg-blush/10"
                    }`}
                  >
                    <p className={wish.done ? "line-through decoration-emerald-300/70" : undefined}>{wish.text}</p>
                    <div className="mt-1 flex w-full items-center justify-between text-[11px] text-mist/55">
                      <span>
                        {new Date(wish.createdAt).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          wish.done
                            ? "bg-emerald-400/25 text-emerald-100"
                            : "bg-white/10 text-mist/70"
                        }`}
                      >
                        {wish.done ? "Cumplido" : "Pendiente"}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
