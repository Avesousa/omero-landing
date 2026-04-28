import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://omero.app";

export const metadata: Metadata = {
  title: "Omero — Sistema de gestión para comercios de Argentina | Gratis 14 días",
  description:
    "Controlá tu inventario, márgenes y precios desde cualquier dispositivo. Diseñado para comercios argentinos. Empezá gratis por 14 días, sin tarjeta de crédito.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Omero — Sistema de gestión para comercios de Argentina | Gratis 14 días",
    description:
      "Controlá tu inventario, márgenes y precios desde cualquier dispositivo. Diseñado para comercios argentinos. Empezá gratis por 14 días, sin tarjeta de crédito.",
    siteName: "Omero",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Omero — Sistema de gestión para comercios argentinos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omero — Sistema de gestión para comercios de Argentina | Gratis 14 días",
    description:
      "Controlá tu inventario, márgenes y precios desde cualquier dispositivo. Empezá gratis por 14 días.",
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/brand/favicon-64.svg", sizes: "64x64", type: "image/svg+xml" },
    ],
    apple: "/brand/favicon-64.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
