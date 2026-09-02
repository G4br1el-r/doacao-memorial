import { Lock } from "lucide-react";

export function SecureNote() {
  return (
    <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/60">
      <Lock className="h-3 w-3" />
      Ambiente seguro e protegido
    </p>
  );
}
