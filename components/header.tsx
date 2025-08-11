"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toggleLanguage, language } = useTranslation()

  const mainNavItems = [
    { name: "About Us", href: "/about" },
    { name: "Event Enrollment", href: "/events" },
    { name: "Karma (Projects)", href: "/projects" },
    { name: "Blogs", href: "/blogs" },
    { name: "Library", href: "/library" },
    { name: "Contact Us", href: "/contact" },
  ]

  const topNavItems = [
    { name: "Donate", href: "/donate", highlight: true },
    { name: "Apply for Membership", href: "/membership/apply" },
    { name: "Check Membership", href: "/membership/check" },
    { name: "Member Login", href: "/membership/login" },
  ]

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center border-b">
        <Link href="/" className="flex items-center">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="SDB Nepal Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="font-bold text-orange-600">SDB Nepal</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {topNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm ${item.highlight ? "text-orange-600 font-bold" : "text-gray-600"}`}
            >
              {item.name}
            </Link>
          ))}
          <Button variant="ghost" size="sm" onClick={toggleLanguage} className="ml-2 text-sm">
            {language === "en" ? "NP" : "EN"}
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-3 hidden md:block">
        <ul className="flex justify-center space-x-8">
          {mainNavItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="text-gray-700 hover:text-orange-600 font-medium">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-lg">
          <div className="flex flex-col space-y-3 mb-4">
            {topNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${item.highlight ? "text-orange-600 font-bold" : "text-gray-600"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="self-start">
              {language === "en" ? "NP" : "EN"}
            </Button>
          </div>

          <div className="border-t pt-3">
            <ul className="flex flex-col space-y-3">
              {mainNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-orange-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
