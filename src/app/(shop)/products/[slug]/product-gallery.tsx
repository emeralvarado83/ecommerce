'use client'

import { useState } from 'react'
import type { ProductImage } from '@prisma/client'

export function ProductGallery({ 
  images, 
  productName 
}: { 
  images: ProductImage[]
  productName: string 
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-[2.5px] flex items-center justify-center">
        <span className="text-gray-400">Sin imagen</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white rounded-[2.5px] overflow-hidden flex items-center justify-center p-6">
        <img
          src={images[selectedIndex].url}
          alt={`${productName} - imagen ${selectedIndex + 1}`}
          className="max-w-full max-h-full w-auto h-auto"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-[2.5px] overflow-hidden border-2 ${
                index === selectedIndex ? 'border-[#0A84FF]' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={`${productName} - ${index + 1}`}
                className="max-w-full max-h-full w-auto h-auto"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}