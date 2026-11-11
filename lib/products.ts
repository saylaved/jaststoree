import media from "./media.json";

export type Status = "in_stock" | "preorder";

export type Photo = { src: string; w: number; h: number; bg: string };

export type Product = {
  slug: string;
  brand: string;
  kind: string;
  status: Status;
  /** Selectable sizes. Empty = not specified by the shop yet. */
  sizes: string[];
  delivery: string;
  price: number;
  oldPrice?: number;
  /** Pre-order prices exclude delivery from abroad */
  plusDelivery: boolean;
  cover: number;
  photos: Photo[];
};

type Media = { file: string; w: number; h: number; avg: string };
const M = media as unknown as Record<string, Media[]>;

function photos(slug: string): Photo[] {
  return (M[slug] ?? []).map((m) => ({ src: `/products/${slug}/${m.file}`, w: m.w, h: m.h, bg: m.avg }));
}

const S_XL = ["S", "M", "L", "XL"];
const IN = "1–2 дні";
const PRE = "12–18 днів";

const raw: Omit<Product, "photos">[] = [
  { slug: "chrome-hearts-bag", brand: "Chrome Hearts", kind: "Сумка", status: "in_stock", sizes: [], delivery: IN, price: 1380, plusDelivery: false, cover: 0 },
  { slug: "erd-jeans", brand: "Enfants Riches Déprimés", kind: "Джинси", status: "preorder", sizes: ["S", "M", "L"], delivery: PRE, price: 1490, plusDelivery: true, cover: 0 },
  { slug: "project-grailz-zip-hoodie", brand: "Project Grailz", kind: "Худі на блискавці", status: "in_stock", sizes: [], delivery: IN, price: 2450, plusDelivery: false, cover: 0 },
  { slug: "corteiz-tee", brand: "Corteiz", kind: "Футболка", status: "preorder", sizes: S_XL, delivery: PRE, price: 650, plusDelivery: true, cover: 2 },
  { slug: "balenciaga-runner", brand: "Balenciaga", kind: "Кросівки Runner", status: "in_stock", sizes: ["41", "42", "43", "44", "45"], delivery: IN, price: 5000, plusDelivery: false, cover: 0 },
  { slug: "corteiz-puffer", brand: "Corteiz", kind: "Пуховик", status: "preorder", sizes: S_XL, delivery: PRE, price: 3200, plusDelivery: true, cover: 0 },
  { slug: "cp-company-beanie", brand: "CP Company", kind: "Шапка", status: "in_stock", sizes: ["Універсальний"], delivery: IN, price: 500, oldPrice: 650, plusDelivery: false, cover: 2 },
  { slug: "mastermind-bape-tee", brand: "Mastermind x Bape", kind: "Футболка", status: "in_stock", sizes: S_XL, delivery: IN, price: 1240, plusDelivery: false, cover: 0 },
  { slug: "acne-studios-jeans", brand: "Acne Studios", kind: "Джинси", status: "in_stock", sizes: S_XL, delivery: IN, price: 1920, plusDelivery: false, cover: 0 },
  { slug: "erd-sweater", brand: "Enfants Riches Déprimés", kind: "Светр", status: "preorder", sizes: S_XL, delivery: PRE, price: 1250, plusDelivery: true, cover: 0 },
];

export const products: Product[] = raw.map((p) => ({ ...p, photos: photos(p.slug) }));

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const brands = Array.from(new Set(products.map((p) => p.brand)));

export function formatPrice(n: number) {
  return `${n.toLocaleString("uk-UA")} грн`;
}

export const statusLabel: Record<Status, string> = {
  in_stock: "В наявності",
  preorder: "Під замовлення",
};

export const TELEGRAM_HANDLE = "jasst_store";
export const TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE}`;
