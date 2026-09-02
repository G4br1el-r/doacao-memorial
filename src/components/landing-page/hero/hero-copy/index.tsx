import { HeroEyebrow } from "./hero-eyebrow";
import { HeroTagline } from "./hero-tagline";
import { HeroTitle } from "./hero-title";

export function HeroCopy() {
  return (
    <div className="absolute inset-0 flex flex-col items-end justify-start px-3 pt-[9dvh] text-right sm:px-8 xl:items-start xl:justify-center xl:px-16 xl:pt-0 xl:text-left">
      <HeroEyebrow />
      <HeroTitle />
      <HeroTagline />
    </div>
  );
}
