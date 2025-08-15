import type React from "react"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AdminSidebar from "@/components/admin/sidebar"

// async function verifyAuth(searchParams: URLSearchParams, pathname: string) {
//   // Skip authentication for /admin/login
//   if (pathname === "/admin/login") {
//     console.log("Skipping auth for /admin/login")
//     return
//   }

//   const username = searchParams.get("username")
//   const password = searchParams.get("password")
//   console.log("Verifying credentials for", pathname, { username }) // Debug log

//   // Redirect to /admin/login if credentials are missing or invalid
//   if (username !== "admin" || password !== "admin123") {
//     console.log("Invalid or missing credentials for", pathname, "redirecting to login")
//     redirect("/admin/login")
//   }
// }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get searchParams and pathname from the request
  const url = new URL("http://localhost" + (typeof window === "undefined" ? process.env.NEXT_PUBLIC_BASE_URL || "" : window.location.pathname + window.location.search))
  const searchParams = new URLSearchParams(url.search)
  const pathname = url.pathname

  //await verifyAuth(searchParams, pathname)

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}