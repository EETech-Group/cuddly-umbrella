'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus } from 'lucide-react'
import { PartForm } from './part-form'
import { DeleteConfirmDialog } from './delete-confirm-dialog'

interface Part {
  id: number
  part_number: string
  name: string
  description?: string
  manufacturer?: string
  category: string
  quantity: number
  location?: string
  datasheet_url?: string
  specifications?: any
  created_at: string
  updated_at: string
}

interface PartsTableProps {
  onRefresh: () => void
}

export function PartsTable({ onRefresh }: PartsTableProps) {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [deletingPart, setDeletingPart] = useState<Part | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const categories = ['resistor', 'capacitor', 'IC', 'LED', 'connector', 'transistor', 'diode', 'other']

  const fetchParts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter)
      
      const response = await fetch(`/api/parts?${params.toString()}`)
      const data = await response.json()
      setParts(data)
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParts()
  }, [search, categoryFilter])

  const handleDelete = async (part: Part) => {
    try {
      await fetch(`/api/parts/${part.id}`, {
        method: 'DELETE'
      })
      onRefresh()
      setDeletingPart(null)
    } catch (error) {
      console.error('Error deleting part:', error)
    }
  }

  const handleEdit = (part: Part) => {
    setEditingPart(part)
  }

  const handleCreate = () => {
    setShowCreateForm(true)
  }

  const handleFormClose = () => {
    setEditingPart(null)
    setShowCreateForm(false)
    onRefresh()
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <Input
            placeholder="Search parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Part
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No parts found
                </TableCell>
              </TableRow>
            ) : (
              parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium">{part.part_number}</TableCell>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>{part.manufacturer || '-'}</TableCell>
                  <TableCell>
                    <span className="capitalize">{part.category}</span>
                  </TableCell>
                  <TableCell>{part.quantity}</TableCell>
                  <TableCell>{part.location || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(part)}
                        className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingPart(part)}
                        className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Forms and Dialogs */}
      {editingPart && (
        <PartForm
          part={editingPart}
          onClose={handleFormClose}
          mode="edit"
        />
      )}

      {showCreateForm && (
        <PartForm
          onClose={handleFormClose}
          mode="create"
        />
      )}

      {deletingPart && (
        <DeleteConfirmDialog
          part={deletingPart}
          onConfirm={() => handleDelete(deletingPart)}
          onCancel={() => setDeletingPart(null)}
        />
      )}
    </div>
  )
}
