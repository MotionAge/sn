import Link from "next/link"
import { Facebook, Youtube, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">Sanatan Dharma Bigyan Samaj</h3>
            <p className="text-gray-300 mb-4">
              Promoting Sanatan Dharma values and education in Nepal through various initiatives and programs.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-300 hover:text-orange-500">
                <Facebook size={20} />
              </Link>
              <Link href="https://youtube.com" className="text-gray-300 hover:text-orange-500">
                <Youtube size={20} />
              </Link>
              <Link href="https://linkedin.com" className="text-gray-300 hover:text-orange-500">
                <Linkedin size={20} />
              </Link>
              <Link href="https://instagram.com" className="text-gray-300 hover:text-orange-500">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-orange-500">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-orange-500">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-300 hover:text-orange-500">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-500">Membership</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/membership/apply" className="text-gray-300 hover:text-orange-500">
                  Apply for Membership
                </Link>
              </li>
              <li>
                <Link href="/membership/check" className="text-gray-300 hover:text-orange-500">
                  Check Membership
                </Link>
              </li>
              <li>
                <Link href="/membership/login" className="text-gray-300 hover:text-orange-500">
                  Member Login
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-300 hover:text-orange-500">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-500">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Kathmandu, Nepal</p>
              <p>Email: info@sdbnepal.org</p>
              <p>Phone: +977 1234567890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Sanatan Dharma Bigyan Samaj. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
