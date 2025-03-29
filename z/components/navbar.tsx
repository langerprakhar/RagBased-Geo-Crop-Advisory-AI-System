"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronDown, LogOut, Menu, X } from "lucide-react"

export function Navbar() {
  const { user, signOut } = useAuth()
  const [userName, setUserName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function getUserName() {
      if (user) {
        setIsLoading(true)
        try {
          const { data, error } = await supabase
            .from('user')
            .select('full_name')
            .eq('uid', user.id)
            .single()

          if (data && !error) {
            setUserName(data.full_name)
          }
        } catch (error) {
          console.error('Error fetching user name:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    getUserName()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Navigation Items
  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto max-w-5xl px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-green-800">
            AgriJyothi
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-green-700 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons / User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <span className="text-green-700">
                      {isLoading ? "Loading..." : `Hello, ${userName}`}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-green-600 hover:text-green-700">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-green-800">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {/* Mobile Navigation Links */}
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-600 hover:text-green-700 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Auth Section */}
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-green-700 font-medium">
                          {isLoading ? "Loading..." : `Hello, ${userName}`}
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 px-4">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button 
                            variant="ghost" 
                            className="w-full text-green-600 hover:text-green-700"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            Register
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}