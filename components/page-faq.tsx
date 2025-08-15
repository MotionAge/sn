"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface FAQ {
  id: string
  question_en: string
  question_ne: string
  answer_en: string
  answer_ne: string
  category: string
  page_id: string
}

interface PageFAQProps {
  pageId: string
  limit?: number
}

export default function PageFAQ({ pageId, limit = 5 }: PageFAQProps) {
  const { language } = useTranslation()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openItems, setOpenItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch(`/api/faqs?page_id=${pageId}&limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setFaqs(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQs()
  }, [pageId, limit])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (faqs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No frequently asked questions available for this page.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        // const question = language === "ne" ? faq.question_ne : faq.question_en
        // const answer = language === "ne" ? faq.answer_ne : faq.answer_en
        const question = faq.question_en
        const answer =  faq.answer_en
        const isOpen = openItems.includes(faq.id)

        return (
          <Card key={faq.id}>
            <Collapsible>
              <CollapsibleTrigger
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 px-4">
                  <div
                    className="text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}
