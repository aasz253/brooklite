import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/admin/session";
import {
  adminAbout,
  adminHero,
  adminStatistics,
} from "@/lib/data/admin";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { HeroEditor } from "@/components/admin/hero-editor";
import { AboutEditor } from "@/components/admin/about-editor";
import { StatisticsManager } from "@/components/admin/statistics-manager";

export const metadata: Metadata = {
  title: "Manage Content",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  const service = admin.service;

  const [hero, about, statistics] = await Promise.all([
    adminHero(service),
    adminAbout(service),
    adminStatistics(service),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Website Content"
        description="Edit the homepage hero, about section and statistics."
      />

      <section aria-labelledby="hero-heading">
        <h2 id="hero-heading" className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-900/60">
          Homepage Hero
        </h2>
        <AdminCard className="p-6">
          <HeroEditor hero={hero} />
        </AdminCard>
      </section>

      <section aria-labelledby="about-heading">
        <h2 id="about-heading" className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-900/60">
          About Section
        </h2>
        <AdminCard className="p-6">
          <AboutEditor about={about} />
        </AdminCard>
      </section>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-900/60">
          Statistics
        </h2>
        <AdminCard className="p-6">
          <StatisticsManager statistics={statistics} />
        </AdminCard>
      </section>
    </div>
  );
}