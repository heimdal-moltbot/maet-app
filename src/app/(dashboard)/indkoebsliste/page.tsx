'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ShoppingItem {
  id: string
  name: string
  checked: boolean
}

export default function IndkoebslistePage() {
  const [items] = useState<ShoppingItem[]>([])

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Indkoebsliste</h1>
          <p className="mt-1 text-gray-600">
            Hold styr paa hvad du skal koebe
          </p>
        </div>
        <Button>Ny liste</Button>
      </div>

      <div className="mt-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-sm">
            <div className="text-5xl">🛒</div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Ingen varer paa listen
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Opret en madplan for automatisk at generere en indkoebsliste.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-white shadow-sm">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-6 py-4"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span
                    className={
                      item.checked
                        ? 'text-gray-400 line-through'
                        : 'text-gray-900'
                    }
                  >
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
