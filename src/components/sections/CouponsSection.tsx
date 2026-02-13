"use client";

import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Coupon = {
  id: string;
  title: string;
  detail: string;
};

const coupons: Coupon[] = [
  { id: "cine", title: "🎬 Cupón por ir al cine", detail: "combo parejas xl no?" },
  { id: "coche", title: "🏍 Cupón por dejarte mi moto", detail: "pero con cuidado porfis 😢" },
  { id: "pelis", title: "🎥 Cupón por noche de pelis", detail: "Maratón infinita contigo." },
  { id: "montana", title: "🌄 Cupón por ir a la montaña", detail: "va y si te canssas te subo al caballito (va a pasar al reves)" },
  { id: "moto", title: "🏍 Cupón por ruta en moto", detail: "A donde nos lleve la carretera." },
  { id: "bolos", title: "🎳 Cupón por partida de bolos", detail: "Aunque me ganes." },
  { id: "karts", title: "🏎 Cupón por ir a los karts", detail: "prometo no motivarme" },
  { id: "pueblo", title: "🌍 Cupón por escapada random", detail: "A un pueblo elegido al azar." },
  { id: "sorpresa", title: "🌃 Cupón por noche sorpresa", detail: "Plan secreto en modo premium." },
  { id: "siempre", title: "⏰ Cupón por ir a donde estés", detail: "A la hora que sea." },
];

type CouponCardProps = {
  coupon: Coupon;
  redeemed: boolean;
  onToggleRedeemed: () => void;
};

function CouponCard({ coupon, redeemed, onToggleRedeemed }: CouponCardProps) {
  return (
    <motion.div
      className="group [perspective:1200px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-56 w-full rounded-2xl transition duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="glass-card absolute inset-0 rounded-2xl p-5 [backface-visibility:hidden]">
          <h3 className="text-lg font-semibold text-mist">{coupon.title}</h3>
          <p className="mt-3 text-sm text-white/80">Pasa el cursor para ver detalle</p>
          <div className="mt-10 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs">
            {redeemed ? "Canjeado ✅" : "Disponible"}
          </div>
        </div>

        <div className="glass-card absolute inset-0 rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm text-mist/90">{coupon.detail}</p>
          <motion.button
            className={`mt-6 rounded-full px-4 py-2 text-sm font-semibold transition ${
              redeemed
                ? "bg-emerald-400/25 text-emerald-100"
                : "bg-blush/35 text-white hover:bg-blush/50"
            }`}
            whileTap={{ scale: 0.94 }}
            onClick={onToggleRedeemed}
          >
            {redeemed ? "Marcar como pendiente" : "Marcar como canjeado"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function CouponsSection() {
  const { storedValue, setStoredValue } = useLocalStorage<Record<string, boolean>>(
    "valentine-coupons",
    {},
  );

  const toggleRedeemed = (id: string) => {
    setStoredValue((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="section-title">Cupones digitales interactivos</h2>
      <p className="section-subtitle mt-3">10 promesas reales para disfrutar juntos.</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            redeemed={Boolean(storedValue[coupon.id])}
            onToggleRedeemed={() => toggleRedeemed(coupon.id)}
          />
        ))}
      </div>
    </section>
  );
}