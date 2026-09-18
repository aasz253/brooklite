"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { HeroContent, SchoolSettings } from "@/lib/types/school";
import { SmartImage } from "@/components/shared/smart-image";
import { buildWhatsAppLink } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  hero,
  settings,
}: {
  hero: HeroContent;
  settings: SchoolSettings;
}) {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  const whatsappHref = buildWhatsAppLink(
    settings.whatsapp || settings.phone,
    "Hello Brooklite Premier School, I would like to enquire about admission.",
  );

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
        <div className="relative">
          {hero.badge ? (
            <motion.span
              {...fadeUp(0.05)}
              className="inline-flex items-center gap-2 rounded-full border border-royal-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-royal-800 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-mint-500" aria-hidden="true" />
              {hero.badge}
            </motion.span>
          ) : null}

          <motion.h1
            {...fadeUp(0.15)}
            className="font-display mt-6 text-4xl font-extrabold leading-tight tracking-tight text-royal-950 sm:text-5xl lg:text-[3.4rem]"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            {...fadeUp(0.25)}
            className="mt-5 max-w-xl text-lg leading-relaxed text-royal-900/70"
          >
            {hero.subheading}
          </motion.p>

          <motion.div {...fadeUp(0.35)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={hero.primaryCtaLink}
              className="inline-flex items-center gap-2 rounded-full bg-royal-800 px-7 py-3.5 text-sm font-semibold text-white shadow-sm shadow-royal-900/20 transition-colors hover:bg-royal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower-400 focus-visible:ring-offset-2"
            >
              {hero.primaryCtaText}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={hero.secondaryCtaLink}
              className="inline-flex items-center gap-2 rounded-full bg-sunflower-500 px-7 py-3.5 text-sm font-semibold text-royal-950 shadow-sm shadow-sunflower-900/20 transition-colors hover:bg-sunflower-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower-400 focus-visible:ring-offset-2"
            >
              {hero.secondaryCtaText}
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp(0.45)}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-royal-100/80 pt-6"
          >
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-royal-900 transition-colors hover:text-royal-700"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-royal-800 text-white">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              Call {settings.phone}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-mint-700 transition-colors hover:text-mint-600"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-600 text-white">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </span>
              WhatsApp Us
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative"
        >
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
        </motion.div>
      </div>
    </section>
  );
}