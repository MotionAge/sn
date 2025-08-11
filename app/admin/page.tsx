import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, BookOpen, FileText, ImageIcon, Globe, Settings } from "lucide-react"

export default function AdminDashboard() {
  // Mock data for dashboard stats
  const stats = [
    { title: "Total Members", value: "1,234", icon: Users, change: "+12% from last month" },
    { title: "Upcoming Events", value: "8", icon: Calendar, change: "2 this week" },
    { title: "Total Donations", value: "₹1,245,678", icon: DollarSign, change: "+18% from last month" },
    { title: "Library Items", value: "567", icon: BookOpen, change: "12 added this month" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
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
          <a
            key={item.title}
            href={item.href}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <item.icon className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-center">{item.title}</span>
          </a>
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
            {[
              { action: "New member registered", time: "2 minutes ago", user: "Admin" },
              { action: "Event 'Sanskrit Workshop' updated", time: "1 hour ago", user: "Admin" },
              { action: "New donation received", time: "3 hours ago", user: "System" },
              { action: "New blog post published", time: "5 hours ago", user: "Admin" },
              { action: "Library item added", time: "Yesterday", user: "Admin" },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">By {activity.user}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
