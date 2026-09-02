import { HeroEyebrow } from "./hero-eyebrow";
import { HeroTagline } from "./hero-tagline";
import { HeroTitle } from "./hero-title";

export function HeroCopy() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-16">
      <HeroEyebrow />
      <HeroTitle />
      <HeroTagline />
    </div>
  );
}
