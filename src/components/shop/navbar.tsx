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
import { ShoppingCart, Search, X } from 'lucide-react'
import { CartIndicator } from './cart-indicator'

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#0A84FF]">
          TechStore
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-[#0A84FF] transition-colors">
            Productos
          </Link>
          <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-[#0A84FF] transition-colors">
            Categorías
          </Link>
          <Link href="/nosotros" className="text-sm font-medium text-gray-700 hover:text-[#0A84FF] transition-colors">
            Nosotros
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-gray-700 hover:text-[#0A84FF] transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-48 md:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-[2.5px] focus:outline-none focus:border-[#0A84FF]"
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

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="font-medium text-gray-700 hover:text-[#0A84FF] cursor-pointer">
                  {session.user.name || session.user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-gray-200">
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
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-[#0A84FF] cursor-pointer">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#0A84FF] hover:bg-[#007AE6] text-white cursor-pointer">Registrarse</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}