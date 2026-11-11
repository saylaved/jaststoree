"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { bySlug, products, type Status } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { ProductSheet } from "./ProductSheet";
import { RevealText } from "./Reveal";

type Filter = "all" | Status;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Усі" },
  { id: "in_stock", label: "В наявності" },
  { id: "preorder", label: "Під замовлення" },
];
const isFilter = (v: string | null): v is Filter => FILTERS.some((f) => f.id === v);

/** Filter and the open product live in the URL (?filter=…&item=…) so both can be shared and survive reload. */
function readUrl() {
  const q = new URLSearchParams(window.location.search);
  const f = q.get("filter");
  const item = q.get("item");
  return { filter: isFilter(f) ? f : "all", item: item && bySlug(item) ? item : null } as const;
}

function urlWith(filter: Filter, item: string | null) {
  const q = new URLSearchParams(window.location.search);
  if (filter === "all") q.delete("filter");
  else q.set("filter", filter);
  if (item) q.set("item", item);
  else q.delete("item");
  const s = q.toString();
  return `${window.location.pathname}${s ? `?${s}` : ""}${window.location.hash}`;
}

export function Catalog() {
  const [filter, setFilterState] = useState<Filter>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const u = readUrl();
      setFilterState(u.filter);
      setOpenSlug(u.item);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const setFilter = (f: Filter) => {
    setFilterState(f);
    window.history.replaceState(window.history.state, "", urlWith(f, openSlug));
  };

  const openItem = (slug: string) => {
    setOpenSlug(slug);
    window.history.pushState({ jasst: "item" }, "", urlWith(filter, slug));
  };

  const close = useCallback(() => {
    if (window.history.state?.jasst === "item") {
      window.history.back();
    } else {
      setOpenSlug(null);
      window.history.replaceState(null, "", urlWith(filter, null));
    }
  }, [filter]);

  const list = filter === "all" ? products : products.filter((p) => p.status === filter);
  const open = openSlug ? bySlug(openSlug) ?? null : null;
  const count = (f: Filter) => (f === "all" ? products.length : products.filter((p) => p.status === f).length);

  return (
    <section id="catalog" aria-labelledby="catalog-title" className="relative mx-auto max-w-[1440px] scroll-mt-20 px-4 pb-28 pt-24 sm:px-8 sm:pt-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <RevealText id="catalog-title" text="Каталог" className="font-display text-[clamp(44px,8vw,120px)] font-semibold leading-[0.9] tracking-[-0.05em]" />
          <ul className="mt-5 flex flex-col gap-1.5 text-[15px] leading-relaxed text-graphite sm:flex-row sm:gap-6">
            <li className="flex items-center gap-2">
              <span className="inline-block size-2.5 shrink-0 rounded-full bg-signal" aria-hidden />
              В наявності: доставка 1–2 дні
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block size-2.5 shrink-0 rounded-full ring-2 ring-inset ring-ink" aria-hidden />
              Під замовлення: 12–18 днів, ціна + доставка
            </li>
          </ul>
        </div>

        <LayoutGroup id="filters">
          <div role="group" aria-label="Фільтр наявності" className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex w-max gap-1 rounded-full bg-paper p-1 ring-1 ring-black/5">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f.id)}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-colors sm:px-5 ${active ? "text-white" : "text-graphite hover:text-ink"}`}
                  >
                    {active && (
                      <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                    )}
                    <span className="relative">
                      {f.label} <span className="tabular opacity-60">{count(f.id)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </LayoutGroup>
      </div>

      <motion.ul layout className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
            >
              <ProductCard product={p} index={i} onOpen={() => openItem(p.slug)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>{open && <ProductSheet key={open.slug} product={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}
