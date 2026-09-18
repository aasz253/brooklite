import Link from "next/link";
import { ArrowRight, CalendarRange } from "lucide-react";
import type { ClassLevel } from "@/lib/types/school";
import { getIcon } from "@/lib/icons";
import { SmartImage } from "@/components/shared/smart-image";

export function Curriculum({ classes }: { classes: ClassLevel[] }) {
  if (classes.length === 0) return null;

  return (
    <div className="grid content-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {classes.map((classLevel) => {
        const Icon = getIcon(classLevel.icon);
        return (
            <article key={classLevel.id} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-royal-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={classLevel.imageUrl}
                  alt={classLevel.imageAlt || `${classLevel.name} at Brooklite Premier School`}
                  className="transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <span className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-royal-800 shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-royal-950">
                    {classLevel.name}
                  </h3>
                  {classLevel.ageRange ? (
                    <span className="shrink-0 rounded-full bg-royal-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-royal-700">
                      {classLevel.ageRange}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-royal-900/65">
                  {classLevel.shortDescription}
                </p>
                {classLevel.learningFocus ? (
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-mint-50 p-3">
                    <CalendarRange className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" aria-hidden="true" />
                    <p className="text-xs leading-relaxed text-mint-800">
                      <span className="font-bold">Focus:</span> {classLevel.learningFocus}
                    </p>
                  </div>
                ) : null}
              </div>
            </article>
        );
      })}
    </div>
  );
}

export function CurriculumLink() {
  return (
    <Link
      href="/admissions"
      className="mt-10 inline-flex items-center gap-2 rounded-full border border-royal-200 px-6 py-3 text-sm font-semibold text-royal-800 transition-colors hover:bg-royal-50"
    >
      Enroll your child today
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}