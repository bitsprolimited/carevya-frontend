"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type AccordionContextValue = {
  openItemId: string | null;
  setOpenItemId: (id: string | null) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

type AccordionItemContextValue = {
  id: string;
  triggerId: string;
  panelId: string;
  isOpen: boolean;
};

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("Accordion components must be used within <Accordion>");
  }
  return ctx;
}

function useAccordionItem() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error("AccordionItem parts must be used within <AccordionItem>");
  }
  return ctx;
}

export type AccordionProps = {
  children: ReactNode;
  className?: string;
  defaultValue?: string | null;
};

export function Accordion({
  children,
  className,
  defaultValue = null,
}: AccordionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(defaultValue);

  return (
    <AccordionContext.Provider value={{ openItemId, setOpenItemId }}>
      <div className={cn("flex flex-col gap-3", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function AccordionItem({ id, children, className }: AccordionItemProps) {
  const { openItemId } = useAccordion();
  const reactId = useId();
  const triggerId = `${reactId}-trigger`;
  const panelId = `${reactId}-panel`;
  const isOpen = openItemId === id;

  return (
    <AccordionItemContext.Provider
      value={{ id, triggerId, panelId, isOpen }}
    >
      <div
        className={cn(
          "overflow-hidden rounded-xl bg-surface-lavender",
          className,
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpenItemId } = useAccordion();
  const { id, triggerId, panelId, isOpen } = useAccordionItem();

  return (
    <h3 className="m-0">
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-navy sm:px-6 sm:py-5 sm:text-base",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          className,
        )}
        onClick={() => setOpenItemId(isOpen ? null : id)}
        {...props}
      >
        <span>{children}</span>
        <ChevronRight
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-navy transition-transform duration-200 sm:size-5",
            isOpen && "rotate-90",
          )}
        />
      </button>
    </h3>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { triggerId, panelId, isOpen } = useAccordionItem();

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
