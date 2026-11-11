import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Facts } from "@/components/Facts";
import { BrandMarquee } from "@/components/BrandMarquee";
import { Catalog } from "@/components/Catalog";
import { Steps } from "@/components/Steps";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Facts />
        <BrandMarquee />
        <Catalog />
        <Steps />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
