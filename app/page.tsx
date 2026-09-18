import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Statistics } from "@/components/statistics";
import { Curriculum, CurriculumLink } from "@/components/curriculum";
import { FacilitiesGrid } from "@/components/facilities-grid";
import { AboutSection } from "@/components/about-section";
import { Section, SectionIntro } from "@/components/shared/section";
import { Button } from "@/components/shared/button";
import {
  getAboutContent,
  getClasses,
  getFacilities,
  getHeroContent,
  getSchoolSettings,
  getStatistics,
} from "@/lib/data/content";
import { siteUrl } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getHeroContent();
  const settings = await getSchoolSettings();
  return {
    title: hero?.headline || settings.schoolName,
    description: hero?.subheading,
    alternates: { canonical: "/" },
    openGraph: {
      title: hero?.headline || settings.schoolName,
      description: hero?.subheading,
      url: siteUrl(),
      images: hero?.imageUrl
        ? [`${siteUrl()}${hero.imageUrl.startsWith("/") ? hero.imageUrl : `/${hero.imageUrl}`}`]
        : undefined,
    },
  };
}

export default async function HomePage() {
  const [settings, hero, about, statistics, classes, facilities] = await Promise.all([
    getSchoolSettings(),
    getHeroContent(),
    getAboutContent(),
    getStatistics(),
    getClasses(),
    getFacilities(),
  ]);

  return (
    <>
      {hero ? <Hero hero={hero} settings={settings} /> : null}

      <Section>
        <SectionIntro
          eyebrow="Why Brooklite"
          title="A Learning Journey That Grows With Your Child"
          description="From the very first step in Daycare to confident Grade 4 learners, we combine the care of home with the excellence of a premier school."
        />
        <div className="mt-12">
          <Statistics statistics={statistics} />
        </div>
      </Section>

      <Section className="bg-white">
        <AboutSection about={about} />
      </Section>

      <Section>
        <SectionIntro
          eyebrow="Curriculum"
          title="Daycare Through Grade 4"
          description="Every Brooklite class is built around the CBC curriculum — nurturing curious, confident and well-rounded learners at every stage."
        />
        <div className="mt-12">
          <Curriculum classes={classes} />
        </div>
        <div className="flex justify-center">
          <CurriculumLink />
        </div>
      </Section>

      <Section className="bg-white">
        <SectionIntro
          eyebrow="Facilities"
          title="A Safe, Stimulating Learning Environment"
          description="Purpose-built spaces that keep children safe, healthy and excited to learn every single day."
        />
        <div className="mt-12">
          <FacilitiesGrid facilities={facilities} />
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/facilities" variant="outline">
            Explore all facilities
          </Button>
        </div>
      </Section>

      <Section>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-royal-950 px-6 py-14 text-center shadow-2xl sm:px-12">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-sunflower-500/20 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-mint-500/20 blur-2xl"
            aria-hidden="true"
          />
          <h2 className="font-display relative mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            Give Your Child the Brooklite Advantage
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-white/70">
            Admissions are open for {classes.length > 0 ? classes.length : "all"} class year
            groups. Contact us or start your application today.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/admissions" variant="secondary" size="lg">
              Explore Admissions
            </Button>
            <Button
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              variant="whatsapp"
              size="lg"
            >
              Call {settings.phone}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}