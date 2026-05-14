import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SwRegister } from "./sw-register";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filadelfia App",
  description: "Motor de estudio bíblico asistido por IA — hermenéutica literal-gramatical-histórica",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Filadelfia",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
