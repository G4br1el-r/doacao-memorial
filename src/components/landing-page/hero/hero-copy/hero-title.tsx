import { AnimatedTitleLine } from "./animated-title-line";
import { TITLE_LINES } from "./constants";

export function HeroTitle() {
  const [first, second] = TITLE_LINES;

  return (
    <h1 className="mt-3 font-display text-[11vw] font-bold uppercase leading-[0.86] tracking-[0.01em] text-[#e8dcc0]">
      <AnimatedTitleLine text={first.text} baseDelay={first.delay} />
      <br />
      <AnimatedTitleLine text={second.text} baseDelay={second.delay} />
    </h1>
  );
}
