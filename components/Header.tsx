"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { TELEGRAM_URL } from "@/lib/products";
import { useUI } from "./Providers";

const NAV = [
  { href: "#catalog", label: "Каталог" },
  { href: "#how", label: "Як замовити" },
  { href: "#reviews", label: "Відгуки" },
];

export function Header() {
  const { count, setCartOpen, paused, togglePaused } = useUI();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(v > 40);
    setHidden(v > 300 && v > prev + 4);
    if (v < prev - 4) setHidden(false);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5"
    >
      <a
        href="#catalog"
        className="sr-only rounded-full bg-ink px-5 py-3 text-sm text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Перейти до каталогу
      </a>
      <div
        className={`mx-auto flex h-14 max-w-[1440px] items-center justify-between rounded-2xl px-4 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:px-5 ${
          solid ? "bg-paper/70 shadow-[0_1px_0_rgb(0_0_0/0.06),0_12px_40px_-20px_rgb(0_0_0/0.35)] backdrop-blur-xl backdrop-saturate-150 lite:bg-paper/95 lite:backdrop-blur-none" : ""
        }`}
      >
        <a href="#top" aria-label="JASST STORE, на початок" className="shrink-0">
          <Image src="/logo-black.svg" unoptimized alt="JASST" width={4192} height={1178} priority className="h-6 w-auto sm:h-7" />
        </a>

        <nav aria-label="Розділи" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-4 py-2 text-sm text-graphite transition-colors hover:bg-black/5 hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePaused}
            aria-pressed={paused}
            aria-label={paused ? "Увімкнути анімацію" : "Зупинити анімацію"}
            title={paused ? "Увімкнути анімацію" : "Зупинити анімацію"}
            className="flex size-10 items-center justify-center rounded-full text-graphite transition-colors hover:bg-black/5 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
              {paused ? <path d="M8 5.5v13l10.5-6.5L8 5.5Z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
            </svg>
          </button>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full px-4 py-2 text-sm text-graphite transition-colors hover:text-ink sm:block"
          >
            Telegram
          </a>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 items-center gap-2 rounded-full bg-ink pl-4 pr-3 text-sm text-white transition-[transform,background-color] hover:bg-black/80 active:scale-95"
            aria-label={`Кошик, ${count} шт`}
          >
            Кошик
            <span className="relative flex h-6 min-w-6 items-center justify-center overflow-hidden rounded-full bg-white px-1.5 text-xs font-medium text-ink tabular">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
