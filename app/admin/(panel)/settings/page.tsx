import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/admin/session";
import { adminSettings, adminSocialLinks } from "@/lib/data/admin";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { SocialLinksManager } from "@/components/admin/social-links-manager";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  const service = admin.service;

  const [settings, socialLinks] = await Promise.all([
    adminSettings(service),
    adminSocialLinks(service),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Settings"
        description="Update school contact information and social media links."
      />

      <section aria-labelledby="school-info-heading">
        <h2 id="school-info-heading" className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-900/60">
          School Information
        </h2>
        <AdminCard className="p-6">
          <SettingsForm settings={settings} />
        </AdminCard>
      </section>

      <section aria-labelledby="social-heading">
        <h2 id="social-heading" className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-900/60">
          Social Media Links
        </h2>
        <AdminCard className="p-6">
          <SocialLinksManager links={socialLinks} />
        </AdminCard>
      </section>
    </div>
  );
}