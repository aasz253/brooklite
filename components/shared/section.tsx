import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/motion";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionIntro({ eyebrow, title, description, align = "center" }: SectionIntroProps) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-sunflower-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sunflower-800">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-royal-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-royal-900/60 sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}