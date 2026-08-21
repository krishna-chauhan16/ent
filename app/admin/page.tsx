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
} from 'lucide-react'
import { site } from '@/lib/site'
import type { Appointment } from '@/lib/db'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Dashboard Data State
  const [stats, setStats] = useState({
    visitorsTotal: 0,
    visitorsToday: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    todayAppointments: 0,
    databaseSource: 'Local Storage',
  })
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [hospitalFilter, setHospitalFilter] = useState('all')

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
  const [rescheduleLang, setRescheduleLang] = useState<'gujarati' | 'english'>('gujarati')
  const [isRescheduling, setIsRescheduling] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check existing login in sessionStorage (clears automatically when tab is closed)
  useEffect(() => {
    const token = sessionStorage.getItem('dr_vaidik_admin_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch Dashboard Data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      if (data.success) {
        setAppointments(data.appointments)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to load appointments', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
      // Auto refresh every 30 seconds
      const timer = setInterval(fetchData, 30000)
      return () => clearInterval(timer)
    }
  }, [isAuthenticated, fetchData])

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
        sessionStorage.setItem('dr_vaidik_admin_token', data.token)
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
    localStorage.removeItem('dr_vaidik_admin_token')
    setIsAuthenticated(false)
    setUsername('')
    setPassword('')
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
    const msg = `Dear ${apt.name},

Your ENT Consultation with Dr. Vaidik Chauhan, MS (ENT) is CONFIRMED.

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

    if (rescheduleLang === 'gujarati') {
      return `🏥 *ડૉ. વૈદિક ચૌહાણ, MS (ENT) - એપોઇન્ટમેન્ટ અપડેટ*

નમસ્તે *${pName}* જી,

ડૉક્ટરના સર્જિકલ શિડ્યુઅલને કારણે / તમે પસંદ કરેલી તારીખ ઉપલબ્ધ ન હોવાથી, તમારી ENT કન્સલ્ટેશન એપોઇન્ટમેન્ટ નીચે મુજબ કન્ફર્મ કરવામાં આવી છે:

📅 *નવી તારીખ*: ${dt}
⏰ *સમય સ્લોટ*: ${tm}
🏥 *હોસ્પિટલ*: ${loc}
📍 *સરનામું*: ${loc.includes('Atulya') ? '૨જો માળ, એલિટ મેગ્નમ, ભુયંગદેવ ક્રોસ રોડ, સોલા રોડ, ઘાટલોડિયા, અમદાવાદ' : 'અમદાવાદ'}
🩺 *ડૉક્ટર*: Dr. Vaidik Chauhan, MS (ENT) - Consultant ENT Surgeon

👉 *નોંધ*: કૃપા કરીને આપેલા સમય કરતાં ૧૦ મિનિટ વહેલા પહોંચવા વિનંતી.
📞 કોઈ પ્રશ્ન હોય તો સંપર્ક કરો: +91 9601074848

સ્વસ્થ રહો, આભાર! 🙏`
    } else {
      return `🏥 *Dr. Vaidik Chauhan, MS (ENT) - Appointment Rescheduled*

Dear *${pName}*,

Due to OT schedule / date availability, your ENT consultation appointment has been rescheduled and confirmed as follows:

📅 *New Date*: ${dt}
⏰ *Time Slot*: ${tm}
🏥 *Hospital*: ${loc}
🩺 *Doctor*: Dr. Vaidik Chauhan, MS (ENT) - Consultant ENT Surgeon

👉 *Please note*: Kindly arrive 10 minutes prior to your slot.
📞 Clinic Helpline: +91 9601074848

Thank you!`
    }
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
    const headers = ['ID', 'Patient Name', 'Phone', 'Hospital', 'Concern', 'Date', 'Status', 'Submitted At']
    const rows = appointments.map((a) => [
      `"${a.id}"`,
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
    const matchesSearch =
      searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    const matchesHospital =
      hospitalFilter === 'all' || a.location.toLowerCase().includes(hospitalFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesHospital
  })

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
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              title="Refresh Data"
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
              <span>+{stats.visitorsToday} visitors today</span>
            </div>
          </div>

          {/* Card 2: Total Appointments */}
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Requests
              </span>
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent">
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

          {/* Card 3: Pending Requests */}
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
                  Manage patient requests, change status, and send 1-click WhatsApp confirmation.
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
                  <option value="Atulya">Atulya Hospital (Bhuyangdev)</option>
                  <option value="KD">KD Hospital (SG Highway)</option>
                  <option value="Prathana">Prathana Hospital</option>
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
                  <option value="Atulya Superspeciality Hospital (Bhuyangdev)">Atulya Superspeciality Hospital &amp; ICU, Bhuyangdev, Ahmedabad</option>
                  <option value="KD Hospital (SG Highway)">KD Hospital, SG Highway, Ahmedabad</option>
                  <option value="Prathana Hospital">Prathana Hospital, Ahmedabad</option>
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

              {/* Language Switch */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-foreground">WhatsApp Message Language:</span>
                <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRescheduleLang('gujarati')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      rescheduleLang === 'gujarati' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    ગુજરાતી (Gujarati)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRescheduleLang('english')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      rescheduleLang === 'english' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    English
                  </button>
                </div>
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
    </div>
  )
}
