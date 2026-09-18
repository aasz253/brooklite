import Link from "next/link";
import { MapPin, Phone, Clock, Globe } from "lucide-react";
import type { SchoolSettings, SocialLink } from "@/lib/types/school";
import { buildWhatsAppLink } from "@/lib/utils";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/facilities", label: "Facilities" },
  { href: "/fees", label: "Fees" },
  { href: "/calendar", label: "Calendar" },
  { href: "/admissions", label: "Admissions" },
];

function socialIcon(platform: string) {
  const name = platform.toLowerCase();
  if (name.includes("facebook")) return FacebookIcon;
  if (name.includes("instagram")) return InstagramIcon;
  if (name.includes("whatsapp")) return WhatsAppIcon;
  if (name.includes("youtube")) return YoutubeIcon;
  return Globe;
}

type FooterIconProps = import("react").SVGProps<SVGSVGElement>;

function FacebookIcon(props: FooterIconProps) {
  const { className, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
    </svg>
  );
}

function InstagramIcon(props: FooterIconProps) {
  const { className, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} {...rest}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon(props: FooterIconProps) {
  const { className, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function YoutubeIcon(props: FooterIconProps) {
  const { className, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer({
  settings,
  socialLinks,
}: {
  settings: SchoolSettings;
  socialLinks: SocialLink[];
}) {
  const year = new Date().getFullYear();
  const publishedLinks = socialLinks.filter((link) => link.published && link.url);

  return (
    <footer className="bg-royal-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-bold text-white">
              Brooklite
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-sunflower-400">
                Premier School
              </span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {settings.tagline}
            </p>
            <p className="mt-4 text-sm font-medium text-white/80">
              Daycare · Pre-Primary · Junior School
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-sunflower-400">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-sunflower-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-mint-400" aria-hidden="true" />
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" aria-hidden="true" />
                <span>{settings.openingHours || "Open during school term"}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-sunflower-400">
              Connect
            </h3>
            <div className="mt-4 flex gap-2">
              <a
                href={buildWhatsAppLink(settings.whatsapp || settings.phone, "Hello Brooklite Premier School, I would like to enquire about admission.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-mint-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mint-500"
                aria-label="Chat with Brooklite Premier School on WhatsApp"
              >
                WhatsApp Us
              </a>
            </div>
            {publishedLinks.length > 0 ? (
              <ul className="mt-4 flex gap-2.5" aria-label="Social media links">
                {publishedLinks.map((link) => {
                  const Icon = socialIcon(link.platform);
                  return (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label || link.platform} — opens in a new tab`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-sunflower-500 hover:text-royal-950"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/50 sm:mt-12 sm:flex-row">
          <p>
            © {year} {settings.schoolName}. All rights reserved.
          </p>
          <a
            href="https://sifunacodex.top"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white/60 transition-colors hover:text-sunflower-400"
          >
            Website developed by Sifuna Codex.
          </a>
        </div>
      </div>
    </footer>
  );
}