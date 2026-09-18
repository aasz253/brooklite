export interface SchoolSettings {
  id: number;
  schoolName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  mapsUrl: string;
  logoUrl: string;
}

export interface HeroContent {
  id: number;
  badge: string;
  headline: string;
  subheading: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  imageAlt: string;
  published: boolean;
}

export interface AboutContent {
  id: number;
  heading: string;
  description: string;
  mission: string;
  vision: string;
  published: boolean;
}

export interface Statistic {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  displayOrder: number;
  published: boolean;
}

export interface ClassLevel {
  id: string;
  name: string;
  shortDescription: string;
  learningFocus: string;
  ageRange: string;
  imageUrl: string;
  imageAlt: string;
  icon: string;
  displayOrder: number;
  published: boolean;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  icon: string;
  featured: boolean;
  displayOrder: number;
  published: boolean;
}

export interface FeeStructure {
  id: string;
  academicYear: number;
  term: number;
  className: string;
  tuition: number;
  administrativeFee: number;
  activityFee: number;
  transportFee: number;
  otherFees: number;
  notes: string;
  displayOrder: number;
  published: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  displayOrder: number;
  published: boolean;
}

export type AdmissionStatus = "New" | "Contacted" | "Processing" | "Enrolled" | "Closed";

export interface Admission {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  childName: string;
  targetClass: string;
  preferredTransport: boolean;
  message: string;
  status: AdmissionStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  isActive: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  displayOrder: number;
  published: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  bucket: string;
  path: string;
  altText: string;
  contentType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  action: string;
  contentType: string;
  contentId: string;
  details: string;
  createdAt: string;
}

export interface PublicSiteData {
  settings: SchoolSettings;
  hero: HeroContent | null;
  about: AboutContent | null;
  statistics: Statistic[];
  classes: ClassLevel[];
  facilities: Facility[];
}

export interface ActionResult {
  ok: boolean;
  message: string;
  error?: string;
}