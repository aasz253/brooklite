import type { HeroContent, SchoolSettings } from "@/lib/types/school";
import { HeroText } from "@/components/hero-text";
import { SmartImage } from "@/components/shared/smart-image";

export function Hero({
  hero,
  settings,
}: {
  hero: HeroContent;
  settings: SchoolSettings;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-royal-50 via-offwhite to-offwhite">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-sunflower-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-mint-200/40 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        <HeroText hero={hero} settings={settings} />

        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-royal-900/20 ring-1 ring-royal-100 aspect-[4/3]">
            <SmartImage
              src={hero.imageUrl}
              alt={hero.imageAlt || hero.headline}
              sizes="(max-width: 1024px) 100vw, 50vw"
              preload
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-lg ring-1 ring-royal-100 sm:block">
            <p className="text-xs font-bold uppercase tracking-wider text-sunflower-600">
              Curriculum
            </p>
            <p className="font-display text-lg font-bold text-royal-950">
              Daycare – Grade 4
            </p>
          </div>
          <div className="absolute -right-4 -top-4 hidden rounded-full bg-royal-800 px-5 py-3 text-center text-white shadow-lg sm:block">
            <p className="font-display text-lg font-extrabold leading-none text-sunflower-400">
              CBC
            </p>
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest">
              Integrated
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}