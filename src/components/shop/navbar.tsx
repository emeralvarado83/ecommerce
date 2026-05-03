'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, Search, X, User, Menu, ChevronRight } from 'lucide-react'
import { CartIndicator } from './cart-indicator'

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const navLinks = [
    { href: '/products', label: 'Productos' },
    { href: '/categories', label: 'Categorías' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#0A84FF]">
          TechStore
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-sm font-medium text-gray-700 hover:text-[#0A84FF] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-32 md:w-48 lg:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-[2.5px] focus:outline-none focus:border-[#0A84FF]"
                autoFocus
              />
              <Button type="submit" variant="ghost" size="icon" className="text-gray-700 hover:text-[#0A84FF] cursor-pointer">
                <Search className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-gray-700 hover:text-[#0A84FF] cursor-pointer" onClick={() => setSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-[#0A84FF] hover:bg-[#F5F5F7] cursor-pointer" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-[#0A84FF] hover:bg-[#F5F5F7] cursor-pointer">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <CartIndicator />
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[#0A84FF]/10 transition-colors">
                    {session.user.image ? (
                      <img 
                        src={session.user.image} 
                        alt="Perfil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200">
                  <DropdownMenuItem>
                    <Link href="/favorites" className="w-full">Mis Favoritos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders" className="w-full">Mis Pedidos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account" className="w-full">Mi Cuenta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#0A84FF] cursor-pointer text-sm px-3">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#0A84FF] hover:bg-[#007AE6] text-white cursor-pointer text-sm px-3">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-700 hover:text-[#0A84FF] hover:bg-[#F5F5F7] cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={closeMobileMenu} />
        <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-semibold text-gray-800">Menú</span>
              <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="cursor-pointer">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-[#F5F5F7] hover:text-[#0A84FF] transition-colors"
                >
                  <span className="font-medium">{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              {session ? (
                <div className="space-y-3">
                  <Link href="/account" onClick={closeMobileMenu} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F5F7]">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center overflow-hidden">
                      {session.user.image ? (
                        <img src={session.user.image} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{session.user.name || 'Mi Cuenta'}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                  </Link>
                  <Link href="/favorites" onClick={closeMobileMenu} className="block px-2 py-2 text-gray-700 hover:bg-[#F5F5F7] rounded-lg text-sm">
                    Mis Favoritos
                  </Link>
                  <Link href="/orders" onClick={closeMobileMenu} className="block px-2 py-2 text-gray-700 hover:bg-[#F5F5F7] rounded-lg text-sm">
                    Mis Pedidos
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => { signOut(); closeMobileMenu(); }} 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full cursor-pointer">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu}>
                    <Button className="w-full bg-[#0A84FF] hover:bg-[#007AE6] text-white cursor-pointer">Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}