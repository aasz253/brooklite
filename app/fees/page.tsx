import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getFees, getSchoolSettings } from "@/lib/data/content";
import { FeesTable } from "@/components/fees-table";
import { Section, SectionIntro } from "@/components/shared/section";
import { Button } from "@/components/shared/button";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fees",
  description:
    "Current term fees for Brooklite Premier School Daycare, Playgroup, PP1, PP2 and Grade 1 to Grade 4 classes in Kakamega.",
};

export default async function FeesPage() {
  const [fees, settings] = await Promise.all([getFees(), getSchoolSettings()]);

  return (
    <>
      <Section className="bg-gradient-to-b from-royal-50 via-offwhite to-offwhite">
        <SectionIntro
          eyebrow="Fees"
          title="Transparent Fees, Premium Education"
          description="A clear picture of our termly fee structure for every class, so you can plan with confidence."
        />
      </Section>

      <Section className="bg-offwhite pt-0">
        <FeesTable fees={fees} />
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-royal-100 bg-royal-50/60 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-royal-800 text-sunflower-400">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-display mt-3 text-lg font-bold text-royal-950">
              Official Confirmation
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-royal-900/65">
              Fees are subject to confirmation by the school administration. Contact us for exact
              figures before enrollment.
            </p>
          </div>
          <div className="rounded-3xl border border-royal-100 bg-sunflower-50/60 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sunflower-500 text-royal-950">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-display mt-3 text-lg font-bold text-royal-950">
              Flexible Payment Planning
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-royal-900/65">
              Our team is happy to help you understand the full cost of a term at Brooklite,
              including transport and meals.
            </p>
          </div>
          <div className="rounded-3xl border border-royal-100 bg-mint-50/70 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mint-600 text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-display mt-3 text-lg font-bold text-royal-950">
              Need an Enquiry?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-royal-900/65">
              Reach us on WhatsApp or by phone — we&apos;ll walk you through everything.
            </p>
            <Button
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Call {settings.phone}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}