"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface CarouselSlide {
  id: string
  title_en: string
  title_ne: string
  description_en: string
  description_ne: string
  image_url: string
  cta_text_en?: string
  cta_text_ne?: string
  cta_link?: string
}

export default function HeroCarousel() {
  const { language } = useTranslation()
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSlides() {
      try {
        const response = await fetch("/api/carousel-slides")
        if (response.ok) {
          const data = await response.json()
          setSlides(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching carousel slides:", error)
        // Fallback slides
        setSlides([
          {
            id: "1",
            title_en: "Welcome to Sanatan Dharma Bikash Nepal",
            title_ne: "सनातन धर्म विकास नेपालमा स्वागत छ",
            description_en: "Preserving and promoting the eternal values of Sanatan Dharma",
            description_ne: "सनातन धर्मका शाश्वत मूल्यहरूको संरक्षण र प्रवर्धन",
            image_url: "/placeholder.svg?height=600&width=1200&text=Hero+Image+1",
            cta_text_en: "Learn More",
            cta_text_ne: "थप जान्नुहोस्",
            cta_link: "/about",
          },
          {
            id: "2",
            title_en: "Join Our Community",
            title_ne: "हाम्रो समुदायमा सामेल हुनुहोस्",
            description_en: "Connect with like-minded individuals on the spiritual journey",
            description_ne: "आध्यात्मिक यात्रामा समान विचारधारा भएका व्यक्तिहरूसँग जोडिनुहोस्",
            image_url: "/placeholder.svg?height=600&width=1200&text=Hero+Image+2",
            cta_text_en: "Join Now",
            cta_text_ne: "अहिले सामेल हुनुहोस्",
            cta_link: "/membership/apply",
          },
          {
            id: "3",
            title_en: "Support Our Mission",
            title_ne: "हाम्रो मिशनलाई सहयोग गर्नुहोस्",
            description_en: "Help us spread the teachings of Sanatan Dharma worldwide",
            description_ne: "सनातन धर्मका शिक्षाहरू विश्वभर फैलाउन हामीलाई सहयोग गर्नुहोस्",
            image_url: "/placeholder.svg?height=600&width=1200&text=Hero+Image+3",
            cta_text_en: "Donate Now",
            cta_text_ne: "अहिले दान गर्नुहोस्",
            cta_link: "/donate",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (isLoading) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
        <div className="animate-pulse text-orange-600">Loading...</div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-orange-800 mb-4">
            {language === "ne" ? "सनातन धर्म विकास नेपाल" : "Sanatan Dharma Bikash Nepal"}
          </h1>
          <p className="text-xl text-orange-700 mb-8">
            {language === "ne"
              ? "सनातन धर्मका शाश्वत मूल्यहरूको संरक्षण र प्रवर्धन"
              : "Preserving and promoting the eternal values of Sanatan Dharma"}
          </p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
            {language === "ne" ? "थप जान्नुहोस्" : "Learn More"}
          </Button>
        </div>
      </section>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src={currentSlideData.image_url || "/placeholder.svg"}
          alt={language === "ne" ? currentSlideData.title_ne : currentSlideData.title_en}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            {language === "ne" ? currentSlideData.title_ne : currentSlideData.title_en}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {language === "ne" ? currentSlideData.description_ne : currentSlideData.description_en}
          </p>
          {currentSlideData.cta_link && (
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
              <a href={currentSlideData.cta_link}>
                {language === "ne" ? currentSlideData.cta_text_ne : currentSlideData.cta_text_en}
              </a>
            </Button>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                } transition-colors`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
