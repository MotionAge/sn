"use client"

import { useState, useEffect } from "react"

interface PageVideoProps {
  videoId?: string
}

export default function PageVideo({ videoId = "" }: PageVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Mock function to fetch video URL from admin settings
  // In production, this would come from the CMS
  const getVideoUrl = (id: string) => {
    // Default video if none is set in admin
    if (!id) return "https://www.youtube.com/embed/dQw4w9WgXcQ"
    return `https://www.youtube.com/embed/${id}`
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return <div className="aspect-video bg-gray-200 animate-pulse rounded-lg"></div>
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden shadow-md">
      <iframe
        src={getVideoUrl(videoId)}
        title="Featured Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  )
}
