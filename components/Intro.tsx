"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** One orchestrated load moment: the wordmark is wiped in on black, then the curtain lifts. Once per session. */
export function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduce || sessionStorage.getItem("jasst.intro")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("jasst.intro", "1");
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          aria-hidden
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)", scale: 1.08 }}
            animate={{ clipPath: "inset(0 0% 0 0)", scale: 1 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
            className="w-[min(62vw,420px)]"
          >
            <Image src="/logo-white.svg" unoptimized alt="" width={4192} height={1178} priority className="h-auto w-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
