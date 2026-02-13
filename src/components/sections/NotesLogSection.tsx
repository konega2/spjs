"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type NoteEntry = {
  id: number;
  text: string;
  createdAt: string;
};

const MAX_NOTES = 80;
const DEFAULT_NOTES: NoteEntry[] = [
  {
    id: 1,
    text: "Hoy me has hecho feliz por cómo me has mirado.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    text: "Hoy me has hecho feliz por ese abrazo sin razón.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    text: "Hoy me has hecho feliz por aguantar mis rayadas.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    text: "Hoy me has hecho feliz por hacerme reír cuando lo necesitaba.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    text: "Hoy me has hecho feliz por estar simplemente conmigo.",
    createdAt: new Date().toISOString(),
  },
];

export function NotesLogSection() {
  const { storedValue: notes, setStoredValue: setNotes, hydrated } = useLocalStorage<NoteEntry[]>(
    "valentine-notes-log",
    DEFAULT_NOTES,
  );
  const [input, setInput] = useState("");

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notes],
  );

  useEffect(() => {
    if (!hydrated) return;

    setNotes((current) => {
      const missingDefaults = DEFAULT_NOTES.filter(
        (defaultNote) => !current.some((note) => note.text === defaultNote.text),
      );

      if (missingDefaults.length === 0) return current;

      return [...missingDefaults, ...current].slice(0, MAX_NOTES);
    });
  }, [hydrated, setNotes]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;

    const newEntry: NoteEntry = {
      id: Date.now(),
      text: value,
      createdAt: new Date().toISOString(),
    };

    setNotes((current) => [newEntry, ...current].slice(0, MAX_NOTES));
    setInput("");
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="section-title text-blush">Log de notitas</h2>
      <p className="section-subtitle mt-3 text-mist/90">
        Un pequeño muro para escribir cosas tipo &quot;hoy me has hecho feliz por...&quot; y guardarlas para siempre.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_1.2fr]">
        <form
          onSubmit={handleSubmit}
          className="glass-card flex flex-col justify-between rounded-3xl p-5 md:p-6"
        >
          <div>
            <p className="text-sm text-mist/85">Nueva notita</p>
            <p className="mt-1 text-xs text-mist/65">Escribe algo corto que quieras recordar de hoy.</p>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={220}
              rows={4}
              className="mt-4 w-full resize-none rounded-2xl border border-white/15 bg-white/8 px-3 py-3 text-sm text-mist outline-none ring-0 placeholder:text-mist/40"
              placeholder="Hoy me has hecho feliz por..."
            />
            <div className="mt-1 text-right text-[11px] text-mist/60">
              {input.length}/220
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blush/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blush/55"
          >
            Guardar notita
          </button>
        </form>

        <div className="glass-card rounded-3xl p-5 md:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-mist/90">Archivo de notitas</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-mist/70">
              {sortedNotes.length} guardadas
            </span>
          </div>

          {sortedNotes.length === 0 ? (
            <p className="mt-6 text-sm text-mist/70">
              Aún no hay notitas. Empieza escribiendo la primera sobre algo bonito que haya pasado hoy.
            </p>
          ) : (
            <div className="mt-4 max-h-[320px] space-y-3 overflow-auto pr-1">
              <AnimatePresence>
                {sortedNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-mist/95"
                  >
                    <p>{note.text}</p>
                    <p className="mt-1 text-[11px] text-mist/55">
                      {new Date(note.createdAt).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
