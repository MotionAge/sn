"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface Slide {
  id: string
  title: string
  description: string
  image_url: string
  cta_text: string
  cta_url: string
  order_index: number
  is_active: boolean
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { data: slides, loading, error, execute: fetchSlides } =  useApi(apiClient.getHeroSlides)

  useEffect(() => {
    fetchSlides()
  }, [fetchSlides])

  const nextSlide = () => {
    if (!Array.isArray(slides) || slides.length === 0) return
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (!Array.isArray(slides) || slides.length === 0) return
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Auto-advance slides
  useEffect(() => {
    if (!Array.isArray(slides) || slides.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [slides])

  if (loading) {
    return (
      <div className="relative h-[500px] overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  if (error || !Array.isArray(slides) || slides.length === 0) {
    return (
      <div className="relative h-[500px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Unable to load hero content</p>
          <Button onClick={fetchSlides} variant="outline" className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Filter only active slides and sort by order
  const activeSlides = (Array.isArray(slides) ? slides : [])
    .filter((slide: Slide) => slide.is_active)
    .sort((a: Slide, b: Slide) => a.order_index - b.order_index)

  if (activeSlides.length === 0) {
    return (
      <div className="relative h-[500px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No hero content available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg">
      {/* Slides */}
      {activeSlides.map((slide: Slide, index: number) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.image_url || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
              <div className="container mx-auto px-4 md:px-10 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-6 max-w-2xl">{slide.description}</p>
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <a href={slide.cta_url}>{slide.cta_text}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {activeSlides.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
