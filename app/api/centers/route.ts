import { NextRequest, NextResponse } from 'next/server'
import {
  getAllCenters,
  addCenter,
  updateCenter,
  deleteCenter,
} from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'
    const centers = await getAllCenters(!showAll)

    return NextResponse.json({
      success: true,
      centers,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hospital centers' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.area) {
      return NextResponse.json(
        { success: false, error: 'Hospital Center Name and Area/Address are required' },
        { status: 400 },
      )
    }

    const center = await addCenter({
      name: body.name,
      area: body.area,
      timings: body.timings,
      tag: body.tag,
      isDefault: body.isDefault,
    })

    const allCenters = await getAllCenters(false)

    return NextResponse.json({
      success: true,
      center,
      centers: allCenters,
      message: 'Hospital Center added successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add hospital center' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, area, timings, tag, isActive, isDefault } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Center ID is required' },
        { status: 400 },
      )
    }

    const updated = await updateCenter(id, {
      ...(name !== undefined ? { name } : {}),
      ...(area !== undefined ? { area } : {}),
      ...(timings !== undefined ? { timings } : {}),
      ...(tag !== undefined ? { tag } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(isDefault !== undefined ? { isDefault } : {}),
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Hospital Center not found' },
        { status: 404 },
      )
    }

    const allCenters = await getAllCenters(false)

    return NextResponse.json({
      success: true,
      center: updated,
      centers: allCenters,
      message: 'Hospital Center updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update hospital center' },
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
        { success: false, error: 'Center ID is required' },
        { status: 400 },
      )
    }

    const deleted = await deleteCenter(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Hospital Center not found' },
        { status: 404 },
      )
    }

    const allCenters = await getAllCenters(false)

    return NextResponse.json({
      success: true,
      centers: allCenters,
      message: 'Hospital Center deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete hospital center' },
      { status: 500 },
    )
  }
}
