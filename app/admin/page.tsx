import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, BookOpen, FileText, ImageIcon, Globe, Settings } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"
import Link from "next/link"

async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  try {
    const { count: memberCount } = await supabase.from("members").select("*", { count: "exact", head: true })
    const { count: eventCount } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", new Date().toISOString())
    const { data: donations } = await supabase.from("donations").select("amount").eq("status", "completed")
    const totalDonations = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
    const { count: libraryCount } = await supabase.from("library_items").select("*", { count: "exact", head: true })

    return {
      memberCount: memberCount || 0,
      eventCount: eventCount || 0,
      totalDonations,
      libraryCount: libraryCount || 0,
    }
  } catch (error) {
    console.error(error)
    return { memberCount: 0, eventCount: 0, totalDonations: 0, libraryCount: 0 }
  }
}

async function getRecentActivity() {
  const supabase = createServerSupabaseClient()

  try {
    const { data: recentMembers } = await supabase
      .from("members")
      .select("name, created_at")
      .order("created_at", { ascending: false })
      .limit(3)

    const { data: recentEvents } = await supabase
      .from("events")
      .select("title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(2)

    const activities = [
      ...(recentMembers?.map((m) => ({
        action: `New member registered: ${m.name}`,
        time: new Date(m.created_at).toLocaleDateString(),
        user: "System",
      })) || []),
      ...(recentEvents?.map((e) => ({
        action: `Event updated: ${e.title}`,
        time: new Date(e.updated_at).toLocaleDateString(),
        user: "Admin",
      })) || []),
    ]

    return activities.slice(0, 5)
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const activities = await getRecentActivity()

  const statsData = [
    {
      title: "Total Members",
      value: stats.memberCount.toString(),
      icon: Users,
      change: "+12% from last month",
    },
    {
      title: "Upcoming Events",
      value: stats.eventCount.toString(),
      icon: Calendar,
      change: "2 this week",
    },
    {
      title: "Total Donations",
      value: `₹${stats.totalDonations.toLocaleString()}`,
      icon: DollarSign,
      change: "+18% from last month",
    },
    {
      title: "Library Items",
      value: stats.libraryCount.toString(),
      icon: BookOpen,
      change: "12 added this month",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <h2 className="text-xl font-bold mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Manage Members", icon: Users, href: "/admin/members" },
          { title: "Manage Events", icon: Calendar, href: "/admin/events" },
          { title: "Manage Donations", icon: DollarSign, href: "/admin/donations" },
          { title: "Manage Library", icon: BookOpen, href: "/admin/library" },
          { title: "Manage Blogs", icon: FileText, href: "/admin/blogs" },
          { title: "Manage Gallery", icon: ImageIcon, href: "/admin/gallery" },
          { title: "Global Presence", icon: Globe, href: "/admin/global-presence" },
          { title: "Settings", icon: Settings, href: "/admin/settings" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <item.icon className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-center">{item.title}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">By {activity.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}