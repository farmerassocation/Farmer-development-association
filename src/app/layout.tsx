import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { MessageCircle } from "lucide-react";
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
  title:
    "விவசாய பாதுகாப்பு மற்றும் வளர்ச்சி நல சங்கம் | Farmers Protection & Development Welfare Association",
  description:
    "Farmers Welfare Association portal - Online Registration, instant digital membership ID card generation, profile management, and online verification. விவசாயிகளின் முன்னேற்றமே நாட்டின் வளர்ச்சி.",
  keywords:
    "விவசாய பாதுகாப்பு சங்கம், Farmers Welfare, Tamil Nadu Farmers, Farmer Registration, Farmer ID Card, VPVS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-emerald-950 antialiased`}
      >
        <LanguageProvider>
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </LanguageProvider>

        

{/* ✅ GLOBAL WHATSAPP FLOAT BUTTON */}
        <a
          href="https://chat.whatsapp.com/I8I02v4odn95uyFG6vaqaz"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </a>


        {/* MSG91 OTP Widget Script */}
        <Script
          src="https://control.msg91.com/app/assets/otp-provider/otp-provider.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}