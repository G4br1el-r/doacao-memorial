import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Oswald } from "next/font/google";
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
  title: "De algo maior",
  description:
    "Sua doação mantém viva esta missão de fé, evangelização e caridade.",
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
