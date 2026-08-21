import { NextRequest, NextResponse } from 'next/server'
import {
  getAllAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getStats,
} from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const location = searchParams.get('location')
    const search = searchParams.get('search')?.toLowerCase()

    let appointments = await getAllAppointments()

    if (status && status !== 'all') {
      appointments = appointments.filter((a) => a.status === status)
    }

    if (location && location !== 'all') {
      appointments = appointments.filter((a) =>
        a.location.toLowerCase().includes(location.toLowerCase()),
      )
    }

    if (search) {
      appointments = appointments.filter(
        (a) =>
          a.name.toLowerCase().includes(search) ||
          a.phone.includes(search) ||
          a.reason.toLowerCase().includes(search) ||
          a.location.toLowerCase().includes(search),
      )
    }

    const stats = await getStats()

    return NextResponse.json({
      success: true,
      appointments,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Patient name and mobile number are required' },
        { status: 400 },
      )
    }

    const appointment = await addAppointment({
      name: body.name,
      phone: body.phone,
      location: body.location,
      reason: body.reason,
      date: body.date,
      notes: body.notes,
    })

    const stats = await getStats()

    return NextResponse.json({
      success: true,
      appointment,
      stats,
      message: 'Appointment request saved successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save appointment request' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes, date, location } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 },
      )
    }

    const updated = await updateAppointment(id, {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(date ? { date } : {}),
      ...(location ? { location } : {}),
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 },
      )
    }

    const stats = await getStats()

    return NextResponse.json({
      success: true,
      appointment: updated,
      stats,
      message: 'Appointment updated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
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
        { success: false, error: 'Appointment ID is required' },
        { status: 400 },
      )
    }

    const deleted = await deleteAppointment(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 },
      )
    }

    const stats = await getStats()

    return NextResponse.json({
      success: true,
      stats,
      message: 'Appointment deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 },
    )
  }
}
