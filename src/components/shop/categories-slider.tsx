'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Category } from '@prisma/client'

interface CategoriesSliderProps {
  categories: Category[]
}

export function CategoriesSlider({ categories }: CategoriesSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 hidden md:flex"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="flex-shrink-0 w-[200px] sm:w-[240px] group cursor-pointer"
          >
            <div className="border border-gray-200 rounded-[2.5px] overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-[#0A84FF]">
              <div className="aspect-square bg-white flex items-center justify-center p-3">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 font-semibold text-2xl">
                    {category.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-3 text-center font-medium text-gray-700 group-hover:text-[#0A84FF] transition-colors bg-white">
                {category.name}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 hidden md:flex"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}