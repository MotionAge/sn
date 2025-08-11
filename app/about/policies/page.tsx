import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

export default function PoliciesPage() {
  const policies = [
    {
      title: "Organizational Constitution",
      description: "Our founding document outlining the structure, objectives, and governance of SDB Nepal.",
      type: "PDF",
      size: "2.5 MB",
      lastUpdated: "March 2024",
      downloadUrl: "/documents/constitution.pdf",
    },
    {
      title: "Code of Conduct",
      description: "Guidelines for behavior and ethical standards for all members and participants.",
      type: "PDF",
      size: "1.2 MB",
      lastUpdated: "January 2024",
      downloadUrl: "/documents/code-of-conduct.pdf",
    },
    {
      title: "Financial Policy",
      description: "Transparent guidelines for financial management, donations, and expenditure.",
      type: "PDF",
      size: "1.8 MB",
      lastUpdated: "February 2024",
      downloadUrl: "/documents/financial-policy.pdf",
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect personal information of our members and visitors.",
      type: "PDF",
      size: "900 KB",
      lastUpdated: "December 2023",
      downloadUrl: "/documents/privacy-policy.pdf",
    },
    {
      title: "Event Guidelines",
      description: "Comprehensive guidelines for organizing and participating in SDB Nepal events.",
      type: "PDF",
      size: "1.5 MB",
      lastUpdated: "March 2024",
      downloadUrl: "/documents/event-guidelines.pdf",
    },
    {
      title: "Membership Terms",
      description: "Terms and conditions for different types of memberships and associated benefits.",
      type: "PDF",
      size: "1.1 MB",
      lastUpdated: "January 2024",
      downloadUrl: "/documents/membership-terms.pdf",
    },
  ]

  const images = [
    {
      title: "Registration Certificate",
      description: "Official government registration certificate of SDB Nepal.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Tax Exemption Certificate",
      description: "Certificate showing our tax-exempt status for charitable activities.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Awards and Recognition",
      description: "Various awards and recognitions received by our organization.",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
  ]

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{policy.type}</span>
                </div>
                <CardTitle className="text-lg">{policy.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{policy.description}</p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p>Size: {policy.size}</p>
                  <p>Last Updated: {policy.lastUpdated}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Official Images */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">Official Documents & Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{image.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{image.description}</p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact for More Information */}
      <section className="bg-orange-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-4 text-orange-600">Need More Information?</h3>
        <p className="text-gray-600 mb-6">
          If you need additional documents or have questions about our policies, please don't hesitate to contact us.
        </p>
        <Button className="bg-orange-600 hover:bg-orange-700">Contact Us</Button>
      </section>
    </div>
  )
}
