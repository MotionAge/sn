"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdminAuth } from "@/components/admin/auth-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Library,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
  UserCheck,
  FileText,
  Globe,
  HelpCircle,
  Award,
  CheckSquare,
  UserPlus,
  ImageIcon,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Donations", href: "/admin/donations", icon: DollarSign },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "Library", href: "/admin/library", icon: Library },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
]

const systemNavigation = [
  { name: "Admin Users", href: "/admin/users", icon: Shield },
  { name: "Activity Logs", href: "/admin/activity-logs", icon: Activity },
  { name: "Approvals", href: "/admin/approvals", icon: CheckSquare },
  { name: "Verification", href: "/admin/verification", icon: UserCheck },
  { name: "Certificates", href: "/admin/certificate-templates", icon: Award },
  { name: "Certificate Logs", href: "/admin/certificate-logs", icon: FileText },
  { name: "Global Presence", href: "/admin/global-presence", icon: Globe },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">SDB Nepal</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main</h3>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-4 w-4 flex-shrink-0",
                        isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500",
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* System Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">System</h3>
          <ul className="space-y-1">
            {systemNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-4 w-4 flex-shrink-0",
                        isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500",
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 bg-transparent"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(true)} className="bg-white shadow-md">
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
