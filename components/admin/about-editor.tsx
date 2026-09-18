"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutContentSchema } from "@/lib/validation/content";
import type { AboutContent } from "@/lib/types/school";
import { saveAbout } from "@/app/admin/actions/content";
import { useAdminAction } from "@/components/admin/use-admin-action";
import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSwitch,
  FormMessage,
} from "@/components/admin/ui";

export function AboutEditor({ about }: { about: AboutContent }) {
  const { state, run, pending } = useAdminAction(saveAbout);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aboutContentSchema),
    defaultValues: {
      heading: about.heading,
      description: about.description,
      mission: about.mission,
      vision: about.vision,
      published: about.published,
    },
  });

  const published = watch("published");

  return (
    <form onSubmit={handleSubmit((values) => run(values))} className="space-y-5">
      <FormMessage state={state} />
      <div className="flex items-center justify-between gap-4">
        <AdminField label="Published status" hint="Show or hide the About section.">
          <div className="flex items-center gap-3 pt-1">
            <AdminSwitch
              checked={published}
              onChange={(value) => setValue("published", value, { shouldValidate: true })}
              label="About section published"
            />
            <span className="text-sm text-royal-900/55">{published ? "Published" : "Draft"}</span>
          </div>
        </AdminField>
      </div>

      <AdminField label="Section heading">
        <AdminInput {...register("heading")} />
        {errors.heading ? <p className="mt-1 text-xs font-medium text-red-600">{errors.heading.message}</p> : null}
      </AdminField>

      <AdminField label="Description">
        <AdminTextarea rows={4} {...register("description")} />
        {errors.description ? <p className="mt-1 text-xs font-medium text-red-600">{errors.description.message}</p> : null}
      </AdminField>

      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Mission">
          <AdminTextarea rows={3} {...register("mission")} />
          {errors.mission ? <p className="mt-1 text-xs font-medium text-red-600">{errors.mission.message}</p> : null}
        </AdminField>
        <AdminField label="Vision">
          <AdminTextarea rows={3} {...register("vision")} />
          {errors.vision ? <p className="mt-1 text-xs font-medium text-red-600">{errors.vision.message}</p> : null}
        </AdminField>
      </div>

      <div className="flex justify-end border-t border-royal-100 pt-5">
        <AdminButton type="submit" pending={pending}>
          {pending ? "Saving…" : "Save About"}
        </AdminButton>
      </div>
    </form>
  );
}