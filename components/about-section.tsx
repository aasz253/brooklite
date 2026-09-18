import { Target, Eye } from "lucide-react";
import Image from "next/image";
import type { AboutContent } from "@/lib/types/school";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/motion";

export function AboutSection({ about }: { about: AboutContent | null }) {
  if (!about) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full bg-mint-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-mint-800">
          About Us
        </span>
        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-royal-950 sm:text-4xl">
          {about.heading}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-royal-900/70">{about.description}</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-royal-100 bg-white p-5 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-royal-800 text-sunflower-400">
              <Target className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-display mt-3 text-base font-bold text-royal-950">Our Mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-royal-900/65">{about.mission}</p>
          </div>
          <div className="rounded-3xl border border-royal-100 bg-white p-5 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sunflower-500 text-royal-950">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-display mt-3 text-base font-bold text-royal-950">Our Vision</h3>
            <p className="mt-2 text-sm leading-relaxed text-royal-900/65">{about.vision}</p>
          </div>
        </div>
      </Reveal>

      <div>
        <div className="relative overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-royal-100">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/classrooms.jpg"
              alt="Brooklite Premier School bright, child-friendly classroom"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-4 py-3 shadow-sm">
            <p className="font-display text-xl font-extrabold text-mint-700">Lurambi,</p>
            <p className="text-xs font-bold uppercase tracking-wider text-royal-800">Kakamega Town</p>
          </div>
        </div>
        <StaggerGroup className="mt-5 grid grid-cols-2 gap-5">
          <StaggerItem>
            <div className="rounded-3xl bg-royal-800 p-5 text-white shadow-md">
              <p className="font-display text-3xl font-extrabold text-sunflower-400">100%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                Caring, trained teachers
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="rounded-3xl bg-mint-600 p-5 text-white shadow-md">
              <p className="font-display text-3xl font-extrabold">CBC</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                Learner-centred curriculum
              </p>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </div>
  );
}