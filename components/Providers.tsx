"use client";

import Lenis from "lenis";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TELEGRAM_URL } from "@/lib/products";
import { type CartLine, copyText, orderText } from "@/lib/order";
import { CartDrawer } from "./CartDrawer";
import { Cursor } from "./Cursor";
import { Intro } from "./Intro";

type ToastAction = { label: string; run: () => void };

type UI = {
  cart: CartLine[];
  count: number;
  add: (slug: string, size: string | null) => void;
  setQty: (index: number, qty: number) => void;
  remove: (index: number) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  lockScroll: (locked: boolean) => void;
  toast: (msg: string, action?: ToastAction) => void;
  order: (lines: CartLine[]) => Promise<void>;
  /** True when the user pressed the header pause button (this page load only). */
  still: boolean;
  /** Weak hardware (boot check or measured low FPS): heavy paint effects off. */
  lite: boolean;
  /** Phone/tablet: native scroll, no hover-only effects. */
  touch: boolean;
  /** OS "reduce motion". Read after hydration so server and client HTML match. */
  reduce: boolean;
  paused: boolean;
  togglePaused: () => void;
};

const Ctx = createContext<UI | null>(null);

export function useUI() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI outside Providers");
  return v;
}

const KEY = "jasst.cart.v1";

export function Providers({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const locks = useRef(0);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lite, setLite] = useState(false);
  const [touch, setTouch] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ id: number; msg: string; action?: ToastAction } | null>(null);
  const loaded = useRef(false);
  const still = paused;

  useEffect(() => {
    const d = document.documentElement;
    setTouch(d.classList.contains("touch"));
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onRm = () => setReduce(mq.matches);
    mq.addEventListener("change", onRm);
    if (d.classList.contains("lite")) {
      setLite(true);
      return () => mq.removeEventListener("change", onRm);
    }
    // FPS probe: if the first ~1.5 s after load average under ~38 fps, switch to lite and remember it.
    let frames = 0;
    let start = 0;
    let raf = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      frames++;
      if (t - start < 1500) raf = requestAnimationFrame(tick);
      else if ((frames * 1000) / (t - start) < 38) {
        d.classList.add("lite");
        setLite(true);
        try {
          localStorage.setItem("jasst.lite", "1");
        } catch {}
      }
    };
    const begin = setTimeout(() => (raf = requestAnimationFrame(tick)), 1800);
    return () => {
      clearTimeout(begin);
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", onRm);
    };
  }, []);

  useEffect(() => {
    // Smooth wheel scrolling on every computer (mouse/trackpad). Phones keep native momentum scrolling.
    if (document.documentElement.classList.contains("touch")) return;
    const l = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      anchors: { offset: -64, duration: 1.4 },
      autoRaf: true,
    });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(v)) setCart(v.filter((x) => x && typeof x.slug === "string" && typeof x.qty === "number"));
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) localStorage.setItem(KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.documentElement.classList.toggle("still", still);
  }, [still]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), toastMsg.action ? 5000 : 3200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const toast = useCallback((msg: string, action?: ToastAction) => setToastMsg({ id: Date.now(), msg, action }), []);

  const lockScroll = useCallback((locked: boolean) => {
    locks.current = Math.max(0, locks.current + (locked ? 1 : -1));
    const on = locks.current > 0;
    if (on) lenis.current?.stop();
    else lenis.current?.start();
    document.documentElement.style.overflow = on ? "hidden" : "";
  }, []);

  const add = useCallback(
    (slug: string, size: string | null) => {
      setCart((c) => {
        const i = c.findIndex((l) => l.slug === slug && l.size === size);
        if (i >= 0) return c.map((l, j) => (j === i ? { ...l, qty: Math.min(9, l.qty + 1) } : l));
        return [...c, { slug, size, qty: 1 }];
      });
      toast("Додано в кошик", { label: "Відкрити", run: () => setCartOpen(true) });
    },
    [toast],
  );

  const setQty = useCallback((index: number, qty: number) => {
    setCart((c) => c.map((l, j) => (j === index ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l)));
  }, []);

  const remove = useCallback(
    (index: number) => {
      setCart((c) => {
        const removed = c[index];
        if (removed) {
          toast("Товар прибрано", {
            label: "Повернути",
            run: () => setCart((cur) => [...cur.slice(0, index), removed, ...cur.slice(index)]),
          });
        }
        return c.filter((_, j) => j !== index);
      });
    },
    [toast],
  );

  const order = useCallback(
    async (lines: CartLine[]) => {
      const ok = await copyText(orderText(lines));
      toast(ok ? "Список скопійовано. Вставте його в чат Telegram" : "Відкриваємо Telegram. Опишіть замовлення в чаті");
      window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
    },
    [toast],
  );

  const togglePaused = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const value = useMemo<UI>(
    () => ({
      cart,
      count: cart.reduce((s, l) => s + l.qty, 0),
      add,
      setQty,
      remove,
      cartOpen,
      setCartOpen,
      lockScroll,
      toast,
      order,
      still,
      lite,
      touch,
      reduce,
      paused,
      togglePaused,
    }),
    [cart, add, setQty, remove, cartOpen, lockScroll, toast, order, still, lite, touch, reduce, paused, togglePaused],
  );

  return (
    <MotionConfig reducedMotion="user">
    <Ctx.Provider value={value}>
      <Intro />
      {children}
      <AnimatePresence>{cartOpen && <CartDrawer key="cart" />}</AnimatePresence>
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[80] flex justify-center px-4"
      >
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              key={toastMsg.id}
              initial={{ y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex items-center gap-1 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-sm text-white shadow-[0_18px_50px_-12px_rgb(0_0_0/0.5)]"
            >
              <span className="py-1.5 pr-2">{toastMsg.msg}</span>
              {toastMsg.action && (
                <button
                  type="button"
                  onClick={() => {
                    toastMsg.action?.run();
                    setToastMsg(null);
                  }}
                  className="rounded-full bg-white/15 px-4 py-1.5 font-medium transition-colors hover:bg-white/25"
                >
                  {toastMsg.action.label}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Cursor />
    </Ctx.Provider>
    </MotionConfig>
  );
}
