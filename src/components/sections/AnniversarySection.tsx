"use client";

import { useEffect, useMemo, useState } from "react";

type AnniversaryDiff = {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
};

const START_DATE = new Date("2025-03-15T20:00:00");

function getAnniversaryDiff(now: Date): AnniversaryDiff {
  if (now.getTime() <= START_DATE.getTime()) {
    return {
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
    };
  }

  let months =
    (now.getFullYear() - START_DATE.getFullYear()) * 12 +
    (now.getMonth() - START_DATE.getMonth());

  let monthAnchor = new Date(START_DATE);
  monthAnchor.setMonth(monthAnchor.getMonth() + months);

  if (monthAnchor.getTime() > now.getTime()) {
    months -= 1;
    monthAnchor = new Date(START_DATE);
    monthAnchor.setMonth(monthAnchor.getMonth() + months);
  }

  const remainderMs = now.getTime() - monthAnchor.getTime();
  const days = Math.floor(remainderMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainderMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainderMs / (1000 * 60)) % 60);
  const seconds = Math.floor((remainderMs / 1000) % 60);
  const totalDays = Math.floor((now.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
  };
}

function TimeCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-blush/35 bg-blush/15 px-4 py-4 text-center shadow-sm backdrop-blur-sm">
      <p className="text-3xl font-bold text-blush md:text-4xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-mist/80 md:text-sm">{label}</p>
    </div>
  );
}

export function AnniversarySection() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const diff = useMemo(() => getAnniversaryDiff(now), [now]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title text-blush">Modo aniversario</h2>
      <p className="section-subtitle mt-3 text-mist/90">
        Desde el 15 de marzo a las 20:00 · contador en vivo de cuánto lleváis juntos.
      </p>

      <div className="relative mt-8 overflow-hidden rounded-3xl border border-blush/35 bg-gradient-to-br from-blush/25 via-white/10 to-blush/10 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-blush/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-blush/20 blur-2xl" />

        <p className="relative text-center text-sm text-mist/85 md:text-base">
          Lleváis <span className="font-semibold text-blush">{diff.months} meses</span> y{" "}
          <span className="font-semibold text-blush">{diff.days} días</span> juntos 💗
        </p>

        <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <TimeCard label="Meses" value={diff.months} />
          <TimeCard label="Días" value={diff.days} />
          <TimeCard label="Horas" value={diff.hours} />
          <TimeCard label="Minutos" value={diff.minutes} />
          <TimeCard label="Segundos" value={diff.seconds} />
        </div>

        <p className="relative mt-5 text-center text-xs text-mist/75 md:text-sm">
          Total acumulado: {diff.totalDays} días desde vuestra fecha especial.
        </p>
      </div>
    </section>
  );
}
