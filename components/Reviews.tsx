"use client";

import { useRef } from "react";
import { type Review, reviews } from "@/lib/reviews";
import { useUI } from "./Providers";
import { RevealText } from "./Reveal";
import { useOffscreen } from "./useOffscreen";

export function Reviews() {
  const { still } = useUI();
  const ref = useRef<HTMLElement>(null);
  const off = useOffscreen(ref);
  const half = Math.ceil(reviews.length / 2);

  return (
    <section ref={ref} id="reviews" className="scroll-mt-20 overflow-hidden py-28 sm:py-36" aria-labelledby="reviews-title">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <RevealText
          id="reviews-title"
          text="Відгуки"
          className="font-display text-[clamp(44px,8vw,120px)] font-semibold leading-[0.9] tracking-[-0.05em]"
        />
        <p className="max-w-[40ch] text-pretty text-[15px] leading-relaxed text-graphite">
          {reviews.length} повідомлень від покупців з Telegram. Тексти без змін, з авторською орфографією.
        </p>
      </div>

      {still ? (
        <ul className="mx-auto mt-14 grid max-w-[1440px] gap-3 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={i}>
              <Bubble r={r} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-14 flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] lite:[mask-image:none]">
          <Row items={reviews.slice(0, half)} paused={off} duration="70s" />
          <Row items={reviews.slice(half)} paused={off} duration="62s" reverse />
        </div>
      )}
    </section>
  );
}

function Row({ items, paused, duration, reverse = false }: { items: Review[]; paused: boolean; duration: string; reverse?: boolean }) {
  return (
    <ul
      data-paused={paused}
      style={{ ["--marquee-duration" as string]: duration }}
      className={`marquee hover-pause flex w-max ${reverse ? "reverse" : ""}`}
    >
      {[...items, ...items].map((r, i) => (
        <li key={i} aria-hidden={i >= items.length} className="w-[min(78vw,380px)] shrink-0 pr-3">
          <Bubble r={r} />
        </li>
      ))}
    </ul>
  );
}

/** Styled after the chat bubble the review was written in. */
function Bubble({ r }: { r: Review }) {
  return (
    <figure className="flex h-full flex-col justify-between gap-6 rounded-[26px] rounded-bl-md bg-paper p-6 ring-1 ring-black/5">
      <blockquote className="text-pretty text-[17px] leading-snug">{r.text}</blockquote>
      <figcaption className="flex items-center justify-between gap-3 text-[13px] text-graphite">
        <span className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-medium uppercase text-white">
            {r.name.replace(/[^\p{L}\p{N}]/gu, "").charAt(0) || "•"}
          </span>
          <span className="truncate font-medium text-ink" translate="no">
            {r.name}
          </span>
        </span>
        <span className="shrink-0 text-right">{[r.item, r.date].filter(Boolean).join(", ")}</span>
      </figcaption>
    </figure>
  );
}
