export interface HospitalCenter {
  id: string
  name: string
  area: string
  timings: string
  tag?: string
  isActive: boolean
  isDefault?: boolean
  createdAt?: string
}

export interface ENTConcern {
  id: string
  title: string
  category: string
  description?: string
  commonSymptoms?: string
  isActive: boolean
  isDefault?: boolean
  sortOrder?: number
  createdAt?: string
}

export interface Appointment {
  id: string
  name: string
  phone: string
  location: string
  reason: string
  date: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string
}

export interface VisitorLog {
  id: number
  ip: string
  userAgent?: string
  path?: string
  visitedAt: string
  date: string
}

export interface AdminUser {
  id: string
  username: string
  name: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export interface DbSchema {
  visitors: {
    total: number
    todayCount: number
    lastDate: string
  }
  visitorLogs?: VisitorLog[]
  centers: HospitalCenter[]
  concerns: ENTConcern[]
  appointments: Appointment[]
}
