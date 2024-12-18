import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "Is Entretien AI really free to use?",
    answer:
      "Yes! Entretien AI is completely free and open-source. We believe everyone should have access to quality interview preparation tools, regardless of their financial situation.",
  },
  {
    id: "item-2",
    question: "How does Entretien AI work?",
    answer:
      "Our AI-powered platform creates personalized interview questions based on your resume. You'll receive detailed feedback and ideal answers for each question, helping you prepare effectively for your interviews.",
  },
  {
    id: "item-3",
    question: "Are there any hidden costs or premium features?",
    answer:
      "No hidden costs! All features are freely available. As an open-source project, we're supported by the community through voluntary donations via Buy Me a Coffee.",
  },
  {
    id: "item-4",
    question: "How can I support Entretien AI?",
    answer:
      "If you find our service valuable, you can support us by making a donation through Buy Me a Coffee. Your contribution helps us maintain and improve the platform while keeping it free for everyone.",
  },
  {
    id: "item-5",
    question:
      "What makes Entretien AI different from other interview prep tools?",
    answer:
      "We offer personalized AI-generated questions based on your actual resume, provide detailed feedback, and suggest ideal answers - all completely free. Plus, being open-source means our community can contribute to making the platform even better.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Explore our comprehensive FAQ to find quick answers to common
          inquiries. If you need further assistance, don't hesitate to
          contact us for personalized help."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
