import { SectionLayout } from '@/components/ui/section-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ } from '@/lib/data';
import { TextAnimate } from '@/components/ui/text-animate';

function FaqSection() {
  return (
    <SectionLayout id="faq" title="FAQ">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <TextAnimate as="h3" animation="slideRight" by="character">
          Najczęściej zadawane pytania
        </TextAnimate>
        <Accordion type="multiple" className="space-y-5">
          {FAQ.map((faq, i) => (
            <AccordionItem
              value={`item-${i}`}
              key={i}
              className="rounded-2xl border !border-b px-2"
            >
              <AccordionTrigger className="cursor-pointer [&_svg]:size-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionLayout>
  );
}

export { FaqSection };
