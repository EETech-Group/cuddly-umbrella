import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const part = await prisma.part.findUnique({
      where: { id: parseInt(id) }
    })

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }

    return NextResponse.json(part)
  } catch (error) {
    console.error('Error fetching part:', error)
    return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const part = await prisma.part.update({
      where: { id: parseInt(id) },
      data: {
        part_number: body.part_number,
        name: body.name,
        description: body.description,
        manufacturer: body.manufacturer,
        category: body.category,
        quantity: parseInt(body.quantity),
        location: body.location,
        datasheet_url: body.datasheet_url,
        specifications: body.specifications
      }
    })

    return NextResponse.json(part)
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json({ error: 'Failed to update part' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.part.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Part deleted successfully' })
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 })
  }
}
