import { createClient, supabaseUrl, supabaseKey } from "@/lib/supabase"
import { Users, Calendar, BookOpen, Globe } from "lucide-react"

async function getStats() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Get member count
    const { count: memberCount } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    // Get events count
    const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true })

    // Get library items count
    const { count: libraryCount } = await supabase.from("library_items").select("*", { count: "exact", head: true })

    // Get global presence count
    const { count: globalCount } = await supabase.from("global_presence").select("*", { count: "exact", head: true })

    return {
      members: memberCount || 0,
      events: eventCount || 0,
      library: libraryCount || 0,
      global: globalCount || 0,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      members: 0,
      events: 0,
      library: 0,
      global: 0,
    }
  }
}

export default async function StatsSection() {
  const stats = await getStats()

  const statsData = [
    {
      icon: Users,
      value: stats.members,
      label: "Active Members",
      description: "Dedicated followers of Sanatan Dharma",
    },
    {
      icon: Calendar,
      value: stats.events,
      label: "Events Organized",
      description: "Cultural and educational programs",
    },
    {
      icon: BookOpen,
      value: stats.library,
      label: "Library Resources",
      description: "Books, scriptures, and digital content",
    },
    {
      icon: Globe,
      value: stats.global,
      label: "Global Presence",
      description: "Countries with our community",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Building a global community dedicated to preserving and promoting Sanatan Dharma values
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value.toLocaleString()}</div>
              <div className="text-xl font-semibold text-gray-800 mb-2">{stat.label}</div>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
