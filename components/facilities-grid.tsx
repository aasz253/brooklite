import type { Facility } from "@/lib/types/school";
import { getIcon } from "@/lib/icons";
import { SmartImage } from "@/components/shared/smart-image";
import { StaggerGroup, StaggerItem } from "@/components/shared/motion";

export function FacilitiesGrid({ facilities }: { facilities: Facility[] }) {
  if (facilities.length === 0) return null;

  const featured = facilities.find((facility) => facility.featured) ?? facilities[0];
  const others = facilities.filter((facility) => facility.id !== featured.id);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="group relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-3xl shadow-lg ring-1 ring-royal-100">
          <div className="absolute inset-0">
            <SmartImage
              src={featured.imageUrl}
              alt={featured.imageAlt || featured.title}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-royal-950/90 via-royal-950/40 to-transparent"
              aria-hidden="true"
            />
          </div>
          <div className="relative p-7 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-sunflower-400">
              Featured
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold">{featured.title}</h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
              {featured.description}
            </p>
          </div>
        </article>

      <StaggerGroup className="grid gap-6 sm:grid-cols-2">
        {others.map((facility) => {
          const Icon = getIcon(facility.icon);
          return (
            <StaggerItem key={facility.id} className="h-full">
              <article className="group flex h-full flex-col rounded-3xl border border-royal-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sunflower-100 text-sunflower-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-royal-950">
                  {facility.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-royal-900/65">
                  {facility.description}
                </p>
              </article>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </div>
  );
}