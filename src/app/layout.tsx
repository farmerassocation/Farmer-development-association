import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம் | Farmers Protection & Development Welfare Association",
  description: "Farmers Welfare Association portal - Online Registration, instant digital membership ID card generation, profile management, and online verification. விவசாயிகளின் முன்னேற்றமே நாட்டின் வளர்ச்சி.",
  keywords: "விவசாய பாதுகாப்பு சங்கம், Farmers Welfare, Tamil Nadu Farmers, Farmer Registration, Farmer ID Card, VPVS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-emerald-950 antialiased`}>
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
