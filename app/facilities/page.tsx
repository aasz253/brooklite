import type { Metadata } from "next";
import { getFacilities, getSchoolSettings } from "@/lib/data/content";
import { FacilitiesGrid } from "@/components/facilities-grid";
import { Section, SectionIntro } from "@/components/shared/section";
import { Button } from "@/components/shared/button";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Explore Brooklite Premier School's facilities in Kakamega: modern CBC classrooms, guided swimming, nutritious meals and reliable student transport.",
};

export default async function FacilitiesPage() {
  const [facilities, settings] = await Promise.all([getFacilities(), getSchoolSettings()]);

  return (
    <>
      <Section className="bg-gradient-to-b from-royal-50 via-offwhite to-offwhite">
        <SectionIntro
          eyebrow="Our Facilities"
          title="Purpose-Built for Young Learners"
          description="Safe, stimulating and child-friendly spaces that support the CBC learning experience every day."
        />
      </Section>

      <Section className="bg-offwhite pt-0">
        <FacilitiesGrid facilities={facilities} />
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <SectionIntro
            align="center"
            title="Come See Brooklite for Yourself"
            description="Visit us at Lurambi Roundabout Turn, next to Diamond Rock Restaurant, Kakamega, and see our learning environment in person."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/admissions" size="lg">
              Book a Visit
            </Button>
            <Button href={`tel:${settings.phone.replace(/\s/g, "")}`} variant="outline" size="lg">
              Call {settings.phone}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}