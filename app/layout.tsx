import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SWRegister } from "@/components/shared/sw-register";
import { InstallBanner } from "@/components/shared/install-banner";
import { getSchoolSettings, getSocialLinks } from "@/lib/data/content";
import { siteUrl } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = siteUrl();
const SITE_NAME = "Brooklite Premier School";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Brooklite Premier School is a private CBC-focused school in Kakamega Town offering premium learning from Daycare through Grade 4. Discover our curriculum, facilities and how to enroll.",
  applicationName: SITE_NAME,
  keywords: [
    "Brooklite Premier School",
    "Brooklite Premier School Kakamega",
    "private schools in Kakamega",
    "daycare in Kakamega",
    "primary school Kakamega",
    "CBC school Kakamega",
    "Grade 4 school Kakamega",
    "playgroup Kakamega",
    "PP1 PP2 Kakamega",
  ],
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brooklite",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Premium Daycare, Pre-Primary and Junior School learning in Kakamega Town. Daycare through Grade 4 under the CBC curriculum.",
    images: [
      {
        url: `${SITE_URL}/images/hero-student-culture.jpg`,
        width: 1024,
        height: 620,
        alt: "Brooklite Premier School learners",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Premium Daycare to Grade 4 education in Kakamega Town, Kenya.",
    images: [`${SITE_URL}/images/hero-student-culture.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a8a",
};

function SchoolStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_NAME,
    description: "Private CBC-focused school in Kakamega Town offering Daycare, Pre-Primary and Junior School learning.",
    url: SITE_URL,
    telephone: "+254722723066",
    email: "info@brooklitepremier.co.ke",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lurambi Roundabout Turn, next to Diamond Rock Restaurant",
      addressLocality: "Kakamega Town",
      addressRegion: "Kakamega County",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.2827,
      longitude: 34.7519,
    },
    openingHours: "Mo-Fr 07:00-17:00",
    areaServed: {
      "@type": "City",
      name: "Kakamega",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSchoolSettings();
  const socialLinks = await getSocialLinks();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-sunflower-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-royal-950"
        >
          Skip to main content
        </a>
        <SchoolStructuredData />
        <SWRegister />
        <Navbar settings={settings} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} socialLinks={socialLinks} />
        <WhatsAppFloat phone={settings.whatsapp || settings.phone} />
        <InstallBanner />
      </body>
    </html>
  );
}