"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { products, TELEGRAM_URL } from "@/lib/products";
import { Magnetic } from "./Magnetic";
import { useUI } from "./Providers";
import { useOffscreen } from "./useOffscreen";

const STEP = 360 / products.length;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The ten pieces orbit on a 3D ring that turns by itself (pure CSS, GPU only).
 * Scrolling never drives it. On a desktop mouse the whole ring leans a little towards the pointer.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { lite, touch, reduce } = useUI();
  const off = useOffscreen(ref);

  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const leanY = useSpring(lx, { stiffness: 50, damping: 16 });
  const leanX = useSpring(ly, { stiffness: 50, damping: 16 });

  useEffect(() => {
    if (lite || touch || reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lx.set((e.clientX / window.innerWidth - 0.5) * 16);
      ly.set(-(e.clientY / window.innerHeight - 0.5) * 8);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [lite, touch, reduce, lx, ly]);

  return (
    <section
      id="top"
      ref={ref}
      data-paused={off}
      aria-labelledby="hero-title"
      className="relative h-svh min-h-[580px] overflow-hidden"
    >
      <h1 id="hero-title" className="sr-only">
        JASST STORE, магазин одягу, взуття та аксесуарів
      </h1>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[-22vh] h-[60vh] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(255_255_255/0.9),transparent_70%)]"
      />

      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
        className="pointer-events-none absolute inset-x-0 top-[13svh] z-10 mx-auto w-[min(82vw,760px)] sm:top-[12svh]"
      >
        <Image src="/logo-black.svg" unoptimized alt="" width={4192} height={1178} priority className="h-auto w-full select-none" draggable={false} />
      </motion.div>

      {/* Ring. No opacity on any 3D ancestor: it would flatten the ring.
          .ring-hd lays the cards out at --k× size and scales them back by 1/k inside the 3D chain:
          Chrome rasterizes spinning 3D cards at their layout size, so this keeps the photos sharp on retina screens. */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pt-[14svh] [perspective:1600px]">
        <motion.div
          style={{ rotateX: leanX, rotateY: leanY }}
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="[transform-style:preserve-3d]"
        >
          <div className="ring-hd [transform-style:preserve-3d] [--card-w:calc(clamp(86px,min(13vw,23svh),200px)*var(--k))]">
            <div className="ring-spin relative aspect-[3/4] w-[var(--card-w)] [transform-style:preserve-3d]">
              {products.map((prod, i) => {
                const ph = prod.photos[prod.cover] ?? prod.photos[0];
                return (
                  <div
                    key={prod.slug}
                    className="absolute inset-0 overflow-hidden rounded-[16px] shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)] ring-1 ring-black/5 lite:shadow-none"
                    style={{
                      transform: `rotateY(${i * STEP}deg) translateZ(calc(var(--card-w) * 1.9))`,
                      background: ph.bg,
                    }}
                  >
                    <Image src={ph.src} alt="" fill sizes="(max-width: 640px) 520px, 820px" quality={90} priority className="object-cover [backface-visibility:hidden]" draggable={false} />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.45 }}
        className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1440px] flex-col gap-5 px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-10"
      >
        <p className="max-w-[36ch] text-pretty text-[15px] leading-relaxed text-graphite sm:text-base">
          <span translate="no">Chrome Hearts, Enfants Riches Déprimés, Corteiz, Balenciaga, Acne Studios</span> та інші бренди.
          Замовлення приймаємо в Telegram.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <Magnetic>
            <a
              href="#catalog"
              data-cursor=""
              className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-[transform,background-color] hover:bg-black/80 active:scale-95 sm:px-6"
            >
              Дивитись каталог
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor=""
              className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full px-5 text-[14px] font-medium ring-1 ring-black/15 transition-colors hover:bg-black/5 sm:px-6"
            >
              Написати в Telegram
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
