'use client'

import { useState } from 'react'
import { Star, Trash2, Plus, Minus } from 'lucide-react'
import { useHapticFeedback } from '../hooks/useMobileFeatures'

interface MobileShoppingItemProps {
  item: {
    id: string
    name: string
    category: string
    emoji: string
    quantity: number
    completed: boolean
    favorited?: boolean
  }
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onToggleFavorite: (id: string) => void
}

export default function MobileShoppingItem({ 
  item, 
  onToggle, 
  onDelete, 
  onUpdateQuantity,
  onToggleFavorite
}: MobileShoppingItemProps) {
  const [showActions, setShowActions] = useState(false)
  const { triggerHaptic } = useHapticFeedback()

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX
    const startTime = Date.now()

    const handleTouchEnd = (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX
      const endTime = Date.now()
      const deltaX = endX - startX
      const deltaTime = endTime - startTime

      if (Math.abs(deltaX) > 50 && deltaTime < 300) {
        if (deltaX < 0) {
          setShowActions(true)
          triggerHaptic('light')
        } else {
          setShowActions(false)
          triggerHaptic('light')
        }
      } else if (Math.abs(deltaX) < 30 && deltaTime < 200) {
        onToggle(item.id)
        triggerHaptic('light')
      }

      document.removeEventListener('touchend', handleTouchEnd as any)
    }

    document.addEventListener('touchend', handleTouchEnd as any)
  }

  return (
    <div className="relative mb-3 overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
      {/* Action Buttons (revealed on swipe) */}
      <div className={`absolute right-0 top-0 h-full flex transition-transform duration-300 ${showActions ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={() => {
            onToggleFavorite(item.id)
            setShowActions(false)
            triggerHaptic('medium')
          }}
          className={`w-16 h-full flex items-center justify-center ${
            item.favorited ? 'bg-yellow-400' : 'bg-gray-300'
          }`}
        >
          <Star className={`w-6 h-6 ${item.favorited ? 'text-yellow-700 fill-current' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={() => {
            onDelete(item.id)
            setShowActions(false)
            triggerHaptic('heavy')
          }}
          className="w-16 h-full bg-red-500 flex items-center justify-center"
        >
          <Trash2 className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main Item */}
      <div
        onTouchStart={handleTouchStart}
        className={`p-4 transition-transform duration-300 ${showActions ? '-translate-x-32' : 'translate-x-0'} ${
          item.completed ? 'bg-green-50 opacity-75' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle(item.id)
                triggerHaptic('light')
              }}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                item.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {item.completed && '✓'}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className={`font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (item.quantity > 1) {
                  onUpdateQuantity(item.id, item.quantity - 1)
                  triggerHaptic('light')
                }
              }}
              className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold active:bg-blue-200 transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-blue-600 text-lg">{item.quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdateQuantity(item.id, item.quantity + 1)
                triggerHaptic('light')
              }}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold active:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Hint */}
      {!showActions && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 text-xs">
          👈 Deslize
        </div>
      )}
    </div>
  )
}