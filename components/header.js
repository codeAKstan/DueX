"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "How it Works", href: "/#how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#026432] to-green-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#026432] to-green-600 bg-clip-text text-transparent">
              DueX
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 transition-colors"
              style={{'&:hover': {color: '#026432'}}}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="ghost" className="text-gray-900" style={{'&:hover': {color: '#026432'}}}>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="text-white" style={{backgroundColor: '#026432', ':hover': {backgroundColor: '#024d28'}}}>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-m-2.5 p-2.5">
                <Menu className="h-6 w-6 text-gray-700" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#026432] to-green-600 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#026432] to-green-600 bg-clip-text text-transparent">
                      DueX
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-semibold text-gray-900 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                    style={{'&:hover': {color: '#026432'}}}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-6 space-y-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-900"
                    style={{'&:hover': {color: '#026432'}}}
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-auto px-8 text-white mx-auto block"
                    style={{backgroundColor: '#026432', ':hover': {backgroundColor: '#024d28'}}}
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
