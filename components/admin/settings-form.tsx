"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolSettingsSchema } from "@/lib/validation/content";
import type { SchoolSettings } from "@/lib/types/school";
import { saveSchoolSettings } from "@/app/admin/actions/content";
import { useAdminAction } from "@/components/admin/use-admin-action";
import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminTextarea,
  FormMessage,
} from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";

export function SettingsForm({ settings }: { settings: SchoolSettings }) {
  const { state, run, pending } = useAdminAction(saveSchoolSettings);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: {
      schoolName: settings.schoolName,
      tagline: settings.tagline,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      openingHours: settings.openingHours,
      mapsUrl: settings.mapsUrl,
      logoUrl: settings.logoUrl,
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => run(values))} className="space-y-5">
      <FormMessage state={state} />
      <AdminField label="Logo" hint="Shown in the navbar and footer. Leave empty to use the school name.">
        <ImageUploader
          value={watch("logoUrl")}
          onChange={(value) => setValue("logoUrl", value)}
          altValue=""
          onAltChange={() => undefined}
        />
      </AdminField>

      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="School name">
          <AdminInput {...register("schoolName")} />
          {errors.schoolName ? <p className="mt-1 text-xs font-medium text-red-600">{errors.schoolName.message}</p> : null}
        </AdminField>
        <AdminField label="Tagline">
          <AdminInput {...register("tagline")} />
          {errors.tagline ? <p className="mt-1 text-xs font-medium text-red-600">{errors.tagline.message}</p> : null}
        </AdminField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Phone number">
          <AdminInput {...register("phone")} />
          {errors.phone ? <p className="mt-1 text-xs font-medium text-red-600">{errors.phone.message}</p> : null}
        </AdminField>
        <AdminField label="WhatsApp number">
          <AdminInput {...register("whatsapp")} />
          {errors.whatsapp ? <p className="mt-1 text-xs font-medium text-red-600">{errors.whatsapp.message}</p> : null}
        </AdminField>
      </div>

      <AdminField label="Email address">
        <AdminInput type="email" {...register("email")} />
        {errors.email ? <p className="mt-1 text-xs font-medium text-red-600">{errors.email.message}</p> : null}
      </AdminField>

      <AdminField label="Physical address">
        <AdminTextarea rows={2} {...register("address")} />
        {errors.address ? <p className="mt-1 text-xs font-medium text-red-600">{errors.address.message}</p> : null}
      </AdminField>

      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Opening hours">
          <AdminInput {...register("openingHours")} />
          {errors.openingHours ? <p className="mt-1 text-xs font-medium text-red-600">{errors.openingHours.message}</p> : null}
        </AdminField>
        <AdminField label="Google Maps URL">
          <AdminInput {...register("mapsUrl")} />
          {errors.mapsUrl ? <p className="mt-1 text-xs font-medium text-red-600">{errors.mapsUrl.message}</p> : null}
        </AdminField>
      </div>

      <div className="flex justify-end border-t border-royal-100 pt-5">
        <AdminButton type="submit" pending={pending}>
          {pending ? "Saving…" : "Save Settings"}
        </AdminButton>
      </div>
    </form>
  );
}