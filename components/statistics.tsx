"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { getIcon } from "@/lib/icons";
import type { Statistic } from "@/lib/types/school";
import { StaggerGroup, StaggerItem } from "@/components/shared/motion";

function AnimatedValue({ value }: { value: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const parts = value.split(/(\d+(?:\.\d+)?)/);
  const numericIndexes = parts
    .map((part, index) => (/^\d+(?:\.\d+)?$/.test(part) ? index : -1))
    .filter((index) => index >= 0);
  const targets = numericIndexes.map((index) => Number(parts[index]));

  const [counts, setCounts] = useState<number[]>(() => targets.map(() => 0));

  useEffect(() => {
    if (numericIndexes.length === 0) return;
    if (reduceMotion || inView) {
      const controls = targets.map((target, k) =>
        animate(counts[k] ?? 0, target, {
          duration: 1.2 + k * 0.15,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (latest) => {
            setCounts((prev) => {
              const next = [...prev];
              next[k] = latest;
              return next;
            });
          },
        }),
      );
      return () => controls.forEach((control) => control.stop());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  const rendered = parts
    .map((part, index) => {
      const numericIndex = numericIndexes.indexOf(index);
      if (numericIndex === -1) return part;
      const target = targets[numericIndex] ?? 0;
      const current = counts[numericIndex] ?? target;
      const isDecimal = part.includes(".");
      return isDecimal
        ? current.toFixed(1)
        : Math.round(current).toLocaleString("en-KE");
    })
    .join("");

  return <span ref={ref}>{rendered}</span>;
}

export function Statistics({ statistics }: { statistics: Statistic[] }) {
  if (statistics.length === 0) return null;

  return (
    <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statistics.map((stat) => {
        const Icon = getIcon(stat.icon);
        return (
          <StaggerItem key={stat.id}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-royal-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <span
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sunflower-100/70 transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-royal-800 text-sunflower-400 shadow-sm">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="font-display relative mt-5 text-xl font-bold leading-snug text-royal-950">
                <AnimatedValue value={stat.value} />
              </h3>
              <p className="relative mt-1 text-xs font-bold uppercase tracking-widest text-sunflower-600">
                {stat.title}
              </p>
              {stat.description ? (
                <p className="relative mt-3 text-sm leading-relaxed text-royal-900/60">
                  {stat.description}
                </p>
              ) : null}
            </article>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}