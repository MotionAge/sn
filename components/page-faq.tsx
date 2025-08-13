"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface PageFAQProps {
  pageId: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  page_id: string
  order_index: number
  is_active: boolean
}

export default function PageFAQ({ pageId }: PageFAQProps) {
  const { data: faqs, loading, error, execute: fetchFaqs } = useApi(apiClient.getFaqs)

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !faqs) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Unable to load FAQs</p>
        <button 
          onClick={fetchFaqs}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    )
  }

  // Cast faqs to FAQ[] here to fix the TS error
  const pageFaqs = (faqs as FAQ[])
    .filter((faq) => faq.page_id === pageId && faq.is_active)
    .sort((a, b) => a.order_index - b.order_index)

  if (pageFaqs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No FAQs available for this page</p>
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {pageFaqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
