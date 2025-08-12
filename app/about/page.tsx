import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"
import { Users, Target, Eye, Heart } from "lucide-react"

export default function AboutPage() {
  const quickLinks = [
    { title: "Our Policies", href: "/about/policies", description: "View our organizational policies and guidelines" },
    { title: "Our Team", href: "/about/team", description: "Meet our dedicated team members" },
    { title: "Testimonials", href: "/about/testimonials", description: "Read what people say about us" },
    { title: "Global Presence", href: "/about/global-presence", description: "Our worldwide network and contacts" },
    {
      title: "Vision & Mission",
      href: "/about/vision-mission",
      description: "Our organizational goals and objectives",
    },
  ]

  const stats = [
    { label: "Active Members", value: "1,200+", icon: Users },
    { label: "Events Organized", value: "150+", icon: Target },
    { label: "Years of Service", value: "15+", icon: Eye },
    { label: "Lives Impacted", value: "5,000+", icon: Heart },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">About Sanatan Dharma Bigyan Samaj</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dedicated to preserving and promoting the timeless values and teachings of Sanatan Dharma through education,
          community service, and cultural programs across Nepal and beyond.
        </p>
      </section>

      {/* Featured Video */}
      {/* <section className="mb-12">
        <PageVideo videoId="about-page-video" />
      </section> */}

      {/* Organization Description */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-orange-600">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Sanatan Dharma Bigyan Samaj (SDB Nepal) was founded with the noble vision of preserving and promoting
                the eternal principles of Sanatan Dharma. Our organization serves as a bridge between ancient wisdom and
                modern life, helping individuals connect with their spiritual heritage while navigating contemporary
                challenges.
              </p>
              <p>
                Since our inception, we have been committed to fostering spiritual growth, cultural preservation, and
                community development. Through our various initiatives, we aim to create a society that values dharma,
                knowledge, and service to humanity.
              </p>
              <p>
                Our work encompasses education, cultural programs, community service, and spiritual guidance, all rooted
                in the timeless teachings of our ancient scriptures and traditions.
              </p>
            </div>
          </div>
          <div className="relative h-96">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="SDB Nepal Organization"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">Learn More About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                  <Link href={link.href}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h2>
        <PageFAQ pageId="about" />
      </section>
    </div>
  )
}
