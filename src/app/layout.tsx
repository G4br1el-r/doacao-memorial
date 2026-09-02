import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Oswald } from "next/font/google";
import "./globals.css";

/* display: so o titulo. condensada de proposito - a largura da Archivo
   Black fazia o titulo passar por cima da figura do padre */
const display = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/* corpo: mesma familia neutra do titulo em espirito, sem competir com ele */
const corpo = Inter({
  subsets: ["latin"],
  variable: "--font-corpo",
  display: "swap",
});

/* serifada liturgica: card, ritual da vela e agradecimento */
const serifada = Cormorant_Garamond({
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} ${serifada.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
