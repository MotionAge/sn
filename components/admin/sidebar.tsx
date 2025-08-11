"use client"

import Link from "next/link"
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  FileText,
  ImageIcon,
  Globe,
  FileCode,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function AdminSidebar() {
  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/admin" },
    { name: "Members", icon: Users, href: "/admin/members" },
    { name: "Events", icon: Calendar, href: "/admin/events" },
    { name: "Donations", icon: DollarSign, href: "/admin/donations" },
    { name: "Library", icon: BookOpen, href: "/admin/library" },
    { name: "Blogs", icon: FileText, href: "/admin/blogs" },
    { name: "Gallery", icon: ImageIcon, href: "/admin/gallery" },
    { name: "Global Presence", icon: Globe, href: "/admin/global-presence" },
    { name: "Policy & Team", icon: FileCode, href: "/admin/policy-team" },
    { name: "FAQs", icon: FileText, href: "/admin/faqs" },
    { name: "Certificate Logs", icon: FileText, href: "/admin/certificate-logs" },
    //{ name: "Settings", icon: Settings, href: "/admin/settings" },
  ]

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center p-4">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold mr-2">
              A
            </div>
            <div>
              <p className="font-medium">Admin Panel</p>
              <p className="text-xs text-muted-foreground">SDB Nepal</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Super Admin</span>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
              <Link href="/">View Website</Link>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger />
      </div>
    </>
  )
}
