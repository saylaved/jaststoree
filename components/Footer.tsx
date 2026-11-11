"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/products";
import { Magnetic } from "./Magnetic";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="max-w-[22ch] text-balance font-display text-[clamp(30px,4.4vw,60px)] font-semibold leading-[1] tracking-[-0.04em]">
              Питання щодо розміру чи наявності? Пишіть.
            </p>
            <div className="mt-8">
              <Magnetic>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor=""
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-white pl-6 pr-2 text-[15px] font-medium text-ink transition-colors hover:bg-white/90"
                >
                  @{TELEGRAM_HANDLE}
                  <span className="flex size-10 items-center justify-center rounded-full bg-signal text-white">
                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                      <path d="M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.5-1.4ZM9.2 14l8.5-5.4c.4-.2.7-.1.4.2l-7 6.4-.3 3.2L9.2 14Z" />
                    </svg>
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
          <nav aria-label="Нижнє меню" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
            <a href="#catalog" className="hover:text-white">Каталог</a>
            <a href="#how" className="hover:text-white">Як замовити</a>
            <a href="#reviews" className="hover:text-white">Відгуки</a>
            <a href="#top" className="hover:text-white">Вгору</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[1440px] overflow-hidden px-3 sm:px-6" aria-hidden>
        <motion.div
          initial={{ y: "70%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image src="/logo-white.svg" unoptimized alt="" width={4192} height={1178} className="h-auto w-full" />
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-[1440px] justify-between px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[12px] text-white/40 sm:px-8">
        <span>© 2026 JASST STORE</span>
        <span>Замовлення в Telegram</span>
      </div>
    </footer>
  );
}
