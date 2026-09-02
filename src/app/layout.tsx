import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Oswald } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-corpo",
  display: "swap",
});

const serif = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-serifada",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "doação",
    "Memorial Redentorista",
    "Pe. Vitor Coelho de Almeida",
    "missão",
    "evangelização",
    "caridade",
    "fé",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE.name,
    title: SITE.shareTitle,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.shareTitle,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
