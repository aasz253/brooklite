import type { Metadata } from "next";
import { Phone, MessageCircle, ClipboardList, GraduationCap, Bus, CheckCircle2 } from "lucide-react";
import { getClassNames, getSchoolSettings } from "@/lib/data/content";
import { AdmissionsForm } from "@/components/admissions-form";
import { Section, SectionIntro } from "@/components/shared/section";
import { buildWhatsAppLink } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Apply to Brooklite Premier School in Kakamega — Daycare, Playgroup, PP1, PP2 and Grade 1 to Grade 4. Start your child's admission inquiry today.",
};

const STEPS = [
  {
    icon: ClipboardList,
    title: "Share Your Details",
    description: "Fill in the simple admission inquiry form below.",
  },
  {
    icon: Phone,
    title: "We Call You Back",
    description: "Our team contacts you to confirm details and arrange a visit.",
  },
  {
    icon: CheckCircle2,
    title: "Enroll",
    description: "Complete enrollment and welcome your child to Brooklite.",
  },
];

export default async function AdmissionsPage() {
  const [classNames, settings] = await Promise.all([getClassNames(), getSchoolSettings()]);
  const whatsappHref = buildWhatsAppLink(
    settings.whatsapp || settings.phone,
    "Hello Brooklite Premier School, I would like to enquire about admission.",
  );

  return (
    <>
      <Section className="bg-gradient-to-b from-royal-50 via-offwhite to-offwhite">
        <SectionIntro
          eyebrow="Admissions"
          title="Begin Your Child's Brooklite Journey"
          description="Admissions are open for Daycare through Grade 4. Submit an inquiry and our team will guide you every step of the way."
        />
        <div className="mx-auto mt-12 max-w-4xl">
          <ol className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative rounded-3xl border border-royal-100 bg-white p-6 shadow-sm">
                  <span className="absolute -top-3 left-6 rounded-full bg-royal-800 px-3 py-1 text-xs font-bold text-sunflower-400">
                    Step {index + 1}
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100 text-mint-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-4 text-base font-bold text-royal-950">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-royal-900/60">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      <Section className="bg-offwhite pt-0">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-2xl font-bold text-royal-950">
              Why Families Choose Brooklite
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                { icon: GraduationCap, text: "Daycare through Grade 4 under one roof" },
                { icon: CheckCircle2, text: "CBC-integrated, learner-centred teaching" },
                { icon: Bus, text: "Reliable daily student transport available" },
                { icon: Phone, text: "Open communication with parents all term" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal-800 text-sunflower-400">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="pt-1 text-sm font-medium text-royal-900/80">{item.text}</p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-3xl border border-royal-100 bg-white p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-royal-950">Prefer to Talk?</h3>
              <p className="mt-2 text-sm text-royal-900/65">
                Call us or reach us on WhatsApp for immediate assistance.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full bg-royal-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-700"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {settings.phone}
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-mint-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mint-500"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-royal-100 bg-white p-6 shadow-lg sm:p-8">
            <h2 className="font-display text-2xl font-bold text-royal-950">Admission Inquiry</h2>
            <p className="mb-6 mt-2 text-sm text-royal-900/60">
              Complete the form and we&apos;ll get back to you as soon as possible.
            </p>
            <AdmissionsForm classNames={classNames} whatsapp={settings.whatsapp || settings.phone} />
          </div>
        </div>
      </Section>
    </>
  );
}