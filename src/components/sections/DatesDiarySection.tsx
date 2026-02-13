"use client";

import { AnimatePresence, motion } from "framer-motion";
import { dateIdeas } from "@/data/dateIdeas";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";

type CompletedDate = {
  id: number;
  ideaIndex: number;
  idea: string;
  rating: number;
  comment: string;
  photos: string[];
  completedAt: string;
};

type PlanStatus = "pendiente" | "hecha";

const MAX_PHOTOS = 3;
const DICE_SIZE = 240;
const ROLL_DURATION = 2.5;

type DiceFaceProps = {
  value: number;
};

function DiceFace({ value }: DiceFaceProps) {
  const positions: Record<number, string[]> = {
    1: ["center"],
    2: ["top-left", "bottom-right"],
    3: ["top-left", "center", "bottom-right"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: ["top-left", "top-right", "mid-left", "mid-right", "bottom-left", "bottom-right"],
  };

  const pipClass: Record<string, string> = {
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-left": "left-[26%] top-[26%] -translate-x-1/2 -translate-y-1/2",
    "top-right": "left-[74%] top-[26%] -translate-x-1/2 -translate-y-1/2",
    "mid-left": "left-[26%] top-1/2 -translate-x-1/2 -translate-y-1/2",
    "mid-right": "left-[74%] top-1/2 -translate-x-1/2 -translate-y-1/2",
    "bottom-left": "left-[26%] top-[74%] -translate-x-1/2 -translate-y-1/2",
    "bottom-right": "left-[74%] top-[74%] -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <>
      {positions[value].map((position, index) => (
        <span
          key={`${value}-${position}-${index}`}
          className={`absolute h-4 w-4 rounded-full bg-amber-950 shadow-[inset_0_1px_1px_rgba(255,214,128,0.25),0_3px_8px_rgba(0,0,0,0.45)] ${pipClass[position]}`}
        />
      ))}
    </>
  );
}

function faceRotation(face: number) {
  switch (face) {
    case 1:
      return { x: 0, y: 0, z: 0 };
    case 2:
      return { x: 0, y: -90, z: 0 };
    case 3:
      return { x: 90, y: 0, z: 0 };
    case 4:
      return { x: -90, y: 0, z: 0 };
    case 5:
      return { x: 0, y: 90, z: 0 };
    case 6:
      return { x: 0, y: 180, z: 0 };
    default:
      return { x: 0, y: 0, z: 0 };
  }
}

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
}

export function DatesDiarySection() {
  const { setStoredValue } = useLocalStorage<Record<number, PlanStatus>>("valentine-dates", {});
  const { storedValue: completedDates, setStoredValue: setCompletedDates } = useLocalStorage<
    CompletedDate[]
  >("valentine-dates-completed", []);

  const [activeIdeaIndex, setActiveIdeaIndex] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [cubeFace, setCubeFace] = useState(1);
  const [spinX, setSpinX] = useState(0);
  const [spinY, setSpinY] = useState(0);
  const [spinZ, setSpinZ] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [pendingPhotos, setPendingPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const jewelFaceClass =
    "absolute inset-0 rounded-[22px] border border-yellow-100/55 bg-[linear-gradient(145deg,#6f4707_0%,#ba8617_24%,#ffd76e_52%,#ad7410_78%,#5f3c05_100%)] shadow-[inset_0_0_28px_rgba(255,241,194,0.55),inset_0_-16px_22px_rgba(89,49,5,0.38),0_18px_45px_rgba(0,0,0,0.42)]";

  const setStatus = (index: number, status: PlanStatus) => {
    setStoredValue((current) => ({
      ...current,
      [index]: status,
    }));
  };

  const completedIndexes = useMemo(
    () => new Set(completedDates.map((entry) => entry.ideaIndex)),
    [completedDates],
  );

  const availableIndexes = useMemo(
    () => dateIdeas.map((_, index) => index).filter((index) => !completedIndexes.has(index)),
    [completedIndexes],
  );

  const pickRandomPlan = () => {
    if (availableIndexes.length === 0 || isRolling) {
      return;
    }

    const finalFace = Math.floor(Math.random() * 6) + 1;
    const roundsX = (Math.floor(Math.random() * 2) + 5) * 360;
    const roundsY = (Math.floor(Math.random() * 2) + 4) * 360;
    const roundsZ = (Math.floor(Math.random() * 2) + 2) * 360;

    setIsRolling(true);
    setCubeFace(finalFace);
    setSpinX((current) => current + roundsX);
    setSpinY((current) => current + roundsY);
    setSpinZ((current) => current + roundsZ);

    window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableIndexes.length);
      setActiveIdeaIndex(availableIndexes[randomIndex]);
      setRating(5);
      setComment("");
      setPendingPhotos([]);
      setIsRolling(false);
    }, ROLL_DURATION * 1000);
  };

  const closePlanModal = () => {
    setActiveIdeaIndex(null);
    setComment("");
    setPendingPhotos([]);
    setRating(5);
  };

  const onUploadPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const allowedCount = Math.max(0, MAX_PHOTOS - pendingPhotos.length);
    const filesToRead = files.slice(0, allowedCount);
    if (filesToRead.length === 0) {
      return;
    }

    setUploading(true);
    try {
      // Guardamos como base64 para poder persistir las fotos en localStorage.
      const encodedPhotos = await Promise.all(filesToRead.map((file) => toBase64(file)));
      setPendingPhotos((current) => [...current, ...encodedPhotos].slice(0, MAX_PHOTOS));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const saveCompletedDate = () => {
    if (activeIdeaIndex === null) {
      return;
    }

    const idea = dateIdeas[activeIdeaIndex];
    const newEntry: CompletedDate = {
      id: Date.now(),
      ideaIndex: activeIdeaIndex,
      idea,
      rating,
      comment: comment.trim(),
      photos: pendingPhotos,
      completedAt: new Date().toISOString(),
    };

    setCompletedDates((current) => [newEntry, ...current]);
    setStatus(activeIdeaIndex, "hecha");
    closePlanModal();
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="section-title">Diario de citas</h2>
      <p className="section-subtitle mt-3">
        gira el dado para que salga una cita random amor
      </p>

      <div className="mt-8 glass-card rounded-3xl p-5 md:p-7">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <p className="text-sm text-mist/80">Generador de plan aleatorio</p>
            <h3 className="mt-1 text-xl font-semibold md:text-2xl">¿Qué hacemos hoy?</h3>
          </div>

          <div className="relative mx-auto w-full max-w-[820px] overflow-visible" style={{ perspective: "1600px" }}>
            <div
              className="pointer-events-none absolute left-1/2 top-[77%] h-28 w-[92%] -translate-x-1/2 rounded-[999px]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,235,190,0.16) 0%, rgba(255,220,150,0.06) 36%, rgba(0,0,0,0) 74%)",
                transform: "rotateX(74deg)",
              }}
            />

            <motion.div
              className="absolute left-1/2 top-[88%] h-10 w-56 -translate-x-1/2 rounded-full bg-black/40 blur-xl"
              animate={
                isRolling
                  ? {
                      x: ["0vw", "8vw", "20vw", "31vw", "40vw", "47vw", "52vw"],
                      scaleX: [1, 1.65, 1.38, 1.2, 1.12, 1.06, 1],
                      scaleY: [1, 0.8, 0.9, 0.96, 0.98, 1, 1],
                      opacity: [0.42, 0.7, 0.62, 0.55, 0.5, 0.47, 0.44],
                    }
                  : { x: 0, scaleX: 1, scaleY: 1, opacity: 0.42 }
              }
              transition={{
                duration: ROLL_DURATION,
                times: [0, 0.1, 0.26, 0.45, 0.64, 0.82, 1],
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="relative mx-auto w-fit cursor-pointer"
              animate={
                isRolling
                  ? {
                      x: ["0vw", "8vw", "20vw", "31vw", "40vw", "47vw", "52vw"],
                      y: [0, -34, -10, -18, -6, -9, 0],
                    }
                  : { x: 0, y: 0 }
              }
              transition={{
                duration: ROLL_DURATION,
                times: [0, 0.1, 0.26, 0.45, 0.64, 0.82, 1],
                ease: [0.22, 0.74, 0.2, 1],
              }}
              whileHover={!isRolling ? { scale: 1.03 } : undefined}
              whileTap={!isRolling ? { scale: 0.98 } : undefined}
              onClick={pickRandomPlan}
              aria-label="Lanzar dado"
            >
              <div
                className="relative"
                style={{
                  width: `${DICE_SIZE}px`,
                  height: `${DICE_SIZE}px`,
                  transformStyle: "preserve-3d",
                  transition: `transform ${ROLL_DURATION}s cubic-bezier(0.2, 0.75, 0.2, 1)`,
                  transform: `rotateX(${spinX + faceRotation(cubeFace).x}deg) rotateY(${spinY + faceRotation(cubeFace).y}deg) rotateZ(${spinZ + faceRotation(cubeFace).z}deg)`,
                }}
              >
                <div className={jewelFaceClass} style={{ transform: `translateZ(${DICE_SIZE / 2}px)` }}>
                  <DiceFace value={1} />
                </div>
                <div className={jewelFaceClass} style={{ transform: `rotateY(90deg) translateZ(${DICE_SIZE / 2}px)` }}>
                  <DiceFace value={2} />
                </div>
                <div className={jewelFaceClass} style={{ transform: `rotateX(-90deg) translateZ(${DICE_SIZE / 2}px)` }}>
                  <DiceFace value={3} />
                </div>
                <div className={jewelFaceClass} style={{ transform: `rotateX(90deg) translateZ(${DICE_SIZE / 2}px)` }}>
                  <DiceFace value={4} />
                </div>
                <div className={jewelFaceClass} style={{ transform: `rotateY(-90deg) translateZ(${DICE_SIZE / 2}px)` }}>
                  <DiceFace value={5} />
                </div>
                <div className={jewelFaceClass} style={{ transform: `rotateY(180deg) translateZ(${DICE_SIZE / 2}px)` }}>
                  <DiceFace value={6} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <p className="mt-4 text-xs text-mist/70">Pulsa el dado dorado y te saldrá un plan aleatorio en pantalla.</p>
      </div>

      <AnimatePresence>
        {activeIdeaIndex !== null && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePlanModal}
          >
            <motion.div
              className="glass-card w-full max-w-xl rounded-3xl border border-white/20 p-5 md:p-6"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-xs text-blush/90">Plan #{activeIdeaIndex + 1}</p>
              <p className="mt-2 text-base font-medium text-mist md:text-lg">{dateIdeas[activeIdeaIndex]}</p>

              <div className="mt-5">
                <p className="text-sm font-semibold text-mist/85">Puntuación de la cita</p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const current = index + 1;
                    const active = current <= rating;
                    return (
                      <button
                        key={current}
                        className={`h-9 w-9 rounded-full text-lg transition ${
                          active ? "bg-blush/35" : "bg-white/10"
                        }`}
                        onClick={() => setRating(current)}
                        aria-label={`Puntuar ${current}`}
                      >
                        💙
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-mist/85">Comentario de la cita</p>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Qué fue lo mejor de este plan..."
                  className="mt-2 min-h-24 w-full rounded-2xl border border-white/20 bg-white/8 px-3 py-2 text-sm text-white placeholder:text-mist/50 outline-none focus:border-blush/55"
                />
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-mist/85">Fotos de la cita (hasta 3)</p>
                <label className="mt-2 inline-flex cursor-pointer rounded-full bg-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/20">
                  {uploading ? "Subiendo..." : "Subir fotos"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onUploadPhotos}
                  />
                </label>

                {pendingPhotos.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {pendingPhotos.map((photo, index) => (
                      <Image
                        key={`${photo.slice(0, 20)}-${index}`}
                        src={photo}
                        alt={`Foto de cita ${index + 1}`}
                        width={300}
                        height={200}
                        unoptimized
                        className="h-24 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  className="w-full rounded-full bg-white/12 px-5 py-3 text-sm font-semibold transition hover:bg-white/18"
                  onClick={closePlanModal}
                >
                  Cerrar
                </button>
                <button
                  className="w-full rounded-full bg-emerald-400/30 px-5 py-3 text-sm font-semibold transition hover:bg-emerald-400/42"
                  onClick={saveCompletedDate}
                >
                  Guardar como cita completada
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12">
        <h3 className="text-xl font-semibold md:text-2xl">Citas completadas</h3>
        <p className="mt-2 text-sm text-mist/75">Aquí se guardan con su puntuación y sus fotos.</p>

        {completedDates.length === 0 ? (
          <div className="glass-card mt-4 rounded-2xl p-4 text-sm text-mist/80">
            Aún no hay citas completadas guardadas.
          </div>
        ) : (
          <>
            <p className="mt-4 text-xs text-mist/65 sm:hidden">Modo recuerdos: desliza para ver vuestra historia 👉</p>

            <div className="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:hidden">
              {completedDates.map((entry) => (
                <article key={entry.id} className="glass-card min-w-[86%] snap-center rounded-2xl p-4">
                  <p className="text-xs text-blush/90">Cita #{entry.ideaIndex + 1}</p>
                  <h4 className="mt-1 text-sm font-semibold text-mist">{entry.idea}</h4>
                  <p className="mt-2 text-xs text-mist/75">
                    Puntuación: {"💙".repeat(entry.rating)} ({entry.rating}/5)
                  </p>
                  {entry.comment && <p className="mt-2 text-xs italic text-mist/85">“{entry.comment}”</p>}
                  <p className="mt-1 text-xs text-mist/65">
                    {new Date(entry.completedAt).toLocaleDateString("es-ES")}
                  </p>

                  {entry.photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {entry.photos.map((photo, index) => (
                        <Image
                          key={`${entry.id}-${index}`}
                          src={photo}
                          alt={`Recuerdo ${index + 1}`}
                          width={300}
                          height={200}
                          unoptimized
                          className="h-20 w-full rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-4 hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
              {completedDates.map((entry) => (
                <article key={entry.id} className="glass-card rounded-2xl p-4">
                  <p className="text-xs text-blush/90">Cita #{entry.ideaIndex + 1}</p>
                  <h4 className="mt-1 text-sm font-semibold text-mist">{entry.idea}</h4>
                  <p className="mt-2 text-xs text-mist/75">
                    Puntuación: {"💙".repeat(entry.rating)} ({entry.rating}/5)
                  </p>
                  {entry.comment && <p className="mt-2 text-xs italic text-mist/85">“{entry.comment}”</p>}
                  <p className="mt-1 text-xs text-mist/65">
                    {new Date(entry.completedAt).toLocaleDateString("es-ES")}
                  </p>

                  {entry.photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {entry.photos.map((photo, index) => (
                        <Image
                          key={`${entry.id}-${index}`}
                          src={photo}
                          alt={`Recuerdo ${index + 1}`}
                          width={300}
                          height={200}
                          unoptimized
                          className="h-20 w-full rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}