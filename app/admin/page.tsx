'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Phone,
  MessageCircle,
  Download,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Stethoscope,
  Send,
  Eye,
  Trash2,
  Building2,
  FileText,
  AlertCircle,
  Check,
  ChevronDown,
  User,
  Lock,
  EyeOff,
  Calendar,
  X,
  Sparkles,
  MapPin,
  Plus,
  Edit3,
  Power,
  Activity,
  Tag,
  Filter,
  Layers,
  Globe,
  Compass,
  Laptop,
  Smartphone,
  Tablet,
  KeyRound,
  Crown,
  UserCheck,
  UserPlus,
  ShieldAlert,
} from 'lucide-react'
import { site } from '@/lib/site'
import type { Appointment, HospitalCenter, ENTConcern, VisitorLog, AdminUser } from '@/lib/types'

function parseUserAgentInfo(ua?: string): {
  browser: string
  os: string
  device: 'mobile' | 'tablet' | 'desktop' | 'bot'
  label: string
} {
  if (!ua || !ua.trim()) {
    return { browser: 'Web Browser', os: 'Desktop/Mobile', device: 'desktop', label: 'Direct Browser Client' }
  }

  const clean = ua.trim()

  // 1. Detect OS
  let os = 'Unknown OS'
  if (/windows nt 10/i.test(clean)) os = 'Windows 10/11'
  else if (/windows nt 6\.3/i.test(clean)) os = 'Windows 8.1'
  else if (/windows nt 6\.1/i.test(clean)) os = 'Windows 7'
  else if (/windows/i.test(clean)) os = 'Windows'
  else if (/iphone/i.test(clean)) os = 'iPhone (iOS)'
  else if (/ipad/i.test(clean)) os = 'iPadOS'
  else if (/android/i.test(clean)) {
    const match = clean.match(/android\s+([\d.]+)/i)
    os = match ? `Android ${match[1]}` : 'Android'
  } else if (/mac os x/i.test(clean)) {
    os = 'macOS'
  } else if (/linux/i.test(clean)) {
    os = 'Linux'
  } else if (/cros/i.test(clean)) {
    os = 'ChromeOS'
  }

  // 2. Detect Device Type
  let device: 'mobile' | 'tablet' | 'desktop' | 'bot' = 'desktop'
  if (/bot|crawler|spider|googlebot|bingbot|yandex/i.test(clean)) {
    device = 'bot'
  } else if (/ipad|tablet|(android(?!.*mobile))/i.test(clean)) {
    device = 'tablet'
  } else if (/mobi|iphone|ipod|android/i.test(clean)) {
    device = 'mobile'
  }

  // 3. Detect Browser
  let browser = 'Browser'
  if (/edg\//i.test(clean)) {
    const m = clean.match(/edg\/([\d.]+)/i)
    browser = `Edge${m ? ` ${m[1].split('.')[0]}` : ''}`
  } else if (/opr\/|opera/i.test(clean)) {
    browser = 'Opera'
  } else if (/samsungbrowser/i.test(clean)) {
    browser = 'Samsung Internet'
  } else if (/chrome|crios/i.test(clean) && !/edg\//i.test(clean)) {
    const m = clean.match(/(?:chrome|crios)\/([\d.]+)/i)
    browser = `Chrome${m ? ` ${m[1].split('.')[0]}` : ''}`
  } else if (/firefox|fxios/i.test(clean)) {
    const m = clean.match(/(?:firefox|fxios)\/([\d.]+)/i)
    browser = `Firefox${m ? ` ${m[1].split('.')[0]}` : ''}`
  } else if (/safari/i.test(clean) && !/chrome|crios|android/i.test(clean)) {
    browser = 'Safari'
  }

  const label = `${browser} • ${os}`

  return { browser, os, device, label }
}

function formatBookingRef(apt: { id: string | number; createdAt?: string }): string {
  const d = apt.createdAt ? new Date(apt.createdAt) : new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `ENT-${yyyy}${mm}${dd}-${String(apt.id).padStart(4, '0')}`
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Role Based Access State: 'super_admin' (Director Dr. Vaidik) or 'staff' (Clinic Reception)
  const [userRole, setUserRole] = useState<'super_admin' | 'staff'>('super_admin')
  const [adminDisplayName, setAdminDisplayName] = useState<string>('Dr. Vaidik Chauhan')

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'appointments' | 'centers' | 'concerns' | 'visitors' | 'security'>('appointments')
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([])
  const [visitorSearch, setVisitorSearch] = useState('')

  // Security & Account Settings State (Database Auth)
  const [currentAdminUser, setCurrentAdminUser] = useState('admin')
  const [secCurrentPassword, setSecCurrentPassword] = useState('')
  const [secNewUsername, setSecNewUsername] = useState('admin')
  const [secNewPassword, setSecNewPassword] = useState('')
  const [secConfirmPassword, setSecConfirmPassword] = useState('')
  const [secShowCurrentPass, setSecShowCurrentPass] = useState(false)
  const [secShowNewPass, setSecShowNewPass] = useState(false)
  const [secLoading, setSecLoading] = useState(false)
  const [secError, setSecError] = useState('')
  const [secSuccess, setSecSuccess] = useState('')

  // Staff Accounts Management State (Super Admin Only)
  const [staffUsers, setStaffUsers] = useState<AdminUser[]>([])
  const [staffLoading, setStaffLoading] = useState(false)
  const [staffSearchQuery, setStaffSearchQuery] = useState('')
  const [staffModalOpen, setStaffModalOpen] = useState(false)
  const [editingStaffUser, setEditingStaffUser] = useState<AdminUser | null>(null)
  const [staffForm, setStaffForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'staff',
  })
  const [staffFormLoading, setStaffFormLoading] = useState(false)
  const [staffFormError, setStaffFormError] = useState('')
  const [showStaffPass, setShowStaffPass] = useState(false)
  const [deleteStaffModalOpen, setDeleteStaffModalOpen] = useState(false)
  const [deletingStaffUser, setDeletingStaffUser] = useState<AdminUser | null>(null)
  const [deleteStaffLoading, setDeleteStaffLoading] = useState(false)
  const [deleteStaffError, setDeleteStaffError] = useState('')

  // Dashboard Data State
  const [stats, setStats] = useState({
    visitorsTotal: 0,
    visitorsToday: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    todayAppointments: 0,
    totalActiveCenters: 3,
    databaseSource: 'Local Storage',
  })
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [centers, setCenters] = useState<HospitalCenter[]>([])
  const [concerns, setConcerns] = useState<ENTConcern[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [hospitalFilter, setHospitalFilter] = useState('all')

  // Center Master Modal State
  const [centerModalOpen, setCenterModalOpen] = useState(false)
  const [editingCenter, setEditingCenter] = useState<HospitalCenter | null>(null)
  const [centerForm, setCenterForm] = useState({
    name: '',
    area: '',
    timings: 'Mon - Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM',
    tag: 'Primary Center (Director & Head)',
    isDefault: false,
    isActive: true,
  })
  const [centerFormLoading, setCenterFormLoading] = useState(false)
  const [centerFormError, setCenterFormError] = useState('')

  // ENT Concern Master Modal & Filter State
  const [concernModalOpen, setConcernModalOpen] = useState(false)
  const [editingConcern, setEditingConcern] = useState<ENTConcern | null>(null)
  const [concernCategoryFilter, setConcernCategoryFilter] = useState('all')
  const [concernSearchQuery, setConcernSearchQuery] = useState('')
  const [concernForm, setConcernForm] = useState({
    title: '',
    category: 'Nose & Sinus (Rhinology)',
    description: '',
    commonSymptoms: '',
    isDefault: false,
    isActive: true,
    sortOrder: 0,
  })
  const [concernFormLoading, setConcernFormLoading] = useState(false)
  const [concernFormError, setConcernFormError] = useState('')

  // Custom Quick Messenger State
  const [msgPatientName, setMsgPatientName] = useState('')
  const [msgPatientPhone, setMsgPatientPhone] = useState('')
  const [msgTemplate, setMsgTemplate] = useState('confirmation')
  const [msgCustomText, setMsgCustomText] = useState('')
  const [msgNewDate, setMsgNewDate] = useState('')
  const [msgNewTime, setMsgNewTime] = useState('06:00 PM - 07:30 PM (Evening OPD)')
  const [msgSuccess, setMsgSuccess] = useState(false)

  // Reschedule Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedAptForReschedule, setSelectedAptForReschedule] = useState<Appointment | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('06:00 PM - 07:30 PM (Evening OPD)')
  const [rescheduleLocation, setRescheduleLocation] = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('Doctor OT Schedule / Alternate Available Slot')
  const [isRescheduling, setIsRescheduling] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check existing login in sessionStorage (clears automatically when tab is closed)
  useEffect(() => {
    const token = sessionStorage.getItem('dr_vaidik_admin_token')
    const savedUser = sessionStorage.getItem('dr_vaidik_admin_username')
    const savedRole = sessionStorage.getItem('dr_vaidik_admin_role') as 'super_admin' | 'staff' | null
    const savedName = sessionStorage.getItem('dr_vaidik_admin_name')
    if (token) {
      setIsAuthenticated(true)
      if (savedUser) {
        setCurrentAdminUser(savedUser)
        setSecNewUsername(savedUser)
      }
      if (savedRole) {
        setUserRole(savedRole)
      }
      if (savedName) {
        setAdminDisplayName(savedName)
      }
    }
  }, [])

  // Fetch Dashboard Data (supports silent background auto-refresh)
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    try {
      const [aptsRes, centersRes, concernsRes, visitorsRes] = await Promise.all([
        fetch('/api/appointments', { cache: 'no-store' }),
        fetch('/api/centers?all=true', { cache: 'no-store' }),
        fetch('/api/concerns?all=true', { cache: 'no-store' }),
        fetch('/api/visitors?logs=true', { cache: 'no-store' }),
      ])
      const aptsData = await aptsRes.json()
      const centersData = await centersRes.json()
      const concernsData = await concernsRes.json()
      const visitorsData = await visitorsRes.json()

      if (aptsData.success) {
        setAppointments(aptsData.appointments)
        setStats(aptsData.stats)
      }
      if (centersData.success) {
        setCenters(centersData.centers)
      }
      if (concernsData.success) {
        setConcerns(concernsData.concerns)
      }
      if (visitorsData.success) {
        if (visitorsData.logs) {
          setVisitorLogs(visitorsData.logs)
        }
        if (visitorsData.stats) {
          setStats((prev) => ({ ...prev, ...visitorsData.stats }))
        }
      }

      // Fetch Staff Users if Super Admin
      try {
        const usersRes = await fetch('/api/auth/users', { cache: 'no-store' })
        const usersData = await usersRes.json()
        if (usersData.success && usersData.users) {
          setStaffUsers(usersData.users)
        }
      } catch (uErr) {
        console.error('Failed to fetch staff users', uErr)
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      if (!isSilent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(false)
      // Auto refresh every 10 seconds silently
      const timer = setInterval(() => {
        fetchData(true)
      }, 10000)
      return () => clearInterval(timer)
    }
  }, [isAuthenticated, fetchData])

  const handleDeleteVisitorLog = async (id?: number) => {
    if (!id) return
    if (!confirm('Are you sure you want to delete this visitor log?')) return
    try {
      const res = await fetch(`/api/visitors?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setVisitorLogs((prev) => prev.filter((l) => l.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete visitor log:', err)
    }
  }

  // Center Master Handlers
  function openAddCenterModal() {
    setEditingCenter(null)
    setCenterForm({
      name: '',
      area: '',
      timings: 'Mon - Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM',
      tag: 'Primary Center (Director & Head)',
      isDefault: false,
      isActive: true,
    })
    setCenterFormError('')
    setCenterModalOpen(true)
  }

  function openEditCenterModal(c: HospitalCenter) {
    setEditingCenter(c)
    setCenterForm({
      name: c.name,
      area: c.area,
      timings: c.timings || '',
      tag: c.tag || '',
      isDefault: Boolean(c.isDefault),
      isActive: c.isActive,
    })
    setCenterFormError('')
    setCenterModalOpen(true)
  }

  async function handleSaveCenterForm(e: React.FormEvent) {
    e.preventDefault()
    if (!centerForm.name.trim() || !centerForm.area.trim()) {
      setCenterFormError('Hospital Center Name and Address/Area are required.')
      return
    }

    setCenterFormLoading(true)
    setCenterFormError('')

    try {
      if (editingCenter) {
        const res = await fetch('/api/centers', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCenter.id,
            ...centerForm,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setCenters(data.centers)
          setCenterModalOpen(false)
        } else {
          setCenterFormError(data.error || 'Failed to update center')
        }
      } else {
        const res = await fetch('/api/centers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(centerForm),
        })
        const data = await res.json()
        if (data.success) {
          setCenters(data.centers)
          setCenterModalOpen(false)
        } else {
          setCenterFormError(data.error || 'Failed to add center')
        }
      }
    } catch {
      setCenterFormError('Network connection error. Please try again.')
    } finally {
      setCenterFormLoading(false)
    }
  }

  async function handleToggleCenterStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/centers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setCenters(data.centers)
      }
    } catch (err) {
      console.error('Failed to toggle center status', err)
    }
  }

  async function handleDeleteCenter(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}" from hospital centers master?`)) return
    try {
      const res = await fetch(`/api/centers?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setCenters(data.centers)
      }
    } catch (err) {
      console.error('Failed to delete center', err)
    }
  }

  // ENT Concern Master Handlers
  function openAddConcernModal() {
    setEditingConcern(null)
    setConcernForm({
      title: '',
      category: 'Nose & Sinus (Rhinology)',
      description: '',
      commonSymptoms: '',
      isDefault: false,
      isActive: true,
      sortOrder: concerns.length + 1,
    })
    setConcernFormError('')
    setConcernModalOpen(true)
  }

  function openEditConcernModal(c: ENTConcern) {
    setEditingConcern(c)
    setConcernForm({
      title: c.title,
      category: c.category,
      description: c.description || '',
      commonSymptoms: c.commonSymptoms || '',
      isDefault: Boolean(c.isDefault),
      isActive: c.isActive,
      sortOrder: c.sortOrder || 0,
    })
    setConcernFormError('')
    setConcernModalOpen(true)
  }

  async function handleSaveConcernForm(e: React.FormEvent) {
    e.preventDefault()
    if (!concernForm.title.trim() || !concernForm.category.trim()) {
      setConcernFormError('ENT Concern Title and Category are required.')
      return
    }

    setConcernFormLoading(true)
    setConcernFormError('')

    try {
      if (editingConcern) {
        const res = await fetch('/api/concerns', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingConcern.id,
            ...concernForm,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setConcerns(data.concerns)
          setConcernModalOpen(false)
        } else {
          setConcernFormError(data.error || 'Failed to update concern')
        }
      } else {
        const res = await fetch('/api/concerns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(concernForm),
        })
        const data = await res.json()
        if (data.success) {
          setConcerns(data.concerns)
          setConcernModalOpen(false)
        } else {
          setConcernFormError(data.error || 'Failed to add concern')
        }
      }
    } catch {
      setConcernFormError('Network connection error. Please try again.')
    } finally {
      setConcernFormLoading(false)
    }
  }

  async function handleToggleConcernStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/concerns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setConcerns(data.concerns)
      }
    } catch (err) {
      console.error('Failed to toggle concern status', err)
    }
  }

  async function handleDeleteConcern(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}" from ENT concerns master?`)) return
    try {
      const res = await fetch(`/api/concerns?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setConcerns(data.concerns)
      }
    } catch (err) {
      console.error('Failed to delete concern', err)
    }
  }

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        const loggedUser = data.username || username
        const role = data.role === 'super_admin' ? 'super_admin' : 'staff'
        const dName = data.doctorName || (role === 'super_admin' ? 'Dr. Vaidik Chauhan' : 'Clinic Reception Staff')
        sessionStorage.setItem('dr_vaidik_admin_token', data.token)
        sessionStorage.setItem('dr_vaidik_admin_username', loggedUser)
        sessionStorage.setItem('dr_vaidik_admin_role', role)
        sessionStorage.setItem('dr_vaidik_admin_name', dName)
        setCurrentAdminUser(loggedUser)
        setSecNewUsername(loggedUser)
        setUserRole(role)
        setAdminDisplayName(dName)
        localStorage.removeItem('dr_vaidik_admin_token')
        setIsAuthenticated(true)
      } else {
        setAuthError(data.error || 'Invalid username or password')
      }
    } catch {
      setAuthError('Connection error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('dr_vaidik_admin_token')
    sessionStorage.removeItem('dr_vaidik_admin_username')
    sessionStorage.removeItem('dr_vaidik_admin_role')
    sessionStorage.removeItem('dr_vaidik_admin_name')
    localStorage.removeItem('dr_vaidik_admin_token')
    setIsAuthenticated(false)
    setUsername('')
    setPassword('')
  }

  // Handle Admin Change Username / Password (Saved to Database)
  async function handleChangeCredentials(e: React.FormEvent) {
    e.preventDefault()
    setSecError('')
    setSecSuccess('')

    if (!secCurrentPassword) {
      setSecError('Please enter your current password to verify.')
      return
    }

    if (!secNewUsername.trim()) {
      setSecError('Username cannot be empty.')
      return
    }

    if (secNewPassword) {
      if (secNewPassword.length < 4) {
        setSecError('New password must be at least 4 characters long.')
        return
      }
      if (secNewPassword !== secConfirmPassword) {
        setSecError('New passwords do not match. Please verify.')
        return
      }
    }

    setSecLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: currentAdminUser,
          currentPassword: secCurrentPassword,
          newUsername: secNewUsername.trim(),
          newPassword: secNewPassword.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (data.success) {
        const updatedUser = data.username || secNewUsername.trim()
        setCurrentAdminUser(updatedUser)
        setSecNewUsername(updatedUser)
        sessionStorage.setItem('dr_vaidik_admin_username', updatedUser)
        setSecCurrentPassword('')
        setSecNewPassword('')
        setSecConfirmPassword('')
        setSecSuccess(data.message || 'Credentials updated successfully in Database!')
      } else {
        setSecError(data.error || 'Failed to update credentials.')
      }
    } catch {
      setSecError('Network error. Please try again.')
    } finally {
      setSecLoading(false)
    }
  }

  // Fetch Staff Users List
  const fetchStaffUsers = useCallback(async () => {
    setStaffLoading(true)
    try {
      const res = await fetch('/api/auth/users')
      const data = await res.json()
      if (data.success && data.users) {
        setStaffUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to load staff users', err)
    } finally {
      setStaffLoading(false)
    }
  }, [])

  // Staff Modal Open Handlers
  function openAddStaffModal() {
    setEditingStaffUser(null)
    setStaffForm({
      name: '',
      username: '',
      password: '',
      role: 'staff',
    })
    setShowStaffPass(false)
    setStaffFormError('')
    setStaffModalOpen(true)
  }

  function openEditStaffModal(u: AdminUser) {
    setEditingStaffUser(u)
    setStaffForm({
      name: u.name || '',
      username: u.username || '',
      password: '',
      role: u.role || 'staff',
    })
    setShowStaffPass(false)
    setStaffFormError('')
    setStaffModalOpen(true)
  }

  async function handleSaveStaffForm(e: React.FormEvent) {
    e.preventDefault()
    setStaffFormError('')

    if (!staffForm.username.trim()) {
      setStaffFormError('Please enter a username for this staff member.')
      return
    }

    if (!editingStaffUser && !staffForm.password.trim()) {
      setStaffFormError('Please provide an initial password for this new account.')
      return
    }

    if (staffForm.password.trim() && staffForm.password.trim().length < 4) {
      setStaffFormError('Password must be at least 4 characters long.')
      return
    }

    setStaffFormLoading(true)

    try {
      if (editingStaffUser) {
        const res = await fetch('/api/auth/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingStaffUser.id,
            name: staffForm.name.trim() || undefined,
            username: staffForm.username.trim(),
            password: staffForm.password.trim() || undefined,
            role: staffForm.role,
          }),
        })
        const data = await res.json()
        if (data.success) {
          await fetchStaffUsers()
          setStaffModalOpen(false)
        } else {
          setStaffFormError(data.error || 'Failed to update staff user.')
        }
      } else {
        const res = await fetch('/api/auth/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: staffForm.name.trim(),
            username: staffForm.username.trim(),
            password: staffForm.password.trim(),
            role: staffForm.role,
          }),
        })
        const data = await res.json()
        if (data.success) {
          await fetchStaffUsers()
          setStaffModalOpen(false)
        } else {
          setStaffFormError(data.error || 'Failed to create staff user.')
        }
      }
    } catch {
      setStaffFormError('Network error. Please try again.')
    } finally {
      setStaffFormLoading(false)
    }
  }

  function openDeleteStaffModal(u: AdminUser) {
    if (u.username === 'admin' || u.role === 'super_admin' || u.id === '1') {
      alert('The primary Director / Super Admin account cannot be deleted.')
      return
    }
    setDeletingStaffUser(u)
    setDeleteStaffError('')
    setDeleteStaffModalOpen(true)
  }

  async function handleConfirmDeleteStaff() {
    if (!deletingStaffUser) return
    setDeleteStaffLoading(true)
    setDeleteStaffError('')

    try {
      const res = await fetch(`/api/auth/users?id=${deletingStaffUser.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        await fetchStaffUsers()
        setDeleteStaffModalOpen(false)
        setDeletingStaffUser(null)
      } else {
        setDeleteStaffError(data.error || 'Failed to delete staff member.')
      }
    } catch {
      setDeleteStaffError('Network error. Please try again.')
    } finally {
      setDeleteStaffLoading(false)
    }
  }

  // Update Status Handler
  async function handleStatusChange(id: string, newStatus: Appointment['status']) {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
        )
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  // Delete Handler
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete appointment for ${name}?`)) return
    try {
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id))
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to delete appointment', err)
    }
  }

  // WhatsApp Message Generator
  const sendWhatsAppConfirmation = (apt: Appointment) => {
    const bookingId = formatBookingRef(apt)
    const msg = `Dear ${apt.name},

Your ENT Consultation with Dr. Vaidik Chauhan, MS (ENT) is CONFIRMED.

🏷️ Booking ID: #${bookingId}
📅 Date: ${apt.date}
🏥 Hospital: ${apt.location}
🩺 Concern: ${apt.reason}

Hospital Address: Atulya Superspeciality Hospital, 2nd Floor, Elite Mangnum, Bhuyangdev, Ahmedabad.
📞 Clinic Contact: +91 9601074848

Thank you! We look forward to caring for you.`

    const cleanPhone = apt.phone.replace(/[^0-9]/g, '')
    const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  const sendWhatsAppThankYou = (apt: Appointment) => {
    const msg = `Dear ${apt.name},

Thank you for consulting with Dr. Vaidik Chauhan, MS (ENT) at ${apt.location}.

We wish you a smooth and speedy recovery! 

If you have any post-consultation questions or need medicine clarification, feel free to message us at +91 9601074848.

Best regards,
Dr. Vaidik Chauhan & ENT Care Team`

    const cleanPhone = apt.phone.replace(/[^0-9]/g, '')
    const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  // Open Reschedule Modal
  function openRescheduleModal(apt: Appointment) {
    setSelectedAptForReschedule(apt)
    setRescheduleDate(apt.date || new Date().toISOString().split('T')[0])
    setRescheduleLocation(apt.location || 'Atulya Superspeciality Hospital (Bhuyangdev)')
    setRescheduleTime('06:00 PM - 07:30 PM (Evening OPD)')
    setRescheduleReason('Doctor OT Schedule / Alternate Available Slot')
    setRescheduleModalOpen(true)
  }

  // Generate Message text for Reschedule
  function getRescheduleMessageText() {
    if (!selectedAptForReschedule) return ''
    const pName = selectedAptForReschedule.name
    const loc = rescheduleLocation
    const dt = rescheduleDate
    const tm = rescheduleTime

    return `🏥 *Dr. Vaidik Chauhan, MS (ENT) - Appointment Rescheduled*

Dear *${pName}*,

Due to OT schedule / slot availability, your ENT consultation appointment has been rescheduled and confirmed as follows:

📅 *New Date*: ${dt}
⏰ *Time Slot*: ${tm}
🏥 *Hospital*: ${loc}
📍 *Address*: ${loc.includes('Atulya') ? '2nd Floor, Elite Magnum, Bhuyangdev Cross Rd, Sola Rd, Ghatlodiya, Ahmedabad' : 'Ahmedabad'}
🩺 *Doctor*: Dr. Vaidik Chauhan, MS (ENT) - Consultant ENT Surgeon

👉 *Please note*: Kindly arrive 10 minutes prior to your appointment time.
📞 Clinic Helpline / Queries: +91 9601074848

Thank you!`
  }

  // Save Reschedule
  async function handleSaveReschedule(sendWhatsApp: boolean) {
    if (!selectedAptForReschedule || !rescheduleDate) return
    setIsRescheduling(true)

    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAptForReschedule.id,
          date: rescheduleDate,
          location: rescheduleLocation,
          status: 'confirmed',
          notes: `Rescheduled Slot: ${rescheduleTime}. (${rescheduleReason})`,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === selectedAptForReschedule.id
              ? {
                  ...a,
                  date: rescheduleDate,
                  location: rescheduleLocation,
                  status: 'confirmed',
                  notes: `Rescheduled Slot: ${rescheduleTime}. (${rescheduleReason})`,
                }
              : a,
          ),
        )
        setStats(data.stats)

        if (sendWhatsApp) {
          const msg = getRescheduleMessageText()
          const cleanPhone = selectedAptForReschedule.phone.replace(/[^0-9]/g, '')
          const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
          const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`
          window.open(url, '_blank')
        }

        setRescheduleModalOpen(false)
        setSelectedAptForReschedule(null)
      }
    } catch (err) {
      console.error('Failed to reschedule appointment', err)
    } finally {
      setIsRescheduling(false)
    }
  }

  // Custom Messenger Send
  function handleSendCustomMsg(e: React.FormEvent) {
    e.preventDefault()
    if (!msgPatientPhone.trim()) return

    let finalMsg = ''
    if (msgTemplate === 'confirmation') {
      finalMsg = `Dear ${msgPatientName || 'Patient'},

Your ENT Consultation Appointment with Dr. Vaidik Chauhan, MS (ENT) is CONFIRMED.

🏥 Hospital: Atulya Superspeciality Hospital, Bhuyangdev, Ahmedabad
📞 Contact: +91 9601074848

Thank you!`
    } else if (msgTemplate === 'reschedule') {
      finalMsg = `🏥 *Dr. Vaidik Chauhan, MS (ENT) - Appointment Rescheduled*

Dear ${msgPatientName || 'Patient'},

Your ENT consultation appointment has been updated to the following available slot:

📅 New Date: ${msgNewDate || 'Upcoming Slot'}
⏰ Time Slot: ${msgNewTime}
🏥 Hospital: Atulya Superspeciality Hospital, Bhuyangdev, Ahmedabad
📞 Contact: +91 9601074848

Please arrive 10 minutes prior to your time. Thank you!`
    } else if (msgTemplate === 'thankyou') {
      finalMsg = `Dear ${msgPatientName || 'Patient'},

Thank you for visiting Dr. Vaidik Chauhan, MS (ENT). We wish you good health and a quick recovery! 

For any assistance: +91 9601074848.`
    } else if (msgTemplate === 'reminder') {
      finalMsg = `Reminder: Dear ${msgPatientName || 'Patient'}, this is a gentle reminder regarding your ENT Consultation with Dr. Vaidik Chauhan, MS (ENT) scheduled today. Please arrive 10 minutes prior. Contact: +91 9601074848.`
    } else {
      finalMsg = msgCustomText.trim()
    }

    const cleanPhone = msgPatientPhone.replace(/[^0-9]/g, '')
    const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(finalMsg)}`
    window.open(url, '_blank')

    setMsgSuccess(true)
    setTimeout(() => setMsgSuccess(false), 4000)
  }

  // Export to CSV
  function exportCSV() {
    if (appointments.length === 0) return
    const headers = ['Booking ID', 'Sr. No.', 'Patient Name', 'Phone', 'Hospital', 'Concern', 'Date', 'Status', 'Submitted At']
    const rows = appointments.map((a, idx) => [
      `"#${formatBookingRef(a)}"`,
      `"${idx + 1}"`,
      `"${a.name}"`,
      `"${a.phone}"`,
      `"${a.location}"`,
      `"${a.reason}"`,
      `"${a.date}"`,
      `"${a.status}"`,
      `"${new Date(a.createdAt).toLocaleString('en-IN')}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Dr_Vaidik_Chauhan_Appointments_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered appointments
  const filteredAppointments = appointments.filter((a) => {
    const bookingCode = formatBookingRef(a).toLowerCase()
    const matchesSearch =
      searchQuery === '' ||
      bookingCode.includes(searchQuery.toLowerCase()) ||
      String(a.id).includes(searchQuery) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    const matchesHospital =
      hospitalFilter === 'all' || a.location.toLowerCase().includes(hospitalFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesHospital
  })

  // Filtered ENT Concerns
  const filteredConcerns = concerns.filter((c) => {
    const matchesSearch =
      concernSearchQuery === '' ||
      c.title.toLowerCase().includes(concernSearchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(concernSearchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(concernSearchQuery.toLowerCase())) ||
      (c.commonSymptoms && c.commonSymptoms.toLowerCase().includes(concernSearchQuery.toLowerCase()))

    const matchesCategory =
      concernCategoryFilter === 'all' || c.category.toLowerCase() === concernCategoryFilter.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Preset categories for easy selection
  const presetCategories = [
    'Nose & Sinus (Rhinology)',
    'Ear & Hearing (Otology)',
    'Vertigo & Balance',
    'Throat & Voice (Laryngology)',
    'Pediatric ENT',
    'Head & Neck / Skull Base',
    'Sleep & Airway',
    'General ENT & Second Opinion',
  ]

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/95 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/25">
              <Stethoscope className="size-7" />
            </span>
            <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
              Dr. Vaidik Chauhan
            </h1>
            <p className="text-xs text-accent font-semibold">
              ENT Clinic &middot; Admin Management Portal
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter admin passcode to access live visitor stats, appointments &amp; patient messaging.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-user" className="block text-xs font-semibold text-foreground mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="admin-user"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm text-foreground outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-medium text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {authLoading ? 'Signing In...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-3.5 text-accent" />
              <span>Authorized personnel &amp; clinic staff only.</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm">
              <Stethoscope className="size-5" />
            </span>
            <div>
              <h1 className="font-heading text-base sm:text-lg font-bold text-foreground leading-tight">
                {site.doctor.name} &middot; Admin Portal
              </h1>
              <p className="text-[11px] text-accent font-medium">
                Atulya Superspeciality Hospital &amp; ICU &middot; Department of ENT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {userRole === 'super_admin' ? (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                <Crown className="size-3.5 text-amber-500" />
                <span>Super Admin / Director</span>
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <UserCheck className="size-3.5 text-emerald-500" />
                <span>Clinic Receptionist / Staff</span>
              </span>
            )}
            {/* Live Sync 10s Indicator */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Sync (10s)</span>
            </div>

            <button
              type="button"
              onClick={() => fetchData(false)}
              disabled={loading}
              title="Refresh Data Now"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin text-accent' : ''}`} />
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Eye className="size-3.5 text-accent" />
              <span>View Website</span>
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-white"
            >
              <LogOut className="size-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'appointments'
                ? 'bg-accent text-accent-foreground shadow-md shadow-accent/25'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-muted'
            }`}
          >
            <CalendarCheck className="size-4" />
            <span>Patient Appointments ({appointments.length})</span>
          </button>

          {/* Super Admin Only: Preferred Centers Master */}
          {userRole === 'super_admin' && (
            <button
              type="button"
              onClick={() => setActiveTab('centers')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'centers'
                  ? 'bg-accent text-accent-foreground shadow-md shadow-accent/25'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-muted'
              }`}
            >
              <Building2 className="size-4" />
              <span>Preferred Centers Master ({centers.length})</span>
            </button>
          )}

          {/* Super Admin Only: ENT Concerns Master */}
          {userRole === 'super_admin' && (
            <button
              type="button"
              onClick={() => setActiveTab('concerns')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'concerns'
                  ? 'bg-accent text-accent-foreground shadow-md shadow-accent/25'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-muted'
              }`}
            >
              <Activity className="size-4" />
              <span>ENT Concerns Master ({concerns.length})</span>
            </button>
          )}

          {/* Super Admin Only: Live Visitor Logs */}
          {userRole === 'super_admin' && (
            <button
              type="button"
              onClick={() => setActiveTab('visitors')}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'visitors'
                  ? 'bg-accent text-accent-foreground shadow-md shadow-accent/25'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-muted'
              }`}
            >
              <Users className="size-4" />
              <span>Live Visitor Logs ({visitorLogs.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-accent text-accent-foreground shadow-md shadow-accent/25'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-muted'
            }`}
          >
            <ShieldCheck className="size-4" />
            <span>Account &amp; Security</span>
          </button>
        </div>

        {/* TAB 1: PATIENT APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Live Visitors */}
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Visitors
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Users className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                  {stats.visitorsTotal.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-accent font-semibold">
                  <span className="inline-block size-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>+{stats.visitorsToday} visits today</span>
                </div>
              </div>

              {/* Card 2: Total Appointments */}
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Requests
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-foreground">
                    <CalendarCheck className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                  {stats.totalAppointments}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {stats.todayAppointments} requested for today
                </p>
              </div>

              {/* Card 3: Pending Actions */}
              <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Pending Actions
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Clock className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400">
                  {stats.pendingAppointments}
                </p>
                <p className="mt-2 text-xs text-amber-600/80 dark:text-amber-400/80">
                  Awaiting confirmation
                </p>
              </div>

              {/* Card 4: Confirmed Appointments */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Confirmed Slots
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {stats.confirmedAppointments}
                </p>
                <p className="mt-2 text-xs text-emerald-600/80 dark:text-emerald-400/80">
                  Ready for consultation
                </p>
              </div>
            </div>

            {/* Quick WhatsApp Messenger Tool */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                    <MessageCircle className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Quick WhatsApp / SMS Messenger to Patient
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Send instant booking confirmations, follow-up reminders, or thank you notes to any patient mobile number.
                    </p>
                  </div>
                </div>
                {msgSuccess && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 px-3 py-1 text-xs font-bold text-[#25D366] animate-in fade-in">
                    <Check className="size-3.5" /> WhatsApp Opened!
                  </span>
                )}
              </div>

              <form onSubmit={handleSendCustomMsg} className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={msgPatientName}
                    onChange={(e) => setMsgPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={msgPatientPhone}
                    onChange={(e) => setMsgPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Message Template
                  </label>
                  <select
                    value={msgTemplate}
                    onChange={(e) => setMsgTemplate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="confirmation">✅ Appointment Confirmation</option>
                    <option value="reschedule">📅 Slot Reschedule / New Time</option>
                    <option value="thankyou">🙏 Thank You &amp; Recovery Wish</option>
                    <option value="reminder">⏰ Consultation Reminder</option>
                    <option value="custom">✏️ Custom Message</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="size-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>

                {msgTemplate === 'reschedule' && (
                  <div className="sm:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 p-3 rounded-2xl bg-secondary/50 border border-border">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">New Available Date</label>
                      <input
                        type="date"
                        value={msgNewDate}
                        onChange={(e) => setMsgNewDate(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">New Time Slot</label>
                      <select
                        value={msgNewTime}
                        onChange={(e) => setMsgNewTime(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs"
                      >
                        <option value="10:00 AM - 11:30 AM (Morning OPD)">🌅 10:00 AM - 11:30 AM (Morning OPD)</option>
                        <option value="11:30 AM - 01:00 PM (Morning OPD)">🌅 11:30 AM - 01:00 PM (Morning OPD)</option>
                        <option value="05:00 PM - 06:30 PM (Evening OPD)">🌇 05:00 PM - 06:30 PM (Evening OPD)</option>
                        <option value="06:30 PM - 08:00 PM (Evening OPD)">🌆 06:30 PM - 08:00 PM (Evening OPD)</option>
                      </select>
                    </div>
                  </div>
                )}

                {msgTemplate === 'custom' && (
                  <div className="sm:col-span-4 mt-1">
                    <textarea
                      rows={2}
                      required
                      value={msgCustomText}
                      onChange={(e) => setMsgCustomText(e.target.value)}
                      placeholder="Type your custom message for the patient here..."
                      className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                )}
              </form>
            </div>

            {/* Appointments Table Section */}
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Table Controls */}
              <div className="p-5 sm:p-6 border-b border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Patient Appointments &amp; Consultations ({filteredAppointments.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Manage patient requests, change status, suggest new slots, and send 1-click WhatsApp confirmation.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={exportCSV}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-sm"
                    >
                      <Download className="size-3.5 text-accent" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Filters bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, mobile, concern..."
                      className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="all">All Statuses ({appointments.length})</option>
                      <option value="pending">🟡 Pending Actions ({stats.pendingAppointments})</option>
                      <option value="confirmed">🟢 Confirmed ({stats.confirmedAppointments})</option>
                      <option value="completed">🔵 Completed</option>
                      <option value="cancelled">🔴 Cancelled</option>
                    </select>
                  </div>

                  {/* Hospital Filter */}
                  <div>
                    <select
                      value={hospitalFilter}
                      onChange={(e) => setHospitalFilter(e.target.value)}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="all">All Hospital Centers</option>
                      {centers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                {filteredAppointments.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <CalendarCheck className="size-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="font-heading text-base font-bold text-foreground">No appointments found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or filters.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                      <tr>
                        <th className="px-4 py-3.5 font-bold whitespace-nowrap">Booking ID</th>
                        <th className="px-5 py-3.5 font-bold">Patient Details</th>
                        <th className="px-5 py-3.5 font-bold">Hospital &amp; Concern</th>
                        <th className="px-5 py-3.5 font-bold">Appointment Date</th>
                        <th className="px-5 py-3.5 font-bold">Status</th>
                        <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-muted/40 transition-colors">
                          {/* Booking Reference ID */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-accent/10 border border-accent/25 px-2.5 py-1 font-mono text-xs font-bold text-accent">
                              #{formatBookingRef(apt)}
                            </span>
                          </td>

                          {/* Patient */}
                          <td className="px-5 py-4">
                            <div className="font-bold text-sm text-foreground">
                              {apt.name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
                              <Phone className="size-3 text-accent" />
                              <a href={`tel:${apt.phone}`} className="hover:underline text-foreground">
                                {apt.phone}
                              </a>
                            </div>
                            <div className="text-[10px] text-muted-foreground/70 mt-1">
                              Booked: {new Date(apt.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                            </div>
                          </td>

                          {/* Hospital & Concern */}
                          <td className="px-5 py-4 max-w-xs">
                            <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                              {apt.location.split('(')[0].trim()}
                            </span>
                            <div className="mt-1 font-medium text-foreground text-xs line-clamp-2">
                              {apt.reason || 'General ENT'}
                            </div>
                            {apt.notes && (
                              <div className="mt-1 text-[11px] text-muted-foreground italic">
                                Note: {apt.notes}
                              </div>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="font-semibold text-foreground">
                              {apt.date || 'Earliest'}
                            </div>
                            {apt.notes && apt.notes.includes('Rescheduled') && (
                              <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md w-fit">
                                <Clock className="size-2.5 shrink-0" />
                                <span>{apt.notes.replace('Rescheduled Slot:', '').split('(')[0].trim()}</span>
                              </div>
                            )}
                          </td>

                          {/* Status Dropdown */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value as Appointment['status'])}
                              className={`rounded-full px-3 py-1 font-bold text-xs border outline-none cursor-pointer transition-colors ${
                                apt.status === 'confirmed'
                                  ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                                  : apt.status === 'pending'
                                  ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                                  : apt.status === 'completed'
                                  ? 'bg-blue-500/15 text-blue-600 border-blue-500/30'
                                  : 'bg-destructive/15 text-destructive border-destructive/30'
                              }`}
                            >
                              <option value="pending">🟡 Pending</option>
                              <option value="confirmed">🟢 Confirmed</option>
                              <option value="completed">🔵 Completed</option>
                              <option value="cancelled">🔴 Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Reschedule Slot / Change Date & Time */}
                              <button
                                type="button"
                                onClick={() => openRescheduleModal(apt)}
                                title="Reschedule / Change Date & Time (WhatsApp)"
                                className="inline-flex size-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
                              >
                                <Calendar className="size-3.5" />
                              </button>

                              {/* Send WhatsApp Confirmation */}
                              <button
                                type="button"
                                onClick={() => sendWhatsAppConfirmation(apt)}
                                title="Send Direct WhatsApp Confirmation"
                                className="inline-flex size-8 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                              >
                                <MessageCircle className="size-4" />
                              </button>

                              {/* Send WhatsApp Thank You */}
                              <button
                                type="button"
                                onClick={() => sendWhatsAppThankYou(apt)}
                                title="Send Thank You & Recovery Wish"
                                className="inline-flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                              >
                                <Send className="size-3.5" />
                              </button>

                              {/* Call Patient */}
                              <a
                                href={`tel:${apt.phone}`}
                                title="Call Patient"
                                className="inline-flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
                              >
                                <Phone className="size-3.5" />
                              </a>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDelete(apt.id, apt.name)}
                                title="Delete Request"
                                className="inline-flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PREFERRED HOSPITAL CENTERS MASTER */}
        {activeTab === 'centers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
                  <Building2 className="size-6" />
                </span>
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    Preferred Consultation Centers Master
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add, edit, or disable hospital locations and OPD consultation hours. Changes will instantly update on the website booking form.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openAddCenterModal}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="size-4" />
                <span>Add New Center</span>
              </button>
            </div>

            {/* Centers Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {centers.map((c) => (
                <div
                  key={c.id}
                  className={`relative rounded-3xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
                    c.isActive
                      ? 'border-border bg-card hover:border-accent/40'
                      : 'border-dashed border-border/70 bg-muted/30 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        c.isDefault
                          ? 'bg-accent/15 text-accent border border-accent/25'
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        {c.tag || (c.isDefault ? 'Primary Hospital' : 'Visiting Center')}
                      </span>

                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        c.isActive ? 'bg-emerald-500/15 text-emerald-600' : 'bg-destructive/15 text-destructive'
                      }`}>
                        <span className={`size-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-destructive'}`} />
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-foreground leading-snug">
                      {c.name}
                    </h3>

                    <div className="mt-3.5 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="size-4 shrink-0 text-accent mt-0.5" />
                        <span className="leading-relaxed text-foreground/80">{c.area}</span>
                      </div>

                      {c.timings && (
                        <div className="flex items-start gap-2">
                          <Clock className="size-4 shrink-0 text-accent mt-0.5" />
                          <span>{c.timings}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCenterStatus(c.id, c.isActive)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
                        c.isActive
                          ? 'bg-secondary text-foreground hover:bg-muted'
                          : 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25'
                      }`}
                    >
                      <Power className="size-3.5" />
                      <span>{c.isActive ? 'Deactivate' : 'Activate'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditCenterModal(c)}
                        className="inline-flex size-9 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-muted transition-colors"
                        title="Edit Center Details"
                      >
                        <Edit3 className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCenter(c.id, c.name)}
                        className="inline-flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                        title="Delete Center"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ENT CONCERNS MASTER */}
        {activeTab === 'concerns' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3.5">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
                  <Activity className="size-6" />
                </span>
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    ENT Concerns &amp; Clinical Conditions Master
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure clinical conditions, symptoms, and surgical procedures. Active concerns will automatically populate on the website booking form.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openAddConcernModal}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="size-4" />
                <span>Add New Concern</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Box */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={concernSearchQuery}
                    onChange={(e) => setConcernSearchQuery(e.target.value)}
                    placeholder="Search by condition name, symptoms, surgical notes..."
                    className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Clear search if any */}
                {concernSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setConcernSearchQuery('')}
                    className="h-10 rounded-xl border border-border px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  type="button"
                  onClick={() => setConcernCategoryFilter('all')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                    concernCategoryFilter === 'all'
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  All ({concerns.length})
                </button>

                {presetCategories.map((cat) => {
                  const count = concerns.filter((c) => c.category.toLowerCase() === cat.toLowerCase()).length
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setConcernCategoryFilter(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                        concernCategoryFilter.toLowerCase() === cat.toLowerCase()
                          ? 'bg-accent text-accent-foreground shadow-sm'
                          : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {cat.split('(')[0].trim()} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Concerns Cards Grid */}
            {filteredConcerns.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center text-muted-foreground">
                <Activity className="size-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-heading text-base font-bold text-foreground">No ENT concerns found</p>
                <p className="text-xs mt-1">Try adjusting your search query or category filter, or click Add New Concern.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredConcerns.map((c) => (
                  <div
                    key={c.id}
                    className={`relative rounded-3xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
                      c.isActive
                        ? 'border-border bg-card hover:border-accent/40'
                        : 'border-dashed border-border/70 bg-muted/30 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                            <Tag className="size-2.5" />
                            {c.category}
                          </span>

                          {c.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                              <Sparkles className="size-2.5" />
                              Default
                            </span>
                          )}
                        </div>

                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          c.isActive ? 'bg-emerald-500/15 text-emerald-600' : 'bg-destructive/15 text-destructive'
                        }`}>
                          <span className={`size-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-destructive'}`} />
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Concern Title */}
                      <h3 className="font-heading text-base font-bold text-foreground leading-snug">
                        {c.title}
                      </h3>

                      {/* Description / Surgical Notes */}
                      {c.description && (
                        <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {c.description}
                        </p>
                      )}

                      {/* Common Symptoms Chips */}
                      {c.commonSymptoms && (
                        <div className="mt-3.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                            Key Symptoms:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {c.commonSymptoms.split(',').map((symptom, idx) => (
                              <span
                                key={idx}
                                className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                              >
                                {symptom.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleConcernStatus(c.id, c.isActive)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
                          c.isActive
                            ? 'bg-secondary text-foreground hover:bg-muted'
                            : 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25'
                        }`}
                      >
                        <Power className="size-3.5" />
                        <span>{c.isActive ? 'Deactivate' : 'Activate'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditConcernModal(c)}
                          className="inline-flex size-9 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-muted transition-colors"
                          title="Edit Concern Details"
                        >
                          <Edit3 className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteConcern(c.id, c.title)}
                          className="inline-flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                          title="Delete Concern"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: VISITOR LOGS (IP & PATH TRACKING) */}
        {activeTab === 'visitors' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Stats Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                  Live Visitor Access Logs &amp; IP Tracking
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time dynamic logs recording every site visit, client IP address, URL path, and timestamp.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-xs font-bold text-accent-foreground shadow-md shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
              >
                <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Live Logs</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Site Hits</p>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">{stats.visitorsTotal.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Today's Visits</p>
                <p className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+{stats.visitorsToday}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Recent Logged Hits</p>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">{visitorLogs.length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Database Engine</p>
                <p className="text-xs font-bold text-accent mt-2 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#25D366] animate-pulse" />
                  {stats.databaseSource}
                </p>
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter logs by IP Address, Path, or Device..."
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-input bg-card pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              {visitorSearch && (
                <button
                  type="button"
                  onClick={() => setVisitorSearch('')}
                  className="h-11 rounded-2xl border border-border px-4 text-xs font-bold text-foreground hover:bg-muted"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Visitor Logs Table */}
            {visitorLogs.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center text-muted-foreground">
                <Users className="size-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-heading text-base font-bold text-foreground">No Visitor Logs Yet</p>
                <p className="text-xs mt-1">Logs will appear automatically whenever visitors access the website.</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50 font-bold text-muted-foreground">
                        <th className="py-3.5 px-4 w-16">Sr. No.</th>
                        <th className="py-3.5 px-4">Client IP Address</th>
                        <th className="py-3.5 px-4">Visited Path</th>
                        <th className="py-3.5 px-4">Visited Timestamp</th>
                        <th className="py-3.5 px-4">Device / User Agent</th>
                        <th className="py-3.5 px-4 text-center w-14">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {visitorLogs
                        .filter((log) => {
                          // Ignore /admin and /api visits
                          if (log.path?.toLowerCase().includes('/admin') || log.path?.toLowerCase().startsWith('/api')) {
                            return false
                          }
                          if (!visitorSearch.trim()) return true
                          const q = visitorSearch.toLowerCase()
                          return (
                            log.ip?.toLowerCase().includes(q) ||
                            log.path?.toLowerCase().includes(q) ||
                            log.userAgent?.toLowerCase().includes(q) ||
                            log.date?.includes(q)
                          )
                        })
                        .map((log, index) => {
                          const isHome = !log.path || log.path === '/' || log.path === 'https://drvaidikent.com/' || log.path === 'https://drvaidikent.com'
                          const targetHref = isHome ? 'https://drvaidikent.com' : log.path.startsWith('http') ? log.path : `https://drvaidikent.com${log.path}`
                          const displayPath = isHome ? 'https://drvaidikent.com/' : log.path.startsWith('http') ? log.path : `https://drvaidikent.com${log.path}`

                          return (
                            <tr key={log.id || index} className="hover:bg-muted/40 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                                {index + 1}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/25 px-3 py-1 font-mono text-[11px] font-bold text-accent">
                                  <Globe className="size-3" />
                                  {log.ip || '127.0.0.1'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 max-w-[280px]">
                                <a
                                  href={targetHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-secondary hover:bg-muted/80 px-2.5 py-1 font-mono text-[11px] font-bold text-foreground max-w-full truncate transition-colors"
                                  title={displayPath}
                                >
                                  <Compass className="size-3 text-muted-foreground shrink-0" />
                                  <span className="truncate">{displayPath}</span>
                                  {isHome && (
                                    <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold text-accent uppercase shrink-0">
                                      Home
                                    </span>
                                  )}
                                </a>
                              </td>
                              <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  <Clock className="size-3.5 text-accent shrink-0" />
                                  <span>
                                    {log.visitedAt
                                      ? new Date(log.visitedAt).toLocaleString('en-IN', {
                                          dateStyle: 'medium',
                                          timeStyle: 'medium',
                                        })
                                      : log.date || 'Today'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 max-w-xs text-muted-foreground" title={log.userAgent || 'Direct Browser'}>
                                {(() => {
                                  const info = parseUserAgentInfo(log.userAgent)
                                  return (
                                    <div className="flex items-center gap-1.5">
                                      {info.device === 'mobile' ? (
                                        <Smartphone className="size-3.5 shrink-0 text-amber-500" />
                                      ) : info.device === 'tablet' ? (
                                        <Tablet className="size-3.5 shrink-0 text-indigo-500" />
                                      ) : (
                                        <Laptop className="size-3.5 shrink-0 text-cyan-500" />
                                      )}
                                      <span className="truncate text-xs font-medium text-foreground">
                                        {info.label}
                                      </span>
                                    </div>
                                  )
                                })()}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVisitorLog(log.id)}
                                  title="Delete this log"
                                  className="inline-flex items-center justify-center size-7 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACCOUNT & SECURITY SETTINGS */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header Description */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
                    <ShieldCheck className="size-6" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                      Admin Account &amp; Security Settings
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Direct Database Authentication (PostgreSQL / Supabase). Change your Admin Username or Password safely.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="size-2 rounded-full bg-[#25D366] animate-pulse" />
                    Active User: {currentAdminUser}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Account Details Info Card */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5 h-fit">
                <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                  <User className="size-4 text-accent" />
                  <span>Profile Overview</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="rounded-2xl bg-secondary/50 p-4 border border-border/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Account Name</p>
                    <p className="font-heading text-sm font-bold text-foreground mt-1">
                      {userRole === 'super_admin' ? 'Dr. Vaidik Chauhan' : 'Clinic Reception Staff'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {userRole === 'super_admin' ? 'MS (ENT) - Head & Neck Surgeon' : 'Front Desk & Patient Coordination'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-secondary/50 p-4 border border-border/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Assigned Role</p>
                    <p className="text-xs font-bold mt-1 flex items-center gap-1.5">
                      {userRole === 'super_admin' ? (
                        <>
                          <Crown className="size-3.5 text-amber-500 shrink-0" />
                          <span className="text-amber-600 dark:text-amber-400">Super Admin / Director (Full Control)</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="size-3.5 text-emerald-500 shrink-0" />
                          <span className="text-emerald-600 dark:text-emerald-400">Clinic Receptionist / Staff (OPD Management)</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-amber-700 dark:text-amber-300 text-xs">
                  <p className="font-semibold flex items-center gap-1.5 mb-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>Security Tip</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Choose a strong password containing letters, numbers, and special characters. Your new credentials will update immediately in the PostgreSQL/Supabase database.
                  </p>
                </div>
              </div>

              {/* Right 2 Columns: Credentials Update Form */}
              <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2 mb-1">
                  <KeyRound className="size-4 text-accent" />
                  <span>Change Username &amp; Password</span>
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Enter your current password for verification, then enter your new username or new password.
                </p>

                {secError && (
                  <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive animate-in fade-in">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{secError}</span>
                  </div>
                )}

                {secSuccess && (
                  <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                    <Check className="size-4 shrink-0" />
                    <span>{secSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangeCredentials} className="space-y-5">
                  {/* Field 1: Current Password (Verification) */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Current Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type={secShowCurrentPass ? 'text' : 'password'}
                        required
                        value={secCurrentPassword}
                        onChange={(e) => setSecCurrentPassword(e.target.value)}
                        placeholder="Enter your current active password"
                        className="h-11 w-full rounded-2xl border border-input bg-background pl-10 pr-11 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={() => setSecShowCurrentPass(!secShowCurrentPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {secShowCurrentPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                    {/* Field 2: New Username */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Admin Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          value={secNewUsername}
                          onChange={(e) => setSecNewUsername(e.target.value)}
                          placeholder="e.g. admin or drvaidik"
                          className="h-11 w-full rounded-2xl border border-input bg-background pl-10 pr-4 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    </div>

                    {/* Field 3: New Password */}
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        New Password (Leave blank to keep current)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type={secShowNewPass ? 'text' : 'password'}
                          value={secNewPassword}
                          onChange={(e) => setSecNewPassword(e.target.value)}
                          placeholder="Enter new strong password"
                          className="h-11 w-full rounded-2xl border border-input bg-background pl-10 pr-11 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <button
                          type="button"
                          onClick={() => setSecShowNewPass(!secShowNewPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {secShowNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Field 4: Confirm New Password */}
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type={secShowNewPass ? 'text' : 'password'}
                          value={secConfirmPassword}
                          onChange={(e) => setSecConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="h-11 w-full rounded-2xl border border-input bg-background pl-10 pr-4 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                    <div className="pt-3">
                    <button
                      type="submit"
                      disabled={secLoading}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-xs font-bold text-accent-foreground shadow-md shadow-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      {secLoading ? (
                        <>
                          <RefreshCw className="size-4 animate-spin" />
                          <span>Saving to Database...</span>
                        </>
                      ) : (
                        <>
                          <Check className="size-4" />
                          <span>Update Credentials in Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* SUPER ADMIN ONLY: MULTIPLE STAFF ACCOUNTS MANAGEMENT */}
            {userRole === 'super_admin' && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
                      <Users className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        Clinic Staff &amp; Receptionist User Accounts Master
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Provisional Control: Create multiple staff accounts, assign roles, reset staff passwords, and manage clinic front desk permissions.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openAddStaffModal}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="size-4" />
                    <span>Add New Staff Account</span>
                  </button>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={staffSearchQuery}
                      onChange={(e) => setStaffSearchQuery(e.target.value)}
                      placeholder="Search by staff name or username..."
                      className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-bold text-foreground">
                      <UserCheck className="size-3.5 text-accent" />
                      <span>{staffUsers.length} Registered Accounts</span>
                    </span>
                    <button
                      type="button"
                      onClick={fetchStaffUsers}
                      disabled={staffLoading}
                      title="Refresh Staff List"
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className={`size-3.5 ${staffLoading ? 'animate-spin text-accent' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Staff Table */}
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3.5 w-16">Sr. No.</th>
                        <th className="px-4 py-3.5">Staff User &amp; Name</th>
                        <th className="px-4 py-3.5">Login Username</th>
                        <th className="px-4 py-3.5">Assigned Role &amp; Access</th>
                        <th className="px-4 py-3.5">Created Date</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {staffUsers
                        .filter(
                          (u) =>
                            !staffSearchQuery.trim() ||
                            u.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                            u.username.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                            u.role.toLowerCase().includes(staffSearchQuery.toLowerCase()),
                        )
                        .map((u, index) => {
                          const isPrimaryAdmin = u.username === 'admin' || u.id === '1'
                          const isSuperAdminRole = u.role === 'super_admin' || u.username === 'admin'

                          return (
                            <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3.5 font-mono font-bold text-foreground">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`inline-flex size-9 items-center justify-center rounded-xl font-bold text-xs ${
                                      isSuperAdminRole
                                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    }`}
                                  >
                                    {isSuperAdminRole ? <Crown className="size-4.5" /> : <User className="size-4.5" />}
                                  </span>
                                  <div>
                                    <p className="font-bold text-foreground">{u.name}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {isPrimaryAdmin ? 'Primary Director Account' : 'Front Desk Reception Staff'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-foreground border border-border/60">
                                  <KeyRound className="size-3 text-accent" />
                                  <span>{u.username}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                {isSuperAdminRole ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                    <Crown className="size-3 text-amber-500" />
                                    <span>Super Admin / Director</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                    <UserCheck className="size-3 text-emerald-500" />
                                    <span>Clinic Receptionist / Staff</span>
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3.5 text-muted-foreground">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }) : 'System Default'}
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditStaffModal(u)}
                                    title="Edit Details / Reset Password"
                                    className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
                                  >
                                    <Edit3 className="size-3.5 text-accent" />
                                    <span>Edit</span>
                                  </button>

                                  {!isPrimaryAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => openDeleteStaffModal(u)}
                                      title="Delete Staff Account"
                                      className="inline-flex size-8 items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* RESCHEDULE DATE & TIME MODAL (PORTAL) */}
      {/* ========================================================================= */}
      {mounted && rescheduleModalOpen && selectedAptForReschedule && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-secondary/30">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <Calendar className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    Reschedule Appointment Date &amp; Time
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Patient: <strong className="text-foreground">{selectedAptForReschedule.name}</strong> &middot; {selectedAptForReschedule.phone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Requested vs New */}
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3 text-amber-700 dark:text-amber-300">
                <p className="font-semibold">⚠️ Patient Original Request:</p>
                <p className="mt-0.5 text-[11px]">
                  Date: <strong>{selectedAptForReschedule.date || 'Earliest'}</strong> &middot; Concern: {selectedAptForReschedule.reason}
                </p>
              </div>

              {/* Grid: New Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* New Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Select Available Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Time Slot Picker */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Select OPD Time Slot *
                  </label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="10:00 AM - 11:30 AM (Morning OPD)">🌅 10:00 AM - 11:30 AM (Morning OPD)</option>
                    <option value="11:30 AM - 01:00 PM (Morning OPD)">🌅 11:30 AM - 01:00 PM (Morning OPD)</option>
                    <option value="01:00 PM - 02:00 PM (Afternoon OPD)">☀️ 01:00 PM - 02:00 PM (Afternoon OPD)</option>
                    <option value="05:00 PM - 06:30 PM (Evening OPD)">🌇 05:00 PM - 06:30 PM (Evening OPD)</option>
                    <option value="06:30 PM - 08:00 PM (Evening OPD)">🌆 06:30 PM - 08:00 PM (Evening OPD)</option>
                    <option value="08:00 PM - 09:30 PM (Night OPD)">🌙 08:00 PM - 09:30 PM (Night OPD)</option>
                  </select>
                </div>
              </div>

              {/* Hospital Location */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Hospital Location
                </label>
                <select
                  value={rescheduleLocation}
                  onChange={(e) => setRescheduleLocation(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {centers.filter((c) => c.isActive).map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason / Internal Note */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Reschedule Reason / Internal Note
                </label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Doctor in emergency OT / Date not available"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Live WhatsApp Preview Card */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  Live Message Preview (Patient will receive this):
                </label>
                <div className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-4 font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap">
                  {getRescheduleMessageText()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 border-t border-border p-4 bg-secondary/30">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="h-11 w-full sm:w-auto rounded-xl border border-border px-5 text-xs font-bold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRescheduling}
                onClick={() => handleSaveReschedule(false)}
                className="h-11 w-full sm:w-auto rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground hover:bg-muted shadow-sm"
              >
                Update Database Only
              </button>
              <button
                type="button"
                disabled={isRescheduling}
                onClick={() => handleSaveReschedule(true)}
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="size-4" />
                <span>Save &amp; Send on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT PREFERRED CENTER MASTER MODAL (PORTAL) */}
      {/* ========================================================================= */}
      {mounted && centerModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-secondary/30">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {editingCenter ? 'Edit Hospital Center' : 'Add New Hospital Center'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure preferred consultation location and OPD timings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCenterModalOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCenterForm} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
                {centerFormError && (
                  <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{centerFormError}</span>
                  </div>
                )}

                {/* Center Name */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Hospital / Clinic Center Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={centerForm.name}
                    onChange={(e) => setCenterForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Atulya Superspeciality Hospital (Bhuyangdev)"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Area / Full Address */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Area / Full Address / Landmark *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={centerForm.area}
                    onChange={(e) => setCenterForm((prev) => ({ ...prev, area: e.target.value }))}
                    placeholder="e.g. 2nd Floor, Elite Magnum, Bhuyangdev Cross Road, Sola Road, Ghatlodiya, Ahmedabad"
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* OPD Timings */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    OPD Consultation Timings
                  </label>
                  <input
                    type="text"
                    value={centerForm.timings}
                    onChange={(e) => setCenterForm((prev) => ({ ...prev, timings: e.target.value }))}
                    placeholder="e.g. Mon - Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Badge Tag */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Badge Tag / Role
                  </label>
                  <input
                    type="text"
                    value={centerForm.tag}
                    onChange={(e) => setCenterForm((prev) => ({ ...prev, tag: e.target.value }))}
                    placeholder="e.g. Primary Center (Director & Head) or Visiting Consultant"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Options: Default & Active */}
                <div className="pt-2 border-t border-border space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={centerForm.isDefault}
                      onChange={(e) => setCenterForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      className="size-4 rounded accent-accent"
                    />
                    <span className="font-bold text-foreground">Set as Primary / Default Selected Hospital</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={centerForm.isActive}
                      onChange={(e) => setCenterForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="size-4 rounded accent-accent"
                    />
                    <span className="font-bold text-foreground">Active &amp; Available for Online Appointment Booking</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 border-t border-border p-4 bg-secondary/30">
                <button
                  type="button"
                  onClick={() => setCenterModalOpen(false)}
                  className="h-11 rounded-xl border border-border px-5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={centerFormLoading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xs font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  <Check className="size-4" />
                  <span>{centerFormLoading ? 'Saving Center...' : editingCenter ? 'Update Center' : 'Save New Center'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT ENT CONCERN MASTER MODAL (PORTAL) */}
      {/* ========================================================================= */}
      {mounted && concernModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-secondary/30">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Activity className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {editingConcern ? 'Edit ENT Concern / Condition' : 'Add New ENT Concern / Condition'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure clinical condition title, category, surgical notes, and patient symptoms.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConcernModalOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveConcernForm} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
                {concernFormError && (
                  <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{concernFormError}</span>
                  </div>
                )}

                {/* Concern Title */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    ENT Concern Title / Condition Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={concernForm.title}
                    onChange={(e) => setConcernForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Sinusitis, Nasal Polyps & Blockage (FESS / Septoplasty)"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Specialty / Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Specialty / Department Category *
                    </label>
                    <select
                      value={concernForm.category}
                      onChange={(e) => setConcernForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {presetCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Custom Category">Custom / Other Category</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Display Sort Order
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={concernForm.sortOrder}
                      onChange={(e) => setConcernForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      placeholder="e.g. 1"
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* Description & Surgical Procedures */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Clinical Description / Surgical Interventions
                  </label>
                  <textarea
                    rows={3}
                    value={concernForm.description}
                    onChange={(e) => setConcernForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g. Deviated Nasal Septum (DNS), Functional Endoscopic Sinus Surgery (FESS), Turbinate Reduction, Polyp Clearance."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Common Symptoms */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Common Symptoms (comma-separated tags)
                  </label>
                  <input
                    type="text"
                    value={concernForm.commonSymptoms}
                    onChange={(e) => setConcernForm((prev) => ({ ...prev, commonSymptoms: e.target.value }))}
                    placeholder="e.g. Nasal Blockage, Facial Heaviness, Headache, Loss of Smell"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Separate multiple symptoms with commas to display them as individual badges.
                  </p>
                </div>

                {/* Options: Default & Active */}
                <div className="pt-2 border-t border-border space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={concernForm.isDefault}
                      onChange={(e) => setConcernForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      className="size-4 rounded accent-accent"
                    />
                    <span className="font-bold text-foreground">Set as Primary / Default Selected Concern</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={concernForm.isActive}
                      onChange={(e) => setConcernForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="size-4 rounded accent-accent"
                    />
                    <span className="font-bold text-foreground">Active &amp; Available for Online Appointment Booking</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 border-t border-border p-4 bg-secondary/30">
                <button
                  type="button"
                  onClick={() => setConcernModalOpen(false)}
                  className="h-11 rounded-xl border border-border px-5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={concernFormLoading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xs font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  <Check className="size-4" />
                  <span>{concernFormLoading ? 'Saving Concern...' : editingConcern ? 'Update Concern' : 'Save New Concern'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT STAFF USER MODAL (PORTAL) */}
      {/* ========================================================================= */}
      {mounted && staffModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-secondary/30">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <UserPlus className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {editingStaffUser ? 'Edit Staff Account & Reset Password' : 'Add New Clinic Staff Account'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {editingStaffUser
                      ? 'Update staff name, username, assigned role, or set a new password.'
                      : 'Create new login credentials for receptionists or OPD front-desk staff.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStaffModalOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStaffForm} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
                {staffFormError && (
                  <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive animate-in fade-in">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{staffFormError}</span>
                  </div>
                )}

                {/* Staff Member Name */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Staff Member Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={staffForm.name}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Pooja Patel (Reception Front Desk)"
                      className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* Login Username */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Login Username *
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={staffForm.username}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="e.g. reception_morning or staff_bhuyangdev"
                      className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    This username will be used by the staff member to log into the Admin Portal.
                  </p>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {editingStaffUser ? 'Reset Password (Leave blank to keep unchanged)' : 'Login Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type={showStaffPass ? 'text' : 'password'}
                      required={!editingStaffUser}
                      value={staffForm.password}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder={editingStaffUser ? 'Enter new password only if changing' : 'Enter strong password (min 4 characters)'}
                      className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPass(!showStaffPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showStaffPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Assigned Role &amp; Permission Level *
                  </label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-ring font-medium"
                  >
                    <option value="staff">👤 Clinic Receptionist / Staff (OPD Appointments &amp; WhatsApp Messenger)</option>
                    <option value="super_admin">👑 Super Admin / Director (Full Access to Master Tables &amp; Staff)</option>
                  </select>
                </div>

                <div className="rounded-2xl bg-secondary/50 p-3.5 border border-border/60 text-[11px] text-muted-foreground space-y-1">
                  <p className="font-bold text-foreground">Role Permissions Summary:</p>
                  <p>• <strong>Staff</strong>: Can view/reschedule patient appointments &amp; send WhatsApp updates.</p>
                  <p>• <strong>Super Admin</strong>: Has full access to Centers Master, ENT Concerns Master, Visitor Logs, and Staff Accounts.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 border-t border-border p-4 bg-secondary/30">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="h-11 rounded-xl border border-border px-5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffFormLoading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xs font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  <Check className="size-4" />
                  <span>{staffFormLoading ? 'Saving Staff Account...' : editingStaffUser ? 'Update Staff Account' : 'Create Staff User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* DELETE STAFF USER CONFIRMATION MODAL (PORTAL) */}
      {/* ========================================================================= */}
      {mounted && deleteStaffModalOpen && deletingStaffUser && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md flex flex-col rounded-3xl border border-destructive/30 bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-destructive/10">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
                  <Trash2 className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    Delete Staff Account
                  </h3>
                  <p className="text-xs text-destructive font-medium">
                    Permanent Action
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteStaffModalOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4 text-xs">
              {deleteStaffError && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{deleteStaffError}</span>
                </div>
              )}

              <p className="text-foreground leading-relaxed">
                Are you sure you want to permanently delete the staff account for{' '}
                <strong className="text-foreground font-bold">{deletingStaffUser.name}</strong> (@
                <span className="font-mono font-bold text-accent">{deletingStaffUser.username}</span>)?
              </p>

              <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-3.5 text-[11px] text-destructive leading-relaxed">
                ⚠️ Once deleted, this staff member will immediately lose all login access to the clinic dashboard.
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-border p-4 bg-secondary/30">
              <button
                type="button"
                onClick={() => setDeleteStaffModalOpen(false)}
                className="h-11 rounded-xl border border-border px-5 text-xs font-bold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteStaffLoading}
                onClick={handleConfirmDeleteStaff}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-6 text-xs font-bold text-white shadow-md shadow-destructive/25 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              >
                <Trash2 className="size-4" />
                <span>{deleteStaffLoading ? 'Deleting...' : 'Yes, Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
