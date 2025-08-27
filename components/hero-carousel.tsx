"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface CarouselSlide {
  id: string
  title_en: string
  description_en: string
  image_url: string
  cta_text_en?: string
  cta_link?: string
}

const fallbackSlides: CarouselSlide[] = [
  {
    id: "1",
    title_en: "Welcome to Sanatan Dharma Bikash Nepal",
    description_en: "Preserving and promoting the eternal values of Sanatan Dharma",
    image_url: "/placeholder.svg?height=600&width=1200&text=Hero+Image+1",
    cta_text_en: "Learn More",
    cta_link: "/about",
  },
  {
    id: "2",
    title_en: "Join Our Community",
    description_en: "Connect with like-minded individuals on the spiritual journey",
    image_url: "/placeholder.svg?height=600&width=1200&text=Hero+Image+2",
    cta_text_en: "Join Now",
    cta_link: "/membership/apply",
  },
  {
    id: "3",
    title_en: "Support Our Mission",
    description_en: "Help us spread the teachings of Sanatan Dharma worldwide",
    image_url: "/placeholder.svg?height=600&width=1200&text=Hero+Image+3",
    cta_text_en: "Donate Now",
    cta_link: "/donate",
  },
]

export default function HeroCarousel() {
  const { language } = useTranslation()
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSlides() {
      try {
        setError(null)
        const response = await fetch("/api/carousel-slides")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON")
        }

        const result = await response.json()

        if (result.success && result.data && result.data.length > 0) {
          setSlides(result.data)
        } else {
          // Use fallback slides if no data or API error
          console.warn("No carousel slides found, using fallback slides")
          setSlides(fallbackSlides)
        }
      } catch (error) {
        console.warn("Error fetching carousel slides, using fallback:", error)
        setSlides(fallbackSlides)
        setError("Using default content - database unavailable")
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
        <div className="animate-pulse text-orange-600 text-lg">Loading...</div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-orange-800 mb-4">
            Sanatan Dharma Bikash Nepal
          </h1>
          <p className="text-xl text-orange-700 mb-8">
            Preserving and promoting the eternal values of Sanatan Dharma
          </p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
            Learn More
          </Button>
          {error && <p className="text-sm text-orange-600 mt-4">{error}</p>}
        </div>
      </section>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <section className="relative h-[600px] overflow-hidden">
      {error && (
        <div className="absolute top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
          Using default content
        </div>
      )}

      <div className="relative w-full h-full">
        <Image
          src={currentSlideData.image_url || "/placeholder.svg?height=600&width=1200&text=Hero+Image"}
          alt={currentSlideData.title_en}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            {currentSlideData.title_en}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {currentSlideData.description_en}
          </p>
          {currentSlideData.cta_link && (
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
              <a href={currentSlideData.cta_link}>
                {currentSlideData.cta_text_en}
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
