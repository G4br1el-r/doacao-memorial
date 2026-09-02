import { AnimatedTitleLine } from "./animated-title-line";
import { TITLE_LINES } from "./constants";

export function HeroTitle() {
  const [first, second] = TITLE_LINES;

  return (
    <h1 className="mt-3 wrap-break-word font-display text-[clamp(5.2rem,min(26vw,2.5rem+9vw),9.25rem)] font-bold uppercase leading-[0.86] tracking-[0.01em] text-[#e8dcc0] xl:text-[11vw]">
      <AnimatedTitleLine text={first.text} baseDelay={first.delay} />
      <br />
      <AnimatedTitleLine text={second.text} baseDelay={second.delay} />
    </h1>
  );
}
