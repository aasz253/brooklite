import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/facilities`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/fees`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/calendar`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/admissions`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}