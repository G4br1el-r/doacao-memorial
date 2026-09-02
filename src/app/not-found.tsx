import type { Metadata } from "next";
import { NotFoundScreen } from "@/components/not-found";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "A página que você procura não existe ou foi movida. Volte ao início e faça parte desta missão.",
};

export default function NotFound() {
  return <NotFoundScreen />;
}
