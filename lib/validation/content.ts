import { z } from "zod";
import { ICON_OPTIONS } from "@/lib/icons";

export const idSchema = z.string().uuid();

const trimmed = (min: number, max: number, message: string) =>
  z.string().trim().min(min, message).max(max, message);

export const heroContentSchema = z
  .object({
    badge: trimmed(0, 200, "Badge is too long"),
    headline: trimmed(2, 200, "Headline must be at least 2 characters"),
    subheading: trimmed(2, 400, "Subheading must be at least 2 characters"),
    primaryCtaText: trimmed(1, 60, "Primary button text is required"),
    primaryCtaLink: trimmed(1, 200, "Primary button link is required"),
    secondaryCtaText: trimmed(1, 60, "Secondary button text is required"),
    secondaryCtaLink: trimmed(1, 200, "Secondary button link is required"),
    imageUrl: trimmed(0, 1000, "Image URL is too long"),
    imageAlt: trimmed(0, 300, "Alt text is too long"),
    published: z.boolean(),
  })
  .strict();

export const aboutContentSchema = z
  .object({
    heading: trimmed(2, 200, "Heading must be at least 2 characters"),
    description: trimmed(10, 5000, "Description must be at least 10 characters"),
    mission: trimmed(2, 2000, "Mission must be at least 2 characters"),
    vision: trimmed(2, 2000, "Vision must be at least 2 characters"),
    published: z.boolean(),
  })
  .strict();

export const schoolSettingsSchema = z
  .object({
    schoolName: trimmed(2, 120, "School name must be at least 2 characters"),
    tagline: trimmed(0, 200, "Tagline is too long"),
    phone: trimmed(1, 40, "Phone number is required"),
    whatsapp: trimmed(1, 40, "WhatsApp number is required"),
    email: z
      .string()
      .trim()
      .max(200, "Email is too long")
      .refine(
        (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value),
        "Enter a valid email address",
      ),
    address: trimmed(2, 500, "Address is required"),
    openingHours: trimmed(0, 300, "Opening hours are too long"),
    mapsUrl: trimmed(0, 1000, "Maps URL is too long"),
    logoUrl: trimmed(0, 1000, "Logo URL is too long"),
  })
  .strict();

export const iconFieldSchema = z.enum(ICON_OPTIONS as [string, ...string[]]);

export const statisticSchema = z
  .object({
    id: idSchema.optional(),
    title: trimmed(2, 120, "Title must be at least 2 characters"),
    value: trimmed(2, 120, "Value must be at least 2 characters"),
    description: trimmed(0, 500, "Description is too long"),
    icon: iconFieldSchema,
    displayOrder: z.coerce.number().int().min(0).max(1000).default(0),
    published: z.boolean(),
  })
  .strict();

export const classLevelSchema = z
  .object({
    id: idSchema.optional(),
    name: trimmed(2, 80, "Class name is required"),
    shortDescription: trimmed(2, 500, "Short description is required"),
    learningFocus: trimmed(0, 1000, "Learning focus is too long"),
    ageRange: trimmed(0, 80, "Age range is not valid"),
    imageUrl: trimmed(0, 1000, "Image URL is too long"),
    imageAlt: trimmed(0, 300, "Alt text is too long"),
    icon: iconFieldSchema,
    displayOrder: z.coerce.number().int().min(0).max(1000).default(0),
    published: z.boolean(),
  })
  .strict();

export const facilitySchema = z
  .object({
    id: idSchema.optional(),
    title: trimmed(2, 120, "Facility title is required"),
    description: trimmed(2, 2000, "Description is required"),
    imageUrl: trimmed(0, 1000, "Image URL is too long"),
    imageAlt: trimmed(0, 300, "Alt text is too long"),
    icon: iconFieldSchema,
    featured: z.boolean(),
    displayOrder: z.coerce.number().int().min(0).max(1000).default(0),
    published: z.boolean(),
  })
  .strict();

const CLASS_NAMES = [
  "Daycare",
  "Playgroup",
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
];

export const classNameSchema = z
  .string()
  .trim()
  .min(1, "Class is required")
  .max(80, "Class name is too long")
  .refine(
    (value) => CLASS_NAMES.includes(value) || value.startsWith("Grade "),
    "Class must be one of the school's classes",
  );

export const feeSchema = z
  .object({
    id: idSchema.optional(),
    academicYear: z.coerce.number().int().min(2020).max(2100),
    term: z.coerce.number().int().min(1).max(3),
    className: classNameSchema,
    tuition: z.coerce.number().min(0).max(100_000_000),
    administrativeFee: z.coerce.number().min(0).max(100_000_000),
    activityFee: z.coerce.number().min(0).max(100_000_000),
    transportFee: z.coerce.number().min(0).max(100_000_000),
    otherFees: z.coerce.number().min(0).max(100_000_000),
    notes: trimmed(0, 500, "Notes are too long"),
    displayOrder: z.coerce.number().int().min(0).max(1000).default(0),
    published: z.boolean(),
  })
  .strict();

export const EVENT_TYPES = [
  "Term opening",
  "Parents' meeting",
  "Assessment period",
  "Sports day",
  "School event",
  "Term closing",
];

export const calendarEventSchema = z
  .object({
    id: idSchema.optional(),
    title: trimmed(2, 200, "Event title is required"),
    description: trimmed(0, 2000, "Description is too long"),
    eventType: trimmed(1, 80, "Event type is required"),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
    location: trimmed(0, 200, "Location is too long"),
    displayOrder: z.coerce.number().int().min(0).max(1000).default(0),
    published: z.boolean(),
  })
  .strict()
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export const socialLinkSchema = z
  .object({
    id: idSchema.optional(),
    platform: trimmed(2, 60, "Platform is required"),
    url: trimmed(0, 1000, "URL is too long"),
    label: trimmed(0, 80, "Label is too long"),
    displayOrder: z.coerce.number().int().min(0).max(1000).default(0),
    published: z.boolean(),
  })
  .strict();

export type HeroContentValues = z.output<typeof heroContentSchema>;
export type AboutContentValues = z.output<typeof aboutContentSchema>;
export type SchoolSettingsValues = z.output<typeof schoolSettingsSchema>;
export type StatisticValues = z.output<typeof statisticSchema>;
export type ClassLevelValues = z.output<typeof classLevelSchema>;
export type FacilityValues = z.output<typeof facilitySchema>;
export type FeeValues = z.output<typeof feeSchema>;
export type CalendarEventValues = z.output<typeof calendarEventSchema>;
export type SocialLinkValues = z.output<typeof socialLinkSchema>;

export const sortItemsSchema = z
  .object({
    ids: z.array(z.string().uuid()).min(1),
    type: z.enum(["statistic", "class", "facility", "fee", "event", "social"]),
  })
  .strict();

export const publishToggleSchema = z
  .object({
    id: z.string().uuid(),
    type: z.enum(["statistic", "class", "facility", "fee", "event", "social", "hero", "about"]),
    published: z.boolean(),
  })
  .strict();