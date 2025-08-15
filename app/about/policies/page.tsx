"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PolicyDocument {
  id: string
  title: string
  description: string
  file_url: string
  file_type: string
  file_size: string
  last_updated: string
  category: string
}

interface OfficialImage {
  id: string
  title: string
  description: string
  image_url: string
  category: string
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyDocument[]>([])
  const [images, setImages] = useState<OfficialImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [policiesRes, imagesRes] = await Promise.all([fetch("/api/policies"), fetch("/api/official-documents")])

        if (!policiesRes.ok || !imagesRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [policiesData, imagesData] = await Promise.all([policiesRes.json(), imagesRes.json()])

        setPolicies(policiesData.data || [])
        setImages(imagesData.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load policies")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Our Policies</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transparency and accountability are core values of our organization. Here you can access all our policies,
          guidelines, and official documents.
        </p>
      </div>

      {/* Policy Documents */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">Policy Documents</h2>
        {policies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No policy documents available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-orange-600 mb-2" />
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{policy.file_type}</span>
                  </div>
                  <CardTitle className="text-lg">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{policy.description}</p>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <p>Size: {policy.file_size}</p>
                    <p>Last Updated: {new Date(policy.last_updated).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={() => window.open(policy.file_url, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleDownload(policy.file_url, policy.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Official Images */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">Official Documents & Certificates</h2>
        {images.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No official documents available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{image.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{image.description}</p>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => window.open(image.image_url, "_blank")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Size
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Contact for More Information */}
      <section className="bg-orange-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-4 text-orange-600">Need More Information?</h3>
        <p className="text-gray-600 mb-6">
          If you need additional documents or have questions about our policies, please don't hesitate to contact us.
        </p>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <a href="/contact">Contact Us</a>
        </Button>
      </section>
    </div>
  )
}
