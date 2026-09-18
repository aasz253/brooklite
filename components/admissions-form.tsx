"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send, Loader2, MessageCircle } from "lucide-react";
import {
  admissionFormSchema,
  type AdmissionFormInput,
  type AdmissionFormValues,
} from "@/lib/validation/admissions";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/utils";

interface AdmissionsFormProps {
  classNames: string[];
  whatsapp: string;
}

const inputClasses =
  "w-full rounded-xl border border-royal-200 bg-white px-4 py-3 text-sm text-royal-950 placeholder:text-royal-900/35 focus:border-royal-500 focus:outline-none focus:ring-2 focus:ring-royal-200";

interface ServerResponse {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export function AdmissionsForm({ classNames, whatsapp }: AdmissionsFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormInput, unknown, AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      parentName: "",
      phone: "",
      email: "",
      childName: "",
      targetClass: "",
      preferredTransport: false,
      message: "",
    },
  });

  const onSubmit = async (values: AdmissionFormValues) => {
    setServerError(null);
    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as ServerResponse;
      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          // Surface server-side field errors as a general message; the schema
          // runs identically on both sides, so this is a rare safety net.
          const first = Object.values(data.fieldErrors)[0]?.[0];
          setServerError(data.message ?? first ?? "Please review your details and try again.");
        } else {
          setServerError(data.message ?? "Something went wrong. Please try again.");
        }
        return;
      }
      reset();
      setSubmittedId(data.message ?? "received");
    } catch {
      setServerError("We couldn't reach the server. Please try again in a moment.");
    }
  };

  if (submittedId) {
    const whatsappHref = buildWhatsAppLink(
      whatsapp,
      "Hello Brooklite Premier School, I have just submitted an admission inquiry and would like to follow up.",
    );
    return (
      <div className="rounded-3xl border border-mint-200 bg-mint-50 p-8 text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-mint-600 text-white">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="font-display mt-5 text-2xl font-bold text-royal-950">
          Inquiry Received!
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-royal-900/70">
          Thank you for your interest in Brooklite Premier School. Our team will contact you
          shortly. If you would like to speak with us sooner, reach out on WhatsApp.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-mint-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-mint-500"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {serverError}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="parentName" className="mb-1.5 block text-sm font-semibold text-royal-950">
            Parent/Guardian Name
          </label>
          <input
            id="parentName"
            type="text"
            autoComplete="name"
            className={cn(inputClasses, errors.parentName && "border-red-300")}
            aria-invalid={Boolean(errors.parentName)}
            aria-describedby={errors.parentName ? "parentName-error" : undefined}
            placeholder="e.g. Mary Wanjiku"
            {...register("parentName")}
          />
          {errors.parentName ? (
            <p id="parentName-error" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.parentName.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-royal-950">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={cn(inputClasses, errors.phone && "border-red-300")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            placeholder="e.g. 0722 723 066"
            {...register("phone")}
          />
          {errors.phone ? (
            <p id="phone-error" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.phone.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-royal-950">
            Email Address <span className="font-normal text-royal-900/40">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={cn(inputClasses, errors.email && "border-red-300")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="e.g. parent@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="childName" className="mb-1.5 block text-sm font-semibold text-royal-950">
            Child&apos;s Name
          </label>
          <input
            id="childName"
            type="text"
            autoComplete="off"
            className={cn(inputClasses, errors.childName && "border-red-300")}
            aria-invalid={Boolean(errors.childName)}
            aria-describedby={errors.childName ? "childName-error" : undefined}
            placeholder="e.g. Brian Otieno"
            {...register("childName")}
          />
          {errors.childName ? (
            <p id="childName-error" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.childName.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="targetClass" className="mb-1.5 block text-sm font-semibold text-royal-950">
            Target Class
          </label>
          <select
            id="targetClass"
            className={cn(inputClasses, "appearance-none", errors.targetClass && "border-red-300")}
            aria-invalid={Boolean(errors.targetClass)}
            aria-describedby={errors.targetClass ? "targetClass-error" : undefined}
            {...register("targetClass")}
          >
            <option value="">Select a class…</option>
            {classNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.targetClass ? (
            <p id="targetClass-error" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.targetClass.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-royal-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              className="h-4 w-4 accent-royal-800"
              {...register("preferredTransport")}
            />
            <span className="text-sm font-semibold text-royal-950">
              I need student transport
            </span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-royal-950">
          Additional Message <span className="font-normal text-royal-900/40">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={4}
          className={cn(inputClasses, "resize-y", errors.message && "border-red-300")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Tell us anything else we should know…"
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1.5 text-xs font-medium text-red-600">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-royal-800 px-8 py-4 text-sm font-semibold text-white shadow-sm shadow-royal-900/20 transition-colors hover:bg-royal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit Admission Inquiry
          </>
        )}
      </button>

      <p className="text-center text-xs text-royal-900/45">
        We will only use these details to respond to your admission inquiry.
      </p>
    </form>
  );
}