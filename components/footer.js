import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Email</span>
            <Mail className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start">
            <span className="text-2xl font-bold text-white">DueX</span>
            <span className="ml-2 text-sm text-gray-400">by Your University Tech Team</span>
          </div>
          <p className="text-center text-xs leading-5 text-gray-400 md:text-left mt-2">
            &copy; 2025 DueX. All rights reserved. Transforming Nigerian university administration.
          </p>
        </div>
      </div>
    </footer>
  )
}
