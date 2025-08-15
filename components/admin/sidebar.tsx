"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  FileText,
  ImageIcon,
  Globe,
  Settings,
  CheckCircle,
  Search,
  Award,
  HelpCircle,
  ChevronUp,
  User,
} from "lucide-react"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    title: "Members",
    icon: Users,
    href: "/admin/members",
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    title: "Donations",
    icon: DollarSign,
    href: "/admin/donations",
  },
  {
    title: "Library",
    icon: BookOpen,
    href: "/admin/library",
  },
  {
    title: "Blogs",
    icon: FileText,
    href: "/admin/blogs",
  },
  {
    title: "Gallery",
    icon: ImageIcon,
    href: "/admin/gallery",
  },
  {
    title: "Global Presence",
    icon: Globe,
    href: "/admin/global-presence",
  },
  {
    title: "Approvals",
    icon: CheckCircle,
    href: "/admin/approvals",
  },
  {
    title: "Verification",
    icon: Search,
    href: "/admin/verification",
  },
  {
    title: "Certificates",
    icon: Award,
    href: "/admin/certificate-templates",
  },
  {
    title: "FAQs",
    icon: HelpCircle,
    href: "/admin/faqs",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export default function AdminSidebar() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
            SDB
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">SDB Nepal</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="h-4 w-4" />
                  <span>Admin User</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}