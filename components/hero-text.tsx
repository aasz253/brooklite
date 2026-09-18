"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { HeroContent, SchoolSettings } from "@/lib/types/school";
import { buildWhatsAppLink } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroText({
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
  );
}