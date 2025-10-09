import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function FAQ() {
  const faqs = [
    {
      question: "Is Ruzivo Ebooks really free?",
      answer: "Yes! MasterMinds Ebooks is completely free to use. You can browse, download, and access all educational materials without any subscription fees or hidden costs. We believe education should be accessible to everyone."
    },
    {
      question: "What types of materials are available?",
      answer: "We offer a wide range of educational resources including textbooks, past exam papers (greenbooks and bluebooks), study guides, and syllabus documents for both O-Level and A-Level ZIMSEC curriculum."
    },
    {
      question: "Do I need to create an account?",
      answer: "Yes, you need to create a free account to download materials. This helps us track downloads and improve our service. Registration only takes a minute!"
    },
    {
      question: "How do I download materials?",
      answer: "Once logged in, browse or search for the material you need, click on it to view details, and click the download button. The file will be downloaded directly to your device."
    },
    {
      question: "What file formats are supported?",
      answer: "We primarily support PDF and EPUB formats. PDF files can be opened on any device, while EPUB files are ideal for e-readers and mobile devices."
    },
    {
      question: "Can I upload my own materials?",
      answer: "Yes! Registered users can upload educational materials to share with other students. Please ensure you have the right to share any materials you upload and that they comply with our guidelines."
    },
    {
      question: "How often is new content added?",
      answer: "New content is added regularly as users upload materials and we acquire new resources. Check back often to see the latest additions!"
    },
    {
      question: "What subjects are covered?",
      answer: "We cover all ZIMSEC subjects for both O-Level and A-Level, including Sciences, Mathematics, Languages, Humanities, and Commercial subjects."
    },
    {
      question: "Can I use this on my mobile phone?",
      answer: "Absolutely! MasterMinds Ebooks is fully responsive and works great on smartphones, tablets, and computers. Download materials on any device."
    },
    {
      question: "How can I support this platform?",
      answer: "You can support us by making a donation via EcoCash (0776046121 - Darrell Mucheri). Your contributions help cover hosting costs and keep the platform running. You can also help by sharing the platform with other students!"
    },
    {
      question: "What if I find copyrighted material?",
      answer: "We take copyright seriously. If you believe any material infringes on copyright, please contact us immediately at support@mastermindz.com and we will investigate and take appropriate action."
    },
    {
      question: "How do I report a problem or bug?",
      answer: "You can report issues through our Contact page or email us at support@mastermindz.com. We appreciate your feedback and work quickly to resolve any problems."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6">
            <HelpCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about MasterMinds Ebooks
          </p>
        </div>

        <Card className="p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left" data-testid={`accordion-trigger-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid={`accordion-content-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="text-sky-600 hover:text-sky-700 font-semibold"
            data-testid="link-contact"
          >
            Contact us →
          </a>
        </div>
      </div>
    </div>
  );
}
