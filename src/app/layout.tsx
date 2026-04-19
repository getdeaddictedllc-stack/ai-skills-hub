import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/components/AuthProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiskillhub.info";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Skills Hub - Discover AI Capabilities for Every Industry",
    template: "%s | AI Skills Hub",
  },
  description:
    "Discover 500+ AI skills across 35+ industries. Find the right AI capabilities, workflows, and integrations for your business needs.",
  keywords: [
    "AI skills",
    "artificial intelligence",
    "machine learning",
    "industry AI",
    "AI workflows",
    "AI integrations",
    "AI capabilities",
    "business automation",
  ],
  authors: [{ name: "AI Skills Hub" }],
  creator: "AI Skills Hub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "AI Skills Hub",
    title: "AI Skills Hub - Discover AI Capabilities for Every Industry",
    description:
      "Discover 500+ AI skills across 35+ industries. Find the right AI capabilities, workflows, and integrations for your business needs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skills Hub - Discover AI Capabilities for Every Industry",
    description:
      "Discover 500+ AI skills across 35+ industries. Find the right AI capabilities, workflows, and integrations for your business needs.",
  },
  alternates: {
    canonical: SITE_URL,
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`}
      >
        <GoogleAnalytics />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
