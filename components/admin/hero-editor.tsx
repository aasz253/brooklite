"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroContentSchema } from "@/lib/validation/content";
import type { HeroContent } from "@/lib/types/school";
import { saveHero } from "@/app/admin/actions/content";
import { useAdminAction } from "@/components/admin/use-admin-action";
import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSwitch,
  FormMessage,
} from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";

export function HeroEditor({ hero }: { hero: HeroContent }) {
  const { state, run, pending } = useAdminAction(saveHero);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(heroContentSchema),
    defaultValues: {
      badge: hero.badge,
      headline: hero.headline,
      subheading: hero.subheading,
      primaryCtaText: hero.primaryCtaText,
      primaryCtaLink: hero.primaryCtaLink,
      secondaryCtaText: hero.secondaryCtaText,
      secondaryCtaLink: hero.secondaryCtaLink,
      imageUrl: hero.imageUrl,
      imageAlt: hero.imageAlt,
      published: hero.published,
    },
  });

  const imageUrl = watch("imageUrl");
  const imageAlt = watch("imageAlt");
  const published = watch("published");

  return (
    <form onSubmit={handleSubmit((values) => run(values))} className="space-y-5">
      <FormMessage state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Hero badge" hint="The small pill above the headline.">
          <AdminInput placeholder="Daycare – Grade 4 · Kakamega, Kenya" {...register("badge")} />
          {errors.badge ? <p className="mt-1 text-xs font-medium text-red-600">{errors.badge.message}</p> : null}
        </AdminField>
        <AdminField label="Published status" hint="Visitors see the hero only when published.">
          <div className="flex items-center gap-3 pt-1">
            <AdminSwitch
              checked={published}
              onChange={(value) => setValue("published", value, { shouldValidate: true })}
              label="Hero published"
            />
            <span className="text-sm text-royal-900/55">{published ? "Published" : "Draft"}</span>
          </div>
        </AdminField>
      </div>

      <AdminField label="Headline">
        <AdminInput placeholder="WINGS TO EVERY DREAM" {...register("headline")} />
        {errors.headline ? <p className="mt-1 text-xs font-medium text-red-600">{errors.headline.message}</p> : null}
      </AdminField>

      <AdminField label="Subheading">
        <AdminTextarea rows={2} placeholder="Premium Daycare, Pre-Primary, and Junior School learning…" {...register("subheading")} />
        {errors.subheading ? <p className="mt-1 text-xs font-medium text-red-600">{errors.subheading.message}</p> : null}
      </AdminField>

      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Primary button text">
          <AdminInput {...register("primaryCtaText")} />
          {errors.primaryCtaText ? <p className="mt-1 text-xs font-medium text-red-600">{errors.primaryCtaText.message}</p> : null}
        </AdminField>
        <AdminField label="Primary button link">
          <AdminInput placeholder="/admissions" {...register("primaryCtaLink")} />
          {errors.primaryCtaLink ? <p className="mt-1 text-xs font-medium text-red-600">{errors.primaryCtaLink.message}</p> : null}
        </AdminField>
        <AdminField label="Secondary button text">
          <AdminInput {...register("secondaryCtaText")} />
          {errors.secondaryCtaText ? <p className="mt-1 text-xs font-medium text-red-600">{errors.secondaryCtaText.message}</p> : null}
        </AdminField>
        <AdminField label="Secondary button link">
          <AdminInput placeholder="/fees" {...register("secondaryCtaLink")} />
          {errors.secondaryCtaLink ? <p className="mt-1 text-xs font-medium text-red-600">{errors.secondaryCtaLink.message}</p> : null}
        </AdminField>
      </div>

      <AdminField label="Hero image" hint="Upload from your device; the current image is shown.">
        <ImageUploader
          value={imageUrl}
          onChange={(value) => setValue("imageUrl", value)}
          altValue={imageAlt}
          onAltChange={(value) => setValue("imageAlt", value)}
        />
        {errors.imageAlt ? <p className="mt-1 text-xs font-medium text-red-600">{errors.imageAlt.message}</p> : null}
      </AdminField>

      <div className="flex justify-end border-t border-royal-100 pt-5">
        <AdminButton type="submit" pending={pending}>
          {pending ? "Saving…" : "Save Hero"}
        </AdminButton>
      </div>
    </form>
  );
}