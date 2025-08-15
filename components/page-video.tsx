"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Volume2, VolumeX } from "lucide-react"

interface PageVideoProps {
  videoId?: string
  title?: string
  description?: string
}

export default function PageVideo({
  videoId = "dQw4w9WgXcQ",
  title = "Welcome to SDB Nepal",
  description = "Learn about our mission and values",
}: PageVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-orange-600">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gray-900">
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-600">
                  <div className="text-center text-white">
                    <Button
                      onClick={handlePlay}
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 border-2 border-white/50 rounded-full w-20 h-20 mb-4"
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-white/90">{description}</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                    title={title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    size="sm"
                    className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
