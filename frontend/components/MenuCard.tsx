// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import { Pencil, Trash2, ImageOff } from 'lucide-react'
// import { MenuItem } from '@/lib/api'

// interface MenuCardProps {
//   item: MenuItem
//   index: number
//   onEdit?: (item: MenuItem) => void
//   onDelete?: (item: MenuItem) => void
//   readOnly?: boolean
// }

// export default function MenuCard({ item, index, onEdit, onDelete, readOnly = false }: MenuCardProps) {
//   const [imgError, setImgError] = useState(false)

//   return (
//     <div
//       className="card animate-fade-up group"
//       style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
//     >
//       {/* Image */}
//       <div className="relative h-48 bg-cream-100 overflow-hidden">
//         {item.image_url && !imgError ? (
//           <Image
//             src={item.image_url}
//             alt={item.name}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-105"
//             onError={() => setImgError(true)}
//             unoptimized
//           />
//         ) : (
//           <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream-100">
//             <ImageOff className={`w-8 h-8 ${imgError ? 'text-amber-300' : 'text-cream-200'}`} />
//             <span className="text-[11px] font-medium tracking-wider uppercase text-warm-gray/50">
//               {imgError ? 'Invalid image URL' : 'No image'}
//             </span>
//           </div>
//         )}

//         {/* Availability overlay badge */}
//         <div className="absolute top-3 right-3">
//           <span
//             className={`badge ${item.is_available
//                 ? 'bg-green-50 text-green-600 border border-green-200'
//                 : 'bg-red-50 text-red-500 border border-red-200'
//               }`}
//           >
//             {item.is_available ? '● Available' : '○ Unavailable'}
//           </span>
//         </div>

//         {/* Category badge */}
//         <div className="absolute top-3 left-3">
//           <span className="badge bg-charcoal/70 text-white/90 backdrop-blur-sm">
//             {item.category}
//           </span>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-5">
//         <div className="flex items-start justify-between gap-3 mb-2">
//           <h3 className="font-display text-lg font-medium text-charcoal leading-snug flex-1">
//             {item.name}
//           </h3>
//           <span className="font-display text-lg font-medium text-ember-500 whitespace-nowrap">
//             PKR {Number(item.price).toLocaleString()}
//           </span>
//         </div>

//         <p className="text-sm text-warm-gray font-light leading-relaxed line-clamp-2 mb-4 min-h-[2.8rem]">
//           {item.description || 'No description provided.'}
//         </p>

//         {!readOnly && onEdit && onDelete && (
//           <div className="flex items-center gap-2 pt-3 border-t border-cream-100">
//             <button
//               onClick={() => onEdit(item)}
//               className="flex items-center gap-1.5 text-sm font-medium text-warm-gray hover:text-ember-500 transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-ember-500/8"
//             >
//               <Pencil className="w-3.5 h-3.5" />
//               Edit
//             </button>
//             <button
//               onClick={() => onDelete(item)}
//               className="flex items-center gap-1.5 text-sm font-medium text-warm-gray hover:text-red-500 transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-red-50 ml-auto"
//             >
//               <Trash2 className="w-3.5 h-3.5" />
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Trash2, ImageOff, ShoppingCart, Check } from 'lucide-react'
import { MenuItem } from '@/lib/api'

interface MenuCardProps {
  item: MenuItem
  index: number
  onEdit?: (item: MenuItem) => void
  onDelete?: (item: MenuItem) => void
  onAddToCart?: (item: MenuItem) => boolean | Promise<boolean>
  readOnly?: boolean
  outOfStock?: boolean
}

export default function MenuCard({ item, index, onEdit, onDelete, onAddToCart, readOnly = false, outOfStock = false }: MenuCardProps) {
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    if (!onAddToCart) return
    const addedToCart = await onAddToCart(item)
    if (!addedToCart) return
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      className="card animate-fade-up group"
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 bg-cream-100 overflow-hidden">
        {item.image_url && !imgError ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream-100">
            <ImageOff className={`w-8 h-8 ${imgError ? 'text-amber-300' : 'text-cream-200'}`} />
            <span className="text-[11px] font-medium tracking-wider uppercase text-warm-gray/50">
              {imgError ? 'Invalid image URL' : 'No image'}
            </span>
          </div>
        )}

        {/* <div className="absolute top-3 right-3">
          <span className={`badge ${item.is_available
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-red-50 text-red-500 border border-red-200'
          }`}>
            {item.is_available ? '● Available' : '○ Unavailable'}
          </span>
        </div> */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${item.is_available && !outOfStock
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-red-50 text-red-500 border border-red-200'
            }`}>
            {item.is_available && !outOfStock ? '● Available' : '○ Unavailable'}
          </span>
        </div>

        <div className="absolute top-3 left-3">
          <span className="badge bg-charcoal/70 text-white/90 backdrop-blur-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-lg font-medium text-charcoal leading-snug flex-1">
            {item.name}
          </h3>
          <span className="font-display text-lg font-medium text-ember-500 whitespace-nowrap">
            PKR {Number(item.price).toLocaleString()}
          </span>
        </div>

        <p className="text-sm text-warm-gray font-light leading-relaxed line-clamp-2 mb-4 min-h-[2.8rem]">
          {item.description || 'No description provided.'}
        </p>

        {/* Customer: Add to Cart */}
        {readOnly && onAddToCart && item.is_available && !outOfStock &&  (
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${added
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-ember-500/10 text-ember-500 hover:bg-ember-500 hover:text-white border border-ember-500/20 hover:border-ember-500'
              }`}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5" /> Added!</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
            )}
          </button>
        )}

        {/* Admin: Edit / Delete */}
        {!readOnly && onEdit && onDelete && (
          <div className="flex items-center gap-2 pt-3 border-t border-cream-100">
            <button
              onClick={() => onEdit(item)}
              className="flex items-center gap-1.5 text-sm font-medium text-warm-gray hover:text-ember-500 transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-ember-500/8"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => onDelete(item)}
              className="flex items-center gap-1.5 text-sm font-medium text-warm-gray hover:text-red-500 transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-red-50 ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

