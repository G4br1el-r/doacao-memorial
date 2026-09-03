import { HeroBackground } from "./hero-background";
import { HeroCopy } from "./hero-copy";
import { HeroGradient } from "./hero-gradient";
import { HeroPriest } from "./hero-priest";
import { Signature } from "./hero-signature";
import { ScrollCue } from "./scroll-cue";

export function Hero() {
  return (
    <section className="hero-stage relative w-full overflow-x-clip xl:absolute xl:inset-0 xl:h-auto xl:overflow-x-visible">
      <HeroBackground />
      <HeroPriest />
      <HeroGradient />
      <Signature className="absolute bottom-[16dvh] left-1/2 z-30 w-[clamp(14rem,72vw,18.75rem)] -translate-x-1/2 xl:bottom-[-2dvh] xl:w-[400px]" />
      <HeroCopy />
      <ScrollCue />
    </section>
  );
}
