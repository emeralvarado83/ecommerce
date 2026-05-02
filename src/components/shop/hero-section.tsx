'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function HeroSection() {
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <section className="relative bg-[#1C1C1E] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-70">
        <Image
          src="/ChatGPT-Image-1-may-2026-17_01_26.png"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E] via-[#1C1C1E]/90 to-transparent" />
      <div className="container mx-auto px-4 py-28 relative">
        <div className="max-w-2xl">
          <span className="text-[#0A84FF] font-semibold text-sm tracking-widest uppercase mb-4 block">
            Tecnología de última generación
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Descubre el futuro de la <span className="text-[#0A84FF]">tecnología</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
            Encuentra los dispositivos más innovadores del mercado. 
            Smartphones, laptops, audio y accesorios premium en un solo lugar.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-[#0A84FF] hover:bg-[#007AE6] text-white px-8 h-12 text-base cursor-pointer">
                Explorar Productos
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-[#1C1C1E] hover:bg-white hover:text-[#1C1C1E] px-8 h-12 text-base font-semibold cursor-pointer">
                  Crear Cuenta
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}