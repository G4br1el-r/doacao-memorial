import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface VideoPosterProps {
  src: string;
  className?: string;
}

export function VideoPoster({ src, className }: VideoPosterProps) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      fetchPriority="high"
      sizes="100vw"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
