import { z } from "zod";
import { isValidKenyanPhone, normalizeKenyanPhone } from "@/lib/utils";

export const kenyanPhoneSchema = z
  .string()
  .trim()
  .min(9, "Enter a phone number")
  .refine((value) => isValidKenyanPhone(value), {
    message: "Enter a valid Kenyan phone number, e.g. 0722 723 066 or +254722723066",
  })
  .transform((value) => normalizeKenyanPhone(value));

export const optionalEmailSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), {
    message: "Enter a valid email address",
  });

const messageSchema = z.string().trim().max(2000, "Message must not exceed 2000 characters");

export const admissionFormSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Parent/guardian name is required")
    .max(120, "Name must not exceed 120 characters"),
  phone: kenyanPhoneSchema,
  email: optionalEmailSchema,
  childName: z
    .string()
    .trim()
    .min(1, "Child's name is required")
    .max(120, "Name must not exceed 120 characters"),
  targetClass: z.string().trim().min(1, "Select a target class"),
  preferredTransport: z.boolean(),
  message: messageSchema,
});

export type AdmissionFormValues = z.output<typeof admissionFormSchema>;
export type AdmissionFormInput = z.input<typeof admissionFormSchema>;

export const ADMISSION_STATUSES = ["New", "Contacted", "Processing", "Enrolled", "Closed"] as const;

export const admissionStatusSchema = z.enum(ADMISSION_STATUSES);

export const admissionUpdateSchema = z
  .object({
    id: z.string().uuid(),
    status: admissionStatusSchema,
    notes: z.string().trim().max(2000, "Notes must not exceed 2000 characters"),
  })
  .strict();

export type AdmissionUpdateValues = z.output<typeof admissionUpdateSchema>;

export class ValidationError extends Error {
  issues: z.ZodIssue[];
  constructor(issues: z.ZodIssue[]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.issues = issues;
  }
}