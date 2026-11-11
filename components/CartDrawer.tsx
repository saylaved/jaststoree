"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { bySlug, formatPrice } from "@/lib/products";
import { useUI } from "./Providers";
import { useFocusTrap } from "./useFocusTrap";

export function CartDrawer() {
  const { cart, setQty, remove, setCartOpen, lockScroll, order } = useUI();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef);
  const close = () => setCartOpen(false);

  useEffect(() => {
    lockScroll(true);
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [lockScroll, setCartOpen]);

  const total = cart.reduce((s, l) => s + (bySlug(l.slug)?.price ?? 0) * l.qty, 0);
  const anyPre = cart.some((l) => bySlug(l.slug)?.plusDelivery);

  return (
    <motion.div ref={dialogRef} className="fixed inset-0 z-[75] flex justify-end" role="dialog" aria-modal="true" aria-label="Кошик">
      <motion.div
        aria-hidden
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm lite:bg-black/55 lite:backdrop-blur-none"
      />
      <motion.aside
        data-lenis-prevent
        initial={{ x: "104%" }}
        animate={{ x: "0%" }}
        exit={{ x: "104%" }}
        transition={{ type: "spring", stiffness: 300, damping: 36 }}
        className="relative m-2 mb-[max(0.5rem,env(safe-area-inset-bottom))] flex w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-paper shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">Кошик</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Закрити кошик"
            className="flex size-11 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-start justify-center gap-4 px-2 pb-16">
              <p className="text-[15px] text-graphite">Кошик порожній. Оберіть щось у каталозі.</p>
              <a href="#catalog" onClick={close} className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
                До каталогу
              </a>
            </div>
          ) : (
            <ul className="flex flex-col gap-2 pb-4">
              <AnimatePresence initial={false}>
                {cart.map((l, i) => {
                  const p = bySlug(l.slug);
                  if (!p) return null;
                  const ph = p.photos[p.cover] ?? p.photos[0];
                  return (
                    <motion.li
                      key={`${l.slug}-${l.size}`}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="flex gap-4 rounded-2xl bg-white/60 p-2.5 ring-1 ring-black/5"
                    >
                      <span className="relative size-20 shrink-0 overflow-hidden rounded-xl" style={{ background: ph.bg }}>
                        <Image src={ph.src} alt="" fill sizes="80px" className="object-cover" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[12px] text-graphite">{p.brand}</p>
                            <p className="text-sm font-medium">
                              {p.kind}
                              {l.size ? <span className="text-graphite">, {l.size}</span> : null}
                            </p>
                          </div>
                          <button type="button" onClick={() => remove(i)} className="-mr-1 -mt-1 rounded-full px-2 py-1 text-[12px] text-graphite hover:text-ink">
                            Прибрати
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full ring-1 ring-black/10">
                            <button type="button" aria-label="Менше" onClick={() => setQty(i, l.qty - 1)} className="size-9 rounded-full text-lg leading-none transition-colors hover:bg-black/5">
                              −
                            </button>
                            <span className="w-5 text-center text-sm tabular" aria-live="polite">
                              {l.qty}
                            </span>
                            <button type="button" aria-label="Більше" onClick={() => setQty(i, l.qty + 1)} className="size-9 rounded-full text-lg leading-none transition-colors hover:bg-black/5">
                              +
                            </button>
                          </div>
                          <p className="text-sm font-medium tabular">{formatPrice(p.price * l.qty)}</p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-line px-6 pb-6 pt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-graphite">Разом</p>
              <p className="font-display text-2xl font-semibold tracking-[-0.03em] tabular">{formatPrice(total)}</p>
            </div>
            {anyPre && <p className="mt-1 text-right text-[12px] text-graphite">+ доставка для речей під замовлення</p>}
            <button
              type="button"
              onClick={() => void order(cart)}
              className="mt-5 h-14 w-full rounded-full bg-ink text-[15px] font-medium text-white transition-transform active:scale-[0.98]"
            >
              Оформити в Telegram
            </button>
            <p className="mt-3 text-center text-[12px] leading-relaxed text-graphite">
              Скопіюємо список у буфер обміну і відкриємо чат @jasst_store. Залишиться вставити й надіслати.
            </p>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}
