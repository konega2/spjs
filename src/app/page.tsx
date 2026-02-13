"use client";

import { useEffect, useRef, useState } from "react";
import { BackgroundDaisies } from "@/components/BackgroundDaisies";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { EasterEggModal } from "@/components/EasterEggModal";
import { SeparatorBrush } from "@/components/SeparatorBrush";
import { CinematicIntro } from "@/components/sections/CinematicIntro";
import { AnniversarySection } from "@/components/sections/AnniversarySection";
import { BowlingTrackerSection } from "@/components/sections/BowlingTrackerSection";
import { CouponsSection } from "@/components/sections/CouponsSection";
import { DatesDiarySection } from "@/components/sections/DatesDiarySection";
import { EssenceSection } from "@/components/sections/EssenceSection";
import { HeroineSection } from "@/components/sections/HeroineSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { NotesLogSection } from "@/components/sections/NotesLogSection";
import { WishesJarSection } from "@/components/sections/WishesJarSection";
import { PlaylistSection } from "@/components/sections/PlaylistSection";
import { ValentineQuestion } from "@/components/sections/ValentineQuestion";
import { PasswordGate } from "@/components/PasswordGate";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function HomePage() {
  const {
    storedValue: accessGranted,
    setStoredValue: setAccessGranted,
    hydrated,
  } = useLocalStorage<boolean>("valentine-access-granted", false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const bufferRef = useRef("");

  const scrollToContent = () => {
    document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!hydrated || !accessGranted) {
      document.title = "Access Restricted";
      return;
    }

    document.title = "San Valentín Interactivo 💙";
  }, [hydrated, accessGranted]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (!/^[A-Z]$/.test(key)) {
        return;
      }
      const nextValue = `${bufferRef.current}${key}`.slice(-4);
      bufferRef.current = nextValue;
      if (nextValue === "PAUL") {
        setEasterEggOpen(true);
        bufferRef.current = "";
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-slate-300">
        <span className="text-[10px] tracking-[0.28em] uppercase text-slate-500">Initializing</span>
      </main>
    );
  }

  if (!accessGranted) {
    return <PasswordGate onUnlock={() => setAccessGranted(true)} />;
  }

  return (
    <main className="relative isolate overflow-hidden">
      <BackgroundDaisies />
      <BackgroundMusic />

      <div className="relative z-10">
        <CinematicIntro onDiscover={scrollToContent} />

        <section id="main-content" className="pt-4">
          <ValentineQuestion />
          <SeparatorBrush />
          <CouponsSection />
          <SeparatorBrush />
          <PlaylistSection />
          <SeparatorBrush />
          <AnniversarySection />
          <SeparatorBrush />
          <AchievementsSection />
          <SeparatorBrush />
          <NotesLogSection />
          <SeparatorBrush />
          <WishesJarSection />
          <SeparatorBrush />
          <BowlingTrackerSection />
          <SeparatorBrush />
          <DatesDiarySection />
          <SeparatorBrush />
          <HeroineSection />
          <SeparatorBrush />
          <EssenceSection />
        </section>
      </div>

      <EasterEggModal open={easterEggOpen} onClose={() => setEasterEggOpen(false)} />
    </main>
  );
}