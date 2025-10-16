import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where: any = {}
    
    if (search) {
      where.OR = [
        { part_number: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.category = category
    }

    const parts = await prisma.part.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(parts)
  } catch (error) {
    console.error('Error fetching parts:', error)
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const part = await prisma.part.create({
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

    return NextResponse.json(part, { status: 201 })
  } catch (error) {
    console.error('Error creating part:', error)
    return NextResponse.json({ error: 'Failed to create part' }, { status: 500 })
  }
}
