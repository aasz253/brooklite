import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DbAboutContent,
  DbClass,
  DbFacility,
  DbFee,
  DbCalendarEvent,
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

type Service = SupabaseClient;

const mapSettings = (row: DbSchoolSettings): SchoolSettings => ({
  id: row.id,
  schoolName: row.school_name,
  tagline: row.tagline,
  phone: row.phone,
  whatsapp: row.whatsapp,
  email: row.email,
  address: row.address,
  openingHours: row.opening_hours,
  mapsUrl: row.maps_url,
  logoUrl: row.logo_url,
});

const mapHero = (row: DbHeroContent): HeroContent => ({
  id: row.id,
  badge: row.badge,
  headline: row.headline,
  subheading: row.subheading,
  primaryCtaText: row.primary_cta_text,
  primaryCtaLink: row.primary_cta_link,
  secondaryCtaText: row.secondary_cta_text,
  secondaryCtaLink: row.secondary_cta_link,
  imageUrl: row.image_url,
  imageAlt: row.image_alt,
  published: row.published,
});

const mapAbout = (row: DbAboutContent): AboutContent => ({
  id: row.id,
  heading: row.heading,
  description: row.description,
  mission: row.mission,
  vision: row.vision,
  published: row.published,
});

const mapStatistic = (row: DbStatistic): Statistic => ({
  id: row.id,
  title: row.title,
  value: row.value,
  description: row.description,
  icon: row.icon,
  displayOrder: row.display_order,
  published: row.published,
});

const mapClass = (row: DbClass): ClassLevel => ({
  id: row.id,
  name: row.name,
  shortDescription: row.short_description,
  learningFocus: row.learning_focus,
  ageRange: row.age_range,
  imageUrl: row.image_url,
  imageAlt: row.image_alt,
  icon: row.icon,
  displayOrder: row.display_order,
  published: row.published,
});

const mapFacility = (row: DbFacility): Facility => ({
  id: row.id,
  title: row.title,
  description: row.description,
  imageUrl: row.image_url,
  imageAlt: row.image_alt,
  icon: row.icon,
  featured: row.featured,
  displayOrder: row.display_order,
  published: row.published,
});

const mapFee = (row: DbFee): FeeStructure => ({
  id: row.id,
  academicYear: row.academic_year,
  term: row.term,
  className: row.class_name,
  tuition: Number(row.tuition),
  administrativeFee: Number(row.administrative_fee),
  activityFee: Number(row.activity_fee),
  transportFee: Number(row.transport_fee),
  otherFees: Number(row.other_fees),
  notes: row.notes,
  displayOrder: row.display_order,
  published: row.published,
});

const mapEvent = (row: DbCalendarEvent): CalendarEvent => ({
  id: row.id,
  title: row.title,
  description: row.description,
  eventType: row.event_type,
  startDate: row.start_date,
  endDate: row.end_date,
  location: row.location,
  displayOrder: row.display_order,
  published: row.published,
});

const mapSocial = (row: DbSocialLink): SocialLink => ({
  id: row.id,
  platform: row.platform,
  url: row.url,
  label: row.label,
  displayOrder: row.display_order,
  published: row.published,
});

export async function adminSettings(service: Service): Promise<SchoolSettings> {
  const { data } = await service.from("school_settings").select("*").eq("id", 1).maybeSingle();
  if (!data) {
    throw new Error("School settings row is missing (id = 1).");
  }
  return mapSettings(data);
}

export async function adminHero(service: Service): Promise<HeroContent> {
  const { data } = await service.from("hero_content").select("*").eq("id", 1).maybeSingle();
  if (!data) {
    throw new Error("Hero content row is missing (id = 1).");
  }
  return mapHero(data);
}

export async function adminAbout(service: Service): Promise<AboutContent> {
  const { data } = await service.from("about_content").select("*").eq("id", 1).maybeSingle();
  if (!data) {
    throw new Error("About content row is missing (id = 1).");
  }
  return mapAbout(data);
}

export async function adminStatistics(service: Service): Promise<Statistic[]> {
  const { data } = await service
    .from("statistics")
    .select("*")
    .order("display_order", { ascending: true });
  return (data ?? []).map(mapStatistic);
}

export async function adminClasses(service: Service): Promise<ClassLevel[]> {
  const { data } = await service
    .from("classes")
    .select("*")
    .order("display_order", { ascending: true });
  return (data ?? []).map(mapClass);
}

export async function adminFacilities(service: Service): Promise<Facility[]> {
  const { data } = await service
    .from("facilities")
    .select("*")
    .order("display_order", { ascending: true });
  return (data ?? []).map(mapFacility);
}

export async function adminFees(service: Service): Promise<FeeStructure[]> {
  const { data } = await service.from("fees").select("*").order("academic_year", { ascending: false }).order("display_order", { ascending: true });
  return (data ?? []).map(mapFee);
}

export async function adminCalendarEvents(service: Service): Promise<CalendarEvent[]> {
  const { data } = await service
    .from("calendar_events")
    .select("*")
    .order("start_date", { ascending: true });
  return (data ?? []).map(mapEvent);
}

export async function adminSocialLinks(service: Service): Promise<SocialLink[]> {
  const { data } = await service
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true });
  return (data ?? []).map(mapSocial);
}