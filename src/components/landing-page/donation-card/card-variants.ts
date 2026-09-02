import { SMOOTH } from "@/lib/animation/easing";

export const CARD_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: SMOOTH } },
};

export const CARD_CONTAINER_VARIANTS = {
  hidden: {},
  show: {
    transition: { delayChildren: 1.2, staggerChildren: 0.14 },
  },
};
