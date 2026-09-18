import type {
  DbAboutContent,
  DbCalendarEvent,
  DbClass,
  DbFacility,
  DbFee,
  DbHeroContent,
  DbSchoolSettings,
  DbSocialLink,
  DbStatistic,
} from "@/lib/types/database";
import type {
  AboutContent,
  CalendarEvent,
  ClassLevel,
  Facility,
  FeeStructure,
  HeroContent,
  SchoolSettings,
  SocialLink,
  Statistic,
} from "@/lib/types/school";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import {
  defaultAbout,
  defaultCalendarEvents,
  defaultClassNames,
  defaultClasses,
  defaultFacilities,
  defaultFees,
  defaultHero,
  defaultSchoolSettings,
  defaultSocialLinks,
  defaultStatistics,
} from "@/lib/data/defaults";

export async function getSchoolSettings(): Promise<SchoolSettings> {
  if (!isSupabaseConfigured()) return defaultSchoolSettings;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("school_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!data) return defaultSchoolSettings;
    return mapSchoolSettings(data);
  } catch (error) {
    console.error("[data] getSchoolSettings failed", error);
    return defaultSchoolSettings;
  }
}

export async function getHeroContent(): Promise<HeroContent | null> {
  if (!isSupabaseConfigured()) return defaultHero;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("hero_content")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!data || !data.published) return null;
    return mapHero(data);
  } catch (error) {
    console.error("[data] getHeroContent failed", error);
    return defaultHero;
  }
}

export async function getAboutContent(): Promise<AboutContent | null> {
  if (!isSupabaseConfigured()) return defaultAbout;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("about_content")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!data || !data.published) return null;
    return mapAbout(data);
  } catch (error) {
    console.error("[data] getAboutContent failed", error);
    return defaultAbout;
  }
}

export async function getStatistics(): Promise<Statistic[]> {
  if (!isSupabaseConfigured()) return defaultStatistics;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("statistics")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });
    return (data ?? []).map(mapStatistic);
  } catch (error) {
    console.error("[data] getStatistics failed", error);
    return defaultStatistics;
  }
}

export async function getClasses(): Promise<ClassLevel[]> {
  if (!isSupabaseConfigured()) return defaultClasses;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("classes")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });
    return (data ?? []).map(mapClassLevel);
  } catch (error) {
    console.error("[data] getClasses failed", error);
    return defaultClasses;
  }
}

export async function getClassNames(): Promise<string[]> {
  const classes = await getClasses();
  if (classes.length > 0) return classes.map((c) => c.name);
  return defaultClassNames;
}

export async function getFacilities(): Promise<Facility[]> {
  if (!isSupabaseConfigured()) return defaultFacilities;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("facilities")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });
    return (data ?? []).map(mapFacility);
  } catch (error) {
    console.error("[data] getFacilities failed", error);
    return defaultFacilities;
  }
}

export async function getFees(): Promise<FeeStructure[]> {
  if (!isSupabaseConfigured()) return defaultFees;
  try {
    const client = createPublicClient();
    const currentYear = new Date().getFullYear();
    const { data } = await client
      .from("fees")
      .select("*")
      .eq("published", true)
      .eq("academic_year", currentYear)
      .order("term", { ascending: true })
      .order("display_order", { ascending: true });
    const fees = (data ?? []).map(mapFee);
    if (fees.length === 0) return defaultFees;
    return fees;
  } catch (error) {
    console.error("[data] getFees failed", error);
    return defaultFees;
  }
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured()) return defaultCalendarEvents;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("calendar_events")
      .select("*")
      .eq("published", true)
      .order("start_date", { ascending: true })
      .order("display_order", { ascending: true });
    return (data ?? []).map(mapCalendarEvent);
  } catch (error) {
    console.error("[data] getCalendarEvents failed", error);
    return defaultCalendarEvents;
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) return defaultSocialLinks;
  try {
    const client = createPublicClient();
    const { data } = await client
      .from("social_links")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });
    return (data ?? []).map(mapSocialLink);
  } catch (error) {
    console.error("[data] getSocialLinks failed", error);
    return defaultSocialLinks;
  }
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapSchoolSettings(data: DbSchoolSettings): SchoolSettings {
  return {
    id: data.id,
    schoolName: data.school_name,
    tagline: data.tagline,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    address: data.address,
    openingHours: data.opening_hours,
    mapsUrl: data.maps_url,
    logoUrl: data.logo_url,
  };
}

function mapHero(data: DbHeroContent): HeroContent {
  return {
    id: data.id,
    badge: data.badge,
    headline: data.headline,
    subheading: data.subheading,
    primaryCtaText: data.primary_cta_text,
    primaryCtaLink: data.primary_cta_link,
    secondaryCtaText: data.secondary_cta_text,
    secondaryCtaLink: data.secondary_cta_link,
    imageUrl: data.image_url,
    imageAlt: data.image_alt,
    published: data.published,
  };
}

function mapAbout(data: DbAboutContent): AboutContent {
  return {
    id: data.id,
    heading: data.heading,
    description: data.description,
    mission: data.mission,
    vision: data.vision,
    published: data.published,
  };
}

function mapStatistic(data: DbStatistic): Statistic {
  return {
    id: data.id,
    title: data.title,
    value: data.value,
    description: data.description,
    icon: data.icon,
    displayOrder: data.display_order,
    published: data.published,
  };
}

function mapClassLevel(data: DbClass): ClassLevel {
  return {
    id: data.id,
    name: data.name,
    shortDescription: data.short_description,
    learningFocus: data.learning_focus,
    ageRange: data.age_range,
    imageUrl: data.image_url,
    imageAlt: data.image_alt,
    icon: data.icon,
    displayOrder: data.display_order,
    published: data.published,
  };
}

function mapFacility(data: DbFacility): Facility {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    imageUrl: data.image_url,
    imageAlt: data.image_alt,
    icon: data.icon,
    featured: data.featured,
    displayOrder: data.display_order,
    published: data.published,
  };
}

function mapFee(data: DbFee): FeeStructure {
  return {
    id: data.id,
    academicYear: data.academic_year,
    term: data.term,
    className: data.class_name,
    tuition: Number(data.tuition),
    administrativeFee: Number(data.administrative_fee),
    activityFee: Number(data.activity_fee),
    transportFee: Number(data.transport_fee),
    otherFees: Number(data.other_fees),
    notes: data.notes,
    displayOrder: data.display_order,
    published: data.published,
  };
}

function mapCalendarEvent(data: DbCalendarEvent): CalendarEvent {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    eventType: data.event_type,
    startDate: data.start_date,
    endDate: data.end_date,
    location: data.location,
    displayOrder: data.display_order,
    published: data.published,
  };
}

function mapSocialLink(data: DbSocialLink): SocialLink {
  return {
    id: data.id,
    platform: data.platform,
    url: data.url,
    label: data.label,
    displayOrder: data.display_order,
    published: data.published,
  };
}