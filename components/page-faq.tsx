"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PageFAQProps {
  pageId: string
}

export default function PageFAQ({ pageId }: PageFAQProps) {
  // Mock function to fetch FAQs from CMS based on page ID
  // In production, this would be fetched from the database
  const getFAQs = (id: string) => {
    // Default FAQs if none are set for this page
    const defaultFAQs = [
      {
        id: "faq-1",
        question: "What is Sanatan Dharma Bigyan Samaj?",
        answer:
          "Sanatan Dharma Bigyan Samaj (SDB Nepal) is an organization dedicated to preserving and promoting the values and teachings of Sanatan Dharma through education, community service, and cultural programs.",
      },
      {
        id: "faq-2",
        question: "How can I become a member?",
        answer:
          "You can become a member by visiting our 'Apply for Membership' page and filling out the application form. We offer both general and lifetime membership options.",
      },
      {
        id: "faq-3",
        question: "What types of events do you organize?",
        answer:
          "We organize various events including Gurukul admissions, pilgrimages to sacred sites, Sanskrit learning workshops, Vedic mathematics training, and cultural celebrations.",
      },
      {
        id: "faq-4",
        question: "How can I support your initiatives?",
        answer:
          "You can support our initiatives by donating to specific projects, becoming a member, volunteering your time, or participating in our events and programs.",
      },
      {
        id: "faq-5",
        question: "Do you offer online courses?",
        answer:
          "Yes, we offer various online courses including Sanskrit learning, Vedic mathematics, and other educational programs related to Sanatan Dharma.",
      },
    ]

    // In a real application, you would fetch FAQs based on the pageId
    // For now, we'll just return the default FAQs
    return defaultFAQs
  }

  const faqs = getFAQs(pageId)

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left font-medium text-gray-800">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
