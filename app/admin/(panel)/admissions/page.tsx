import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/admin/session";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdmissionsManager } from "@/components/admin/admissions-manager";

export const metadata: Metadata = {
  title: "Admissions",
  robots: { index: false, follow: false },
};

export default async function AdminAdmissionsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  const service = admin.service;

  const { data } = await service
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Admissions"
        description="Review, update and manage parent inquiries from the admissions form."
      />
      <AdmissionsManager admissions={data ?? []} />
    </div>
  );
}