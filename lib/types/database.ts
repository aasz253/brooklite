import type { AdmissionStatus } from "@/lib/types/school";

export interface DbAdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbSchoolSettings {
  id: number;
  school_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  opening_hours: string;
  maps_url: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface DbHeroContent {
  id: number;
  badge: string;
  headline: string;
  subheading: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  image_url: string;
  image_alt: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface DbAboutContent {
  id: number;
  heading: string;
  description: string;
  mission: string;
  vision: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface DbStatistic {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbClass {
  id: string;
  name: string;
  short_description: string;
  learning_focus: string;
  age_range: string;
  image_url: string;
  image_alt: string;
  icon: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbFacility {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  icon: string;
  featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbFee {
  id: string;
  academic_year: number;
  term: number;
  class_name: string;
  tuition: number;
  administrative_fee: number;
  activity_fee: number;
  transport_fee: number;
  other_fees: number;
  notes: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCalendarEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbAdmission {
  id: string;
  parent_name: string;
  phone: string;
  email: string;
  child_name: string;
  target_class: string;
  preferred_transport: boolean;
  message: string;
  status: AdmissionStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DbSocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbMedia {
  id: string;
  name: string;
  url: string;
  bucket: string;
  path: string;
  alt_text: string;
  content_type: string;
  size: number;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface DbAuditLog {
  id: string;
  admin_user_id: string | null;
  admin_email: string;
  action: string;
  content_type: string;
  content_id: string;
  details: string;
  created_at: string;
}