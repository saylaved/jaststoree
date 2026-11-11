"use client";

import { type RefObject, useEffect, useState } from "react";

/** True while the element is outside the viewport, so its loops can stop costing frames. */
export function useOffscreen(ref: RefObject<Element | null>, margin = "100px") {
  const [off, setOff] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return off;
}
