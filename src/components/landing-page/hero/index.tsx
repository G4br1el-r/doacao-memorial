import { HeroBackground } from "./hero-background";
import { HeroCopy } from "./hero-copy";
import { HeroGradient } from "./hero-gradient";
import { HeroPriest } from "./hero-priest";
import { Signature } from "./hero-signature";

export function Hero() {
  return (
    <>
      <HeroBackground />
      <HeroPriest />
      <HeroGradient />
      <Signature className="absolute bottom-12 left-[42%] z-30 w-[400px] max-w-none -translate-x-1/2" />
      <HeroCopy />
    </>
  );
}
