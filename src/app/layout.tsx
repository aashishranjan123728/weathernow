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

export const metadata: Metadata = {
  title: "WeatherNow – Live Global Weather Intelligence & Radar",
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
  ],
  authors: [{ name: "WeatherNow Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
