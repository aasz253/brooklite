import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/admin/session";
import { adminFees } from "@/lib/data/admin";
import { AdminPageHeader, AdminCard } from "@/components/admin/ui";
import { FeesManager } from "@/components/admin/fees-manager";

export const metadata: Metadata = {
  title: "Manage Fees",
  robots: { index: false, follow: false },
};

export default async function AdminFeesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const fees = await adminFees(admin.service);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Fees"
        description="Manage the fee structure shown on the fees page."
      />
      <AdminCard className="mb-4 border-sunflower-300 bg-sunflower-50 p-4">
        <p className="text-sm text-sunflower-900">
          Publish an entry to make it visible. Fees with all-zero amounts display as “on request”.
        </p>
      </AdminCard>
      <FeesManager fees={fees} />
    </div>
  );
}