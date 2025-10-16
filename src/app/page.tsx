'use client'

import { useState } from 'react'
import { PartsTable } from '@/components/parts-table'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Electronic Parts Database</h1>
          <p className="text-gray-600 mt-2">
            Manage your electronic components inventory
          </p>
        </div>
        
        <PartsTable key={refreshKey} onRefresh={handleRefresh} />
      </div>
    </div>
  )
}