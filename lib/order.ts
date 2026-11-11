import { bySlug, formatPrice } from "./products";

export type CartLine = { slug: string; size: string | null; qty: number };

export function orderText(lines: CartLine[]) {
  let total = 0;
  let anyPre = false;
  const rows = lines.map((l, i) => {
    const p = bySlug(l.slug);
    if (!p) return "";
    total += p.price * l.qty;
    if (p.plusDelivery) anyPre = true;
    const size = l.size ? `, розмір ${l.size}` : "";
    return `${i + 1}. ${p.kind} ${p.brand}${size} — ${l.qty} шт × ${formatPrice(p.price)}`;
  });
  return [
    "Привіт! Хочу замовити:",
    ...rows.filter(Boolean),
    "",
    `Разом: ${formatPrice(total)}${anyPre ? " + доставка для речей під замовлення" : ""}`,
  ].join("\n");
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
