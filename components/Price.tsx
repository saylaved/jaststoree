import { formatPrice, type Product } from "@/lib/products";

export function Price({ product, size = "sm", align = "end" }: { product: Product; size?: "sm" | "lg"; align?: "end" | "responsive" }) {
  const lg = size === "lg";
  const al = lg ? "items-start" : align === "responsive" ? "flex-row flex-wrap items-baseline gap-x-2 sm:flex-col sm:items-end sm:gap-x-0" : "items-end";
  return (
    <span className={`flex ${align === "responsive" && !lg ? "" : "flex-col"} ${al} tabular`}>
      <span className={`${lg ? "font-display text-[34px] tracking-[-0.03em]" : "text-[15px]"} font-medium leading-tight whitespace-nowrap`}>
        {formatPrice(product.price)}
      </span>
      {product.oldPrice && (
        <span className={`${lg ? "text-sm" : "text-[12px]"} text-graphite line-through decoration-1 whitespace-nowrap`}>
          {formatPrice(product.oldPrice)}
        </span>
      )}
      {product.plusDelivery && <span className={`${lg ? "text-sm" : "text-[12px]"} text-graphite whitespace-nowrap`}>+ доставка</span>}
    </span>
  );
}
