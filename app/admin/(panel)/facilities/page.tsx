import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/admin/session";
import { adminFacilities } from "@/lib/data/admin";
import { AdminPageHeader } from "@/components/admin/ui";
import { FacilitiesManager } from "@/components/admin/facilities-manager";

export const metadata: Metadata = {
  title: "Manage Facilities",
  robots: { index: false, follow: false },
};

export default async function AdminFacilitiesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const facilities = await adminFacilities(admin.service);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Facilities"
        description="Manage the campus facilities shown on the facilities page."
      />
      <FacilitiesManager facilities={facilities} />
    </div>
  );
}