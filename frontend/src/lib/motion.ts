import type { Transition, Variants } from "motion/react";

/** Shared easing — calm, not bouncy. */
export const easeOutExpo: Transition["ease"] = [0.22, 1, 0.36, 1];

export const duration = {
  fast: 0.2,
  base: 0.45,
  slow: 0.65,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const revealTransition: Transition = {
  duration: duration.base,
  ease: easeOutExpo,
};

export const heroTransition: Transition = {
  duration: duration.slow,
  ease: easeOutExpo,
};

export const viewportOnce = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -48px 0px",
} as const;
