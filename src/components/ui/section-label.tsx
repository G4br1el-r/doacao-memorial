import { Info } from "lucide-react";

interface SectionLabelProps {
  children: React.ReactNode;
  info?: boolean;
}

export function SectionLabel({ children, info }: SectionLabelProps) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-[11px] font-medium tracking-[0.2em] text-[#d9c9a3]">
        {children}
      </span>
      {info && <Info className="h-3.5 w-3.5 text-[#d9c9a3]/70" />}
      <span className="h-px flex-1 bg-linear-to-r from-[#d9c9a3]/40 to-transparent" />
    </div>
  );
}
