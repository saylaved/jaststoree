"use client";

import Image from "next/image";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Product, statusLabel } from "@/lib/products";
import { Price } from "./Price";
import { useUI } from "./Providers";
import { useFocusTrap } from "./useFocusTrap";

export function ProductSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add, lockScroll, order } = useUI();
  const [[idx, dir], setPage] = useState<[number, number]>([0, 0]);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [needSize, setNeedSize] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef);
  const sizesCtl = useAnimationControls();
  const n = product.photos.length;

  const go = useCallback((d: number) => setPage(([i]) => [(i + d + n) % n, d]), [n]);

  useEffect(() => {
    lockScroll(true);
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      prevFocus?.focus({ preventScroll: true });
    };
  }, [lockScroll, onClose, go]);

  const requireSize = product.sizes.length > 1;
  const check = () => {
    if (requireSize && !size) {
      setNeedSize(true);
      sizesCtl.start({ x: [0, -10, 9, -6, 4, 0], transition: { duration: 0.45 } });
      return false;
    }
    return true;
  };

  const ph = product.photos[idx];
  const title = `${product.kind} ${product.brand}`;

  return (
    <motion.div
      ref={dialogRef}
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-black/45 backdrop-blur-md lite:bg-black/60 lite:backdrop-blur-none"
      />

      <motion.div
        data-lenis-prevent
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
        className="relative grid max-h-[94svh] w-full max-w-[1180px] grid-rows-[auto_1fr] overflow-y-auto overscroll-contain rounded-t-[30px] bg-paper sm:max-h-[min(90svh,820px)] sm:rounded-[30px] md:grid-cols-[1.15fr_1fr] md:grid-rows-1 md:overflow-hidden"
      >
        {/* Gallery */}
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full" style={{ background: ph?.bg }}>
          {/* blurred copy of the current photo fills the frame so contain-fit photos have no hard bands */}
          <AnimatePresence initial={false}>
            {ph && (
              <motion.div
                key={`bg-${idx}`}
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image src={ph.src} alt="" fill sizes="200px" className="scale-125 object-cover blur-2xl saturate-50 lite:hidden" />
                <span className="absolute inset-0 bg-paper/35" />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={idx}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d >= 0 ? "40%" : "-40%", opacity: 0, scale: 1.05 }),
                center: { x: "0%", opacity: 1, scale: 1 },
                exit: (d: number) => ({ x: d >= 0 ? "-25%" : "25%", opacity: 0, scale: 0.97 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              drag={n > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -400) go(1);
                else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
              }}
              className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
              data-cursor={n > 1 ? "Тягни" : undefined}
            >
              {ph && (
                <Image
                  src={ph.src}
                  alt={`${title}, фото ${idx + 1} з ${n}`}
                  fill
                  sizes="(min-width:768px) 620px, 100vw"
                  className="pointer-events-none object-contain"
                  priority
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {n > 1 && (
            <>
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => go(d)}
                  aria-label={d < 0 ? "Попереднє фото" : "Наступне фото"}
                  className={`absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/80 backdrop-blur-md transition-colors lite:bg-paper lite:backdrop-blur-none hover:bg-paper sm:flex ${d < 0 ? "left-3" : "right-3"}`}
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d={d < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </>
          )}
          {n > 1 && (
            <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
              {product.photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Фото ${i + 1}`}
                  aria-current={i === idx}
                  onClick={() => setPage([i, i > idx ? 1 : -1])}
                  className="flex h-6 items-center px-0.5"
                >
                  <motion.span
                    animate={{ width: i === idx ? 22 : 7, opacity: i === idx ? 1 : 0.45 }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="block h-[7px] rounded-full bg-ink"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col p-6 sm:p-8 md:overflow-y-auto md:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-center gap-2 text-sm text-graphite">
              <span aria-hidden className={`size-2.5 rounded-full ${product.status === "in_stock" ? "bg-signal" : "ring-2 ring-inset ring-ink"}`} />
              {statusLabel[product.status]}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Закрити"
              className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <motion.div initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }}>
            <motion.p variants={item} className="mt-6 text-[15px] text-graphite" translate="no">
              {product.brand}
            </motion.p>
            <motion.h2 variants={item} className="mt-1 font-display text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {product.kind}
            </motion.h2>
            <motion.div variants={item} className="mt-6">
              <Price product={product} size="lg" />
            </motion.div>

            <motion.div variants={item} className="mt-8">
              {product.sizes.length > 0 ? (
                <>
                  <p id="size-label" aria-live="polite" className={`text-sm ${needSize && !size ? "text-signal" : "text-graphite"}`}>
                    {needSize && !size ? "Оберіть розмір, щоб продовжити" : "Розмір"}
                  </p>
                  <motion.div animate={sizesCtl} role="radiogroup" aria-labelledby="size-label" className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const on = size === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => {
                            setSize(s);
                            setNeedSize(false);
                          }}
                          className={`relative h-11 min-w-12 rounded-full px-4 text-sm transition-colors ${on ? "text-white" : "ring-1 ring-black/15 hover:ring-black/40"}`}
                        >
                          {on && <motion.span layoutId={`size-${product.slug}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 34 }} />}
                          <span className="relative tabular">{s}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              ) : (
                <p className="text-sm text-graphite">Розмір уточнимо в Telegram під час замовлення.</p>
              )}
            </motion.div>

            <motion.dl variants={item} className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line text-sm">
              <div className="bg-paper p-4">
                <dt className="text-graphite">Доставка</dt>
                <dd className="mt-1 font-medium">{product.delivery}</dd>
              </div>
              <div className="bg-paper p-4">
                <dt className="text-graphite">Ціна</dt>
                <dd className="mt-1 font-medium">{product.plusDelivery ? "Без доставки" : "Остаточна"}</dd>
              </div>
            </motion.dl>
          </motion.div>

          <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (!check()) return;
                add(product.slug, size);
              }}
              className="h-14 flex-1 rounded-full bg-ink text-[15px] font-medium text-white transition-transform active:scale-[0.98]"
            >
              Додати в кошик
            </button>
            <button
              type="button"
              onClick={() => {
                if (!check()) return;
                void order([{ slug: product.slug, size, qty: 1 }]);
              }}
              className="h-14 flex-1 rounded-full text-[15px] font-medium ring-1 ring-black/15 transition-colors hover:bg-black/5"
            >
              Замовити в Telegram
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const item = {
  h: { opacity: 0, y: 16 },
  s: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};
