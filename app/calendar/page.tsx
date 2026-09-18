import type { Metadata } from "next";
import { getCalendarEvents } from "@/lib/data/content";
import { CalendarView } from "@/components/calendar-view";
import { Section, SectionIntro } from "@/components/shared/section";
import { Button } from "@/components/shared/button";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "School Calendar",
  description:
    "Upcoming events at Brooklite Premier School Kakamega: term openings, parents' meetings, assessments, sports days and school events.",
};

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <>
      <Section className="bg-gradient-to-b from-royal-50 via-offwhite to-offwhite">
        <SectionIntro
          eyebrow="School Calendar"
          title="Term Dates & School Events"
          description="Stay up to date with openings, closures, assessments and special events across the Brooklite school year."
        />
      </Section>

      <Section className="bg-offwhite pt-0">
        <CalendarView events={events} />
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-royal-950">
            Questions About Term Dates?
          </h2>
          <p className="mt-4 text-royal-900/65">
            Get in touch with our office for the latest calendar updates and term arrangements.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/admissions" size="lg">
              Contact Admissions
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}