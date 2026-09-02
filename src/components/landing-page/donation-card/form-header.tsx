import { UserCheck } from "lucide-react";
import { CardSection } from "./card-section";

export function FormHeader() {
  return (
    <CardSection className="text-center">
      <span className="text-lg text-[#d9c9a3]">✦</span>
      <h2 className="mt-1 font-serif text-2xl font-medium tracking-[0.08em] text-[#e8dcc0]">
        FAÇA SUA DOAÇÃO
      </h2>
      <p className="mx-auto mt-2 max-w-65 text-xs leading-relaxed text-white/70">
        Preencha seus dados para continuarmos juntos nessa missão.
      </p>
      <a
        href="/benfeitor"
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-[#d9c9a3]/40 bg-white/5 px-4 py-2 text-[12px] tracking-wide text-[#e8dcc0] transition-colors hover:border-[#d9c9a3]/80 hover:bg-[#d9c9a3]/10"
      >
        <UserCheck className="h-4 w-4" />
        Já sou benfeitor
      </a>
    </CardSection>
  );
}
