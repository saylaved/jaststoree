"use client";

import { useRef } from "react";
import { brands } from "@/lib/products";
import { Star } from "./Star";
import { useOffscreen } from "./useOffscreen";

/** Brand names drift sideways on a CSS loop; it stops while scrolled out of view. */
export function BrandMarquee() {
  const ref = useRef<HTMLElement>(null);
  const off = useOffscreen(ref);
  return (
    <section ref={ref} aria-label="Бренди в каталозі" className="relative overflow-hidden border-y border-line bg-paper py-7 sm:py-9">
      <ul className="sr-only">
        {brands.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div aria-hidden translate="no" data-paused={off} className="marquee flex w-max [--marquee-duration:42s]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {brands.map((b) => (
              <span key={`${k}-${b}`} className="flex items-center whitespace-nowrap">
                <span className="px-6 font-display text-[clamp(28px,5vw,64px)] font-semibold leading-none tracking-[-0.04em] sm:px-10">{b}</span>
                <Star className="size-[clamp(18px,2.4vw,30px)] text-signal" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
