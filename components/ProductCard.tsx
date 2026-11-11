"use client";

import Image from "next/image";
import { motion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { formatPrice, type Product, statusLabel } from "@/lib/products";
import { Price } from "./Price";
import { useUI } from "./Providers";

const SIZES = "(min-width:1280px) 19vw, (min-width:768px) 31vw, 48vw";

export function ProductCard({ product, index, onOpen }: { product: Product; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { lite, touch, reduce } = useUI();
  const fancy = !lite && !touch && !reduce;

  const rx = useSpring(0, { stiffness: 220, damping: 20 });
  const ry = useSpring(0, { stiffness: 220, damping: 20 });
  const gx = useSpring(50, { stiffness: 220, damping: 30 });
  const gy = useSpring(50, { stiffness: 220, damping: 30 });
  const glare = useTransform([gx, gy], ([x, y]: number[]) => `radial-gradient(420px circle at ${x}% ${y}%, rgb(255 255 255 / 0.35), transparent 45%)`);

  const cover = product.photos[product.cover] ?? product.photos[0];
  const second = product.photos.find((_, i) => i !== product.cover);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      data-cursor="Дивитись"
      aria-label={`${product.kind} ${product.brand}, ${formatPrice(product.price)}, ${statusLabel[product.status]}`}
      onPointerMove={
        fancy
          ? (e) => {
              if (e.pointerType !== "mouse" || !ref.current) return;
              const r = ref.current.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width;
              const y = (e.clientY - r.top) / r.height;
              ry.set((x - 0.5) * 12);
              rx.set(-(y - 0.5) * 12);
              gx.set(x * 100);
              gy.set(y * 100);
            }
          : undefined
      }
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      style={fancy ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      className="group block w-full text-left"
    >
      <span className="relative block aspect-[4/5] overflow-hidden rounded-[22px] [transform:translateZ(0)]" style={{ background: cover.bg }}>
        <motion.span
          className="absolute inset-0 block"
          initial={{ opacity: 0, scale: 1.12 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-6% 0px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (index % 5) * 0.06 }}
        >
          <Image
            src={cover.src}
            alt={`${product.kind} ${product.brand}`}
            fill
            sizes={SIZES}
            quality={75}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
          />
          {fancy && second && (
            <Image
              src={second.src}
              alt=""
              fill
              sizes={SIZES}
              quality={75}
              className="object-cover opacity-0 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02] group-hover:opacity-100"
            />
          )}
        </motion.span>
        {fancy && (
          <motion.span
            aria-hidden
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium sm:left-3 sm:top-3 sm:text-xs">
          <span aria-hidden className={`size-2 rounded-full ${product.status === "in_stock" ? "bg-signal" : "ring-[1.5px] ring-inset ring-ink"}`} />
          {statusLabel[product.status]}
        </span>
        {discount > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-signal px-2.5 py-1 text-[11px] font-medium text-white sm:right-3 sm:top-3 sm:text-xs">
            −{discount}%
          </span>
        )}
      </span>

      <span className="mt-3 flex flex-col gap-1.5 px-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <span className="min-w-0">
          <span className="block text-[12px] leading-tight text-graphite [overflow-wrap:anywhere] sm:text-[13px]" translate="no">
            {product.brand}
          </span>
          <span className="mt-0.5 block text-[14px] font-medium leading-snug sm:text-[15px]">{product.kind}</span>
        </span>
        <Price product={product} align="responsive" />
      </span>
    </motion.button>
  );
}
