import { NextRequest, NextResponse } from 'next/server'
import {
  getAllConcerns,
  addConcern,
  updateConcern,
  deleteConcern,
} from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'
    const concerns = await getAllConcerns(!showAll)

    return NextResponse.json({
      success: true,
      concerns,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ENT concerns' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.category) {
      return NextResponse.json(
        { success: false, error: 'ENT Concern Title and Category are required' },
        { status: 400 },
      )
    }

    const concern = await addConcern({
      title: body.title,
      category: body.category,
      description: body.description,
      commonSymptoms: body.commonSymptoms,
      isActive: body.isActive,
      isDefault: body.isDefault,
      sortOrder: body.sortOrder,
    })

    const allConcerns = await getAllConcerns(false)

    return NextResponse.json({
      success: true,
      concern,
      concerns: allConcerns,
      message: 'ENT Concern added successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add ENT concern' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, category, description, commonSymptoms, isActive, isDefault, sortOrder } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Concern ID is required' },
        { status: 400 },
      )
    }

    const updated = await updateConcern(id, {
      ...(title !== undefined ? { title } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(commonSymptoms !== undefined ? { commonSymptoms } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(isDefault !== undefined ? { isDefault } : {}),
      ...(sortOrder !== undefined ? { sortOrder } : {}),
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'ENT Concern not found' },
        { status: 404 },
      )
    }

    const allConcerns = await getAllConcerns(false)

    return NextResponse.json({
      success: true,
      concern: updated,
      concerns: allConcerns,
      message: 'ENT Concern updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update ENT concern' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Concern ID is required' },
        { status: 400 },
      )
    }

    const deleted = await deleteConcern(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'ENT Concern not found' },
        { status: 404 },
      )
    }

    const allConcerns = await getAllConcerns(false)

    return NextResponse.json({
      success: true,
      concerns: allConcerns,
      message: 'ENT Concern deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete ENT concern' },
      { status: 500 },
    )
  }
}
