import { HeroEyebrow } from "./hero-eyebrow";
import { HeroTagline } from "./hero-tagline";
import { HeroTitle } from "./hero-title";

export function HeroCopy() {
  return (
    <div className="absolute inset-0 flex flex-col justify-start px-2 pt-[9dvh] sm:px-8 xl:justify-center xl:px-16 xl:pt-0">
      <HeroEyebrow />
      <HeroTitle />
      <HeroTagline />
    </div>
  );
}
