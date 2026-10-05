"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import {
  fadeUp,
  revealTransition,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Extra delay in seconds before the reveal starts. */
  delay?: number;
};

/** Fade + rise when scrolled into view. Safe to wrap Server Components. */
export function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ ...revealTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<"div">;

/** Parent for staggered child Reveals / motion items. */
export function Stagger({ children, className, ...props }: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Child item used inside `Stagger`. */
export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={fadeUp}
      transition={revealTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
