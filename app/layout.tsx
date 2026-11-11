import type { Metadata, Viewport } from "next";
import { Unbounded, Geologica } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

const display = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--ff-display", display: "swap" });
const sans = Geologica({ subsets: ["latin", "cyrillic"], variable: "--ff-sans", display: "swap" });

export const metadata: Metadata = {
  title: "JASST STORE: одяг, взуття та аксесуари",
  description:
    "Chrome Hearts, Enfants Riches Déprimés, Corteiz, Balenciaga, Acne Studios та інші бренди. Речі з наявності доставляємо за 1–2 дні, під замовлення за 12–18 днів. Замовлення в Telegram.",
  icons: { icon: "/logo-black.svg" },
  openGraph: { title: "JASST STORE", images: ["/logo-black.png"] },
};

export const viewport: Viewport = { themeColor: "#e6e6e3", width: "device-width", initialScale: 1 };

/**
 * Runs before first paint.
 * html.touch: phone/tablet (no hover, coarse pointer) → native scrolling, no hover-only effects.
 * html.lite:  very weak hardware or Data Saver → heavy paint effects off. Also set later by the FPS probe.
 */
const BOOT = `(function(){try{var n=navigator,d=document.documentElement,t=matchMedia('(hover: none) and (pointer: coarse)').matches,m=n.deviceMemory||8,h=n.hardwareConcurrency||8,s=n.connection&&n.connection.saveData;if(t)d.classList.add('touch');if(m<=2||h<=2||s||localStorage.getItem('jasst.lite')==='1')d.classList.add('lite')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body className="grain">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
