"use client";

import { useState } from "react";

type PlaylistSong = {
  title: string;
  url: string;
  videoId: string;
};

const playlistSongs: PlaylistSong[] = [
  {
    title: "Canción que escucho gracias a ti",
    url: "https://www.youtube.com/watch?v=sqUm9P_sY9M&list=RDsqUm9P_sY9M&start_radio=1",
    videoId: "sqUm9P_sY9M",
  },
  {
    title: "Canción que me recuerda a nosotros",
    url: "https://www.youtube.com/watch?v=J30WzfFO6vU&list=RDJ30WzfFO6vU&start_radio=1",
    videoId: "J30WzfFO6vU",
  },
  {
    title: "Canción de nuestro mejor día",
    url: "https://www.youtube.com/watch?v=OWoMlr4bUQ4&list=RDOWoMlr4bUQ4&start_radio=1",
    videoId: "OWoMlr4bUQ4",
  },
  {
    title: "Canción para cuando te echo de menos",
    url: "https://www.youtube.com/watch?v=iWMHHGDz8xc&list=RDiWMHHGDz8xc&start_radio=1",
    videoId: "iWMHHGDz8xc",
  },
  {
    title: "Canción que me pone feliz por ti",
    url: "https://www.youtube.com/watch?v=tD4HCZe-tew&list=RDtD4HCZe-tew&start_radio=1",
    videoId: "tD4HCZe-tew",
  },
  {
    title: "Canción para conducir contigo",
    url: "https://www.youtube.com/watch?v=c-szfuDO0_E&list=RDc-szfuDO0_E&start_radio=1",
    videoId: "c-szfuDO0_E",
  },
  {
    title: "Canción para bailar juntos",
    url: "https://www.youtube.com/watch?v=ah9XkCRc4fY&list=RDah9XkCRc4fY&start_radio=1",
    videoId: "ah9XkCRc4fY",
  },
  {
    title: "Canción para una noche tranquila contigo",
    url: "https://www.youtube.com/watch?v=dApon-QTq7U&list=RDdApon-QTq7U&start_radio=1",
    videoId: "dApon-QTq7U",
  },
];

export function PlaylistSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSong = playlistSongs[selectedIndex];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title text-blush">Playlist de los dos</h2>
      <p className="section-subtitle mt-3">Pulsa una tarjeta y escucha la canción aquí mismo, sin salir de la web.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {playlistSongs.map((song, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={song.videoId}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-blush/60 bg-blush/25 shadow-[0_8px_30px_rgba(255,145,190,0.2)]"
                    : "border-white/15 bg-white/10 hover:border-blush/45 hover:bg-blush/15"
                }`}
              >
                <p className="text-sm font-semibold text-mist md:text-base">{song.title}</p>
              </button>
            );
          })}
        </div>

        <div className="glass-card rounded-3xl p-4 md:p-5">
          <p className="text-sm font-semibold text-mist/95">{selectedSong.title}</p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/15">
            <iframe
              key={selectedSong.videoId}
              title={selectedSong.title}
              src={`https://www.youtube.com/embed/${selectedSong.videoId}?autoplay=1&rel=0&modestbranding=1`}
              className="aspect-video w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>

          <a
            href={selectedSong.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs font-medium text-blush/95 hover:text-blush"
          >
            Abrir en YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
