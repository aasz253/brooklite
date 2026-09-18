"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import type { CalendarEvent } from "@/lib/types/school";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

const EVENT_STYLES: Record<string, string> = {
  "Term opening": "bg-royal-800 text-white",
  "Parents' meeting": "bg-sunflower-500 text-royal-950",
  "Assessment period": "bg-mint-600 text-white",
  "Sports day": "bg-sunflower-600 text-white",
  "School event": "bg-mint-500 text-white",
  "Term closing": "bg-royal-600 text-white",
};

function eventStyle(eventType: string): string {
  return EVENT_STYLES[eventType] ?? "bg-royal-100 text-royal-800";
}

function groupEventsByMonth(events: CalendarEvent[]): { label: string; events: CalendarEvent[] }[] {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const date = new Date(event.startDate);
    const key = date.toLocaleDateString("en-KE", { month: "long", year: "numeric" });
    const list = groups.get(key) ?? [];
    list.push(event);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([label, list]) => ({
    label,
    events: list.sort((a, b) => a.startDate.localeCompare(b.startDate)),
  }));
}

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [filter, setFilter] = useState<string>("all");

  const eventTypes = useMemo(
    () => [...new Set(events.map((event) => event.eventType))].sort(),
    [events],
  );

  const filtered = useMemo(() => {
    const visible = filter === "all" ? events : events.filter((e) => e.eventType === filter);
    return groupEventsByMonth(visible);
  }, [events, filter]);

  if (events.length === 0) {
    return (
      <p className="rounded-2xl border border-royal-100 bg-white p-8 text-center text-sm text-royal-900/60">
        No school events have been published yet.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter events by type">
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
            filter === "all"
              ? "border-royal-800 bg-royal-800 text-white"
              : "border-royal-200 bg-white text-royal-800 hover:bg-royal-50",
          )}
        >
          All events
        </button>
        {eventTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            aria-pressed={filter === type}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              filter === type
                ? "border-royal-800 bg-royal-800 text-white"
                : "border-royal-200 bg-white text-royal-800 hover:bg-royal-50",
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-royal-100 bg-white p-8 text-center text-sm text-royal-900/60">
          No events of this type are currently published.
        </p>
      ) : (
        <ol className="space-y-8">
          {filtered.map((group) => (
            <li key={group.label}>
              <h3 className="font-display mb-4 flex items-center gap-2 text-lg font-bold text-royal-950">
                <CalendarDays className="h-5 w-5 text-sunflower-600" aria-hidden="true" />
                {group.label}
              </h3>
              <ul className="grid gap-4 md:grid-cols-2">
                {group.events.map((event) => {
                  const multiDay = event.endDate !== event.startDate;
                  return (
                    <li key={event.id}>
                      <article
                        className={cn(
                          "flex h-full flex-col rounded-2xl border border-royal-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
                              eventStyle(event.eventType),
                            )}
                          >
                            {event.eventType}
                          </span>
                          {multiDay ? (
                            <span className="text-xs font-semibold text-royal-900/50">
                              {formatDate(event.startDate)} – {formatDate(event.endDate)}
                            </span>
                          ) : (
                            <time
                              dateTime={event.startDate}
                              className="text-xs font-semibold text-royal-900/50"
                            >
                              {formatDate(event.startDate)}
                            </time>
                          )}
                        </div>
                        <h4 className="font-display mt-3 text-lg font-bold text-royal-950">
                          {event.title}
                        </h4>
                        {event.description ? (
                          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-royal-900/65">
                            {event.description}
                          </p>
                        ) : null}
                        {event.location ? (
                          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-royal-900/50">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {event.location}
                          </p>
                        ) : null}
                      </article>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}