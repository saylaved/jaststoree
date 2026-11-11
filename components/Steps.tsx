"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealText } from "./Reveal";

const STEPS = [
  { t: "Обираєте річ і розмір", d: "Додайте в кошик кілька речей або натисніть «Замовити в Telegram» на картці товару." },
  { t: "Надсилаєте замовлення в Telegram", d: "Список копіюється автоматично. Відкриється чат @jasst_store: вставте текст і надішліть." },
  { t: "Ми відправляємо посилку", d: "Після відправки надсилаємо номер ТТН для відстеження і посилання на чек." },
  { t: "Забираєте на пошті", d: "Залиште відгук, і на наступне замовлення буде знижка 5%." },
];

export function Steps() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="how" className="scroll-mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-28 sm:px-8 sm:py-36 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <RevealText text="Як замовити" className="font-display text-[clamp(40px,6.4vw,96px)] font-semibold leading-[0.92] tracking-[-0.05em]" />
          <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-white/60">
            Замовлення приймаємо в Telegram. Без реєстрації, без форм: кошик збирає список, ви його надсилаєте.
          </p>
        </div>

        <ol ref={ref} className="relative flex flex-col gap-4 pl-10 sm:pl-14">
          <span aria-hidden className="absolute bottom-6 left-[15px] top-6 w-px bg-white/15 sm:left-[19px]" />
          <motion.span
            aria-hidden
            style={{ scaleY: line }}
            className="absolute bottom-6 left-[15px] top-6 w-px origin-top bg-signal sm:left-[19px]"
          />
          {STEPS.map((s, i) => (
            <Step key={s.t} i={i} title={s.t} text={s.d} progress={line} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ i, title, text, progress }: { i: number; title: string; text: string; progress: ReturnType<typeof useSpring> }) {
  const at = i / (STEPS.length - 1);
  const lit = useTransform(progress, [Math.max(0, at - 0.12), at], [0, 1]);
  const bg = useTransform(lit, (v) => `rgb(${59 * v} ${43 * v} ${255 * v} / ${0.15 + 0.85 * v})`);
  return (
    <motion.li
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i }}
      className="relative rounded-[26px] bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8"
    >
      <motion.span
        aria-hidden
        style={{ backgroundColor: bg }}
        className="absolute -left-10 top-7 flex size-[31px] items-center justify-center rounded-full text-[13px] font-medium tabular ring-1 ring-white/20 sm:-left-14 sm:size-[39px] sm:top-8"
      >
        {i + 1}
      </motion.span>
      <h3 className="font-display text-[clamp(20px,2vw,26px)] font-semibold tracking-[-0.03em]">{title}</h3>
      <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-white/60">{text}</p>
    </motion.li>
  );
}
