"use client";

import { motion } from "framer-motion";

const FACTS = [
  { big: "1–2 дні", text: "Доставка речей з наявності. Відправляємо одразу після підтвердження.", dot: true },
  { big: "12–18 днів", text: "Під замовлення. Ціна вказана без доставки, її рахуємо окремо.", dot: false },
];

export function Facts() {
  return (
    <section aria-label="Терміни доставки" className="mx-auto grid max-w-[1100px] gap-3 px-5 pb-20 pt-6 sm:grid-cols-2 sm:gap-6 sm:pb-28">
      {FACTS.map((f, i) => (
        <motion.div
          key={f.big}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          className="rounded-[26px] bg-paper p-6 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.35)] ring-1 ring-black/5 sm:p-8 lite:shadow-none"
        >
          <p className="flex items-center gap-3 font-display text-[clamp(28px,4vw,48px)] font-semibold leading-none tracking-[-0.03em]">
            <span aria-hidden className={`inline-block size-3 shrink-0 rounded-full ${f.dot ? "bg-signal" : "ring-2 ring-inset ring-ink"}`} />
            {f.big}
          </p>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-graphite">{f.text}</p>
        </motion.div>
      ))}
    </section>
  );
}
