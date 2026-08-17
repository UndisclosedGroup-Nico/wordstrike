import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { ThemeApplier } from "@/components/providers/ThemeApplier";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans-loaded",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wordstrike — Type. Fight. Master.",
  description:
    "A local-first typing speed fighter. Every word is an attack. Faster, cleaner typing hits harder.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="void"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SettingsProvider>
          <ThemeApplier />
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}
