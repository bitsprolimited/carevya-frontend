"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/features/faqs/services/faq-data";

export function FaqAccordion() {
  return (
    <Accordion defaultValue={null}>
      {FAQ_ITEMS.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
