import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UnitProvider } from "@/context/UnitContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B1120",
};

const siteUrl = process.env.NEXTAUTH_URL || "https://weathernow.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WeatherNow – Live Global Weather Intelligence & Radar",
    template: "%s | WeatherNow",
  },
  description:
    "Ultra-fast, accurate live weather reporting dashboard powered by OpenWeatherMap and Open-Meteo. Hourly analytics, 7-day forecasts, atmospheric highlights, and interactive charts.",
  keywords: [
    "Weather",
    "Live Weather",
    "Weather Forecast",
    "WeatherNow",
    "SaaS Dashboard",
    "Next.js Weather",
    "Radar",
    "Atmosphere",
    "Weather Forecast 7 Days",
    "Live Climate Radar",
  ],
  authors: [{ name: "WeatherNow Team" }],
  creator: "WeatherNow",
  publisher: "WeatherNow",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "WeatherNow – Live Global Weather Intelligence & Radar",
    description:
      "Real-time hyper-accurate weather reports, 7-day forecasts, and interactive radar analytics.",
    siteName: "WeatherNow",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeatherNow – Live Global Weather Intelligence & Radar",
    description:
      "Ultra-fast global weather reporting dashboard with real-time analytics.",
    creator: "@weathernow",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WeatherNow",
  url: siteUrl,
  description:
    "Real-time hyper-accurate global weather reporting, radar analytics, and forecasts.",
  applicationCategory: "WeatherApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white bg-[#0B1120] text-white">
        <AuthProvider>
          <ThemeProvider>
            <UnitProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </UnitProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
