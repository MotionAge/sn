import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, BookOpen, School, Home } from "lucide-react"

export default function DonationCTA() {
  const donationCategories = [
    { name: "General Fund", icon: Heart, description: "Support all our initiatives" },
    { name: "Gurukul", icon: School, description: "Support traditional education" },
    { name: "Library", icon: BookOpen, description: "Help expand our resources" },
    { name: "Orphanage", icon: Home, description: "Support children in need" },
  ]

  return (
    <div className="bg-orange-50 rounded-lg p-6 md:p-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">Support Our Mission</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Your generous donations help us preserve and promote Sanatan Dharma values through education, community
          service, and cultural programs. Every contribution makes a difference.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {donationCategories.map((category) => (
          <Link
            key={category.name}
            href={`/donate?category=${category.name.toLowerCase().replace(" ", "-")}`}
            className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-orange-100"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
              <category.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm">{category.description}</p>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
          <Link href="/donate">Donate Now</Link>
        </Button>
      </div>
    </div>
  )
}
