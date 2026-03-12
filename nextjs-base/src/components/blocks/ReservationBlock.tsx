'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import PrivacyPolicyModal from '@/components/shared/PrivacyPolicyModal'
import { StrapiEntity, PrivacyPolicy } from '@/types/strapi'
import { generateSlots } from '@/lib/reservation-slots'
import { usePathname } from 'next/navigation'
import {
  weekdayIndexFromDate,
  weekdayIndexFromDayLabel,
} from '@/lib/opening-days'

interface BlockedSlot {
  id: number
  documentId: string
  date: string // 'YYYY-MM-DD'
  time: string | null
  label: string | null
}

type OpeningDay = {
  dayLabel: string
  isClosedAllDay?: boolean | null
  firstPeriodOpenTime?: string | null
  firstPeriodCloseTime?: string | null
  secondPeriodOpenTime?: string | null
  secondPeriodCloseTime?: string | null
  // Backward compatibility for old field names
  lunchOpenTime?: string | null
  lunchCloseTime?: string | null
  dinnerOpenTime?: string | null
  dinnerCloseTime?: string | null
}

// ─── Composant calendrier inline ─────────────────────────────────────────────
const MONTHS_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]
const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const InlineCalendar = ({
  value,
  onChange,
  minDate,
  maxDate,
  blockedDates = [],
  blockedWeekdays = [],
  locale = 'fr',
}: {
  value: string
  onChange: (date: string) => void
  minDate: string
  maxDate: string
  blockedDates?: string[]
  blockedWeekdays?: number[]
  locale?: 'fr' | 'en'
}) => {
  const today = new Date()
  const initFrom = value ? new Date(value + 'T12:00:00') : today
  const [viewYear, setViewYear] = useState(initFrom.getFullYear())
  const [viewMonth, setViewMonth] = useState(initFrom.getMonth())

  const minD = new Date(minDate + 'T00:00:00')
  const maxD = new Date(maxDate + 'T00:00:00')

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const offset = (firstDayOfMonth + 6) % 7 // Monday-first
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const canGoPrev =
    new Date(viewYear, viewMonth, 1) >
    new Date(minD.getFullYear(), minD.getMonth(), 1)
  const canGoNext =
    new Date(viewYear, viewMonth, 1) <
    new Date(maxD.getFullYear(), maxD.getMonth(), 1)

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else setViewMonth((m) => m + 1)
  }

  const handleDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    if (d < minD || d > maxD) return
    onChange(toDateStr(viewYear, viewMonth, day))
  }

  const isSelected = (day: number) =>
    value === toDateStr(viewYear, viewMonth, day)
  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    const dateStr = toDateStr(viewYear, viewMonth, day)
    const jsDay = d.getDay() // 0=Sun ... 6=Sat
    const weekday = jsDay === 0 ? 7 : jsDay // 1=Mon ... 7=Sun
    return (
      d < minD ||
      d > maxD ||
      blockedDates.includes(dateStr) ||
      blockedWeekdays.includes(weekday)
    )
  }
  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  const months = locale === 'en' ? MONTHS_EN : MONTHS_FR
  const days = locale === 'en' ? DAYS_EN : DAYS_FR

  return (
    <div className="rounded-xl border border-neutral-300 bg-[#E9F1EB] p-3 select-none w-full">
      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label={locale === 'en' ? 'Previous month' : 'Mois précédent'}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 text-neutral-700 text-lg"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-neutral-900">
          {months[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          aria-label={locale === 'en' ? 'Next month' : 'Mois suivant'}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 text-neutral-700 text-lg"
        >
          ›
        </button>
      </div>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7 mb-1">
        {days.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-neutral-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grille de jours */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) =>
          day === null ? (
            <div key={`e-${idx}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => handleDay(day)}
              disabled={isDisabled(day)}
              className={[
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors',
                isSelected(day)
                  ? 'bg-neutral-900 text-white font-semibold'
                  : isToday(day)
                    ? 'border border-neutral-900 text-neutral-900'
                    : !isDisabled(day)
                      ? 'text-neutral-900 hover:bg-neutral-100 cursor-pointer'
                      : 'text-neutral-300 cursor-not-allowed',
              ].join(' ')}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────

// ─── Composant sélecteur d'heure (modale) ────────────────────────────────────
const TimePicker = ({
  value,
  onChange,
  onClose,
  label,
  lunchSlots,
  dinnerSlots,
  blockedTimes = [],
  locale = 'fr',
}: {
  value: string
  onChange: (time: string) => void
  onClose: () => void
  label?: string
  lunchSlots: string[]
  dinnerSlots: string[]
  blockedTimes?: string[]
  locale?: 'fr' | 'en'
}) => {
  const availableLunch = lunchSlots.filter((s) => !blockedTimes.includes(s))
  const availableDinner = dinnerSlots.filter((s) => !blockedTimes.includes(s))
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={
        label || (locale === 'en' ? 'Choose a time' : 'Choisir une heure')
      }
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panneau */}
      <div className="relative w-full max-w-xs rounded-xl bg-[#E9F1EB] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900">
            {label || (locale === 'en' ? 'Choose a time' : 'Choisir une heure')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={locale === 'en' ? 'Close' : 'Fermer'}
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Service du midi */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {locale === 'en' ? 'Lunch' : 'Midi'}
            </p>
            {availableLunch.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">
                {locale === 'en'
                  ? 'No time slot available.'
                  : 'Aucun créneau disponible.'}
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableLunch.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      onChange(slot)
                      onClose()
                    }}
                    className={[
                      'rounded-xl border py-2 text-sm font-medium transition-colors',
                      value === slot
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service du soir */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {locale === 'en' ? 'Dinner' : 'Soir'}
            </p>
            {availableDinner.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">
                {locale === 'en'
                  ? 'No time slot available.'
                  : 'Aucun créneau disponible.'}
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableDinner.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      onChange(slot)
                      onClose()
                    }}
                    className={[
                      'rounded-xl border py-2 text-sm font-medium transition-colors',
                      value === slot
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Composant sélecteur de couverts (modale) ────────────────────────────────
const CoverPicker = ({
  value,
  onChange,
  onClose,
  min = 1,
  max = 20,
  label,
  locale = 'fr',
}: {
  value: string
  onChange: (n: string) => void
  onClose: () => void
  min?: number
  max?: number
  label?: string
  locale?: 'fr' | 'en'
}) => {
  const options = Array.from({ length: max - min + 1 }, (_, i) => i + min)
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={
        label || (locale === 'en' ? 'Number of guests' : 'Nombre de couverts')
      }
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xs rounded-xl bg-[#E9F1EB] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-900">
            {label ||
              (locale === 'en' ? 'Number of guests' : 'Nombre de couverts')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={locale === 'en' ? 'Close' : 'Fermer'}
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 text-lg leading-none"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {options.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                onChange(String(n))
                onClose()
              }}
              className={[
                'rounded-xl border py-2 text-sm font-medium transition-colors',
                value === String(n)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

type ReservationBlockProps = {
  title?: string
  subtitle?: string
  description?: string
  submitLabel?: string
  successMessage?: string
  errorMessage?: string
  submittingText?: string
  firstNameLabel?: string
  lastNameLabel?: string
  phoneLabel?: string
  emailLabel?: string
  dateLabel?: string
  timeLabel?: string
  coversLabel?: string
  messageLabel?: string
  firstNamePlaceholder?: string
  lastNamePlaceholder?: string
  phonePlaceholder?: string
  emailPlaceholder?: string
  messagePlaceholder?: string
  consentText?: string
  policyLinkText?: string
  consentRequiredText?: string
  rgpdInfoText?: string
  minAdvanceDays?: number
  maxAdvanceDays?: number
  lunchStart?: string
  lunchEnd?: string
  dinnerStart?: string
  dinnerEnd?: string
  minCovers?: number
  maxCovers?: number
  blockAlignment?: 'left' | 'center' | 'right' | 'full'
  maxWidth?: 'small' | 'medium' | 'large' | 'full'
  privacyPolicy?: PrivacyPolicy & StrapiEntity
  openingDays?: OpeningDay[]
}

const findOpeningDayForDate = (
  dateStr: string,
  openingDays: OpeningDay[]
): {
  isClosedAllDay: boolean
  firstPeriodOpenTime?: string | null
  firstPeriodCloseTime?: string | null
  secondPeriodOpenTime?: string | null
  secondPeriodCloseTime?: string | null
  lunchOpenTime?: string | null
  lunchCloseTime?: string | null
  dinnerOpenTime?: string | null
  dinnerCloseTime?: string | null
} | null => {
  const weekday = weekdayIndexFromDate(dateStr)
  if (!weekday || openingDays.length === 0) return null

  const entries = openingDays.filter(
    (entry) => weekdayIndexFromDayLabel(entry.dayLabel || '') === weekday
  )
  if (entries.length === 0) return null

  // Safety rule: if any entry says closed, the full weekday is closed.
  if (entries.some((entry) => !!entry.isClosedAllDay)) {
    return { isClosedAllDay: true }
  }

  const firstPeriodSource =
    entries.find(
      (entry) => !!entry.firstPeriodOpenTime && !!entry.firstPeriodCloseTime
    ) ??
    entries.find((entry) => !!entry.lunchOpenTime && !!entry.lunchCloseTime) ??
    null

  const secondPeriodSource =
    entries.find(
      (entry) => !!entry.secondPeriodOpenTime && !!entry.secondPeriodCloseTime
    ) ??
    entries.find(
      (entry) => !!entry.dinnerOpenTime && !!entry.dinnerCloseTime
    ) ??
    null

  return {
    isClosedAllDay: false,
    firstPeriodOpenTime: firstPeriodSource?.firstPeriodOpenTime,
    firstPeriodCloseTime: firstPeriodSource?.firstPeriodCloseTime,
    secondPeriodOpenTime: secondPeriodSource?.secondPeriodOpenTime,
    secondPeriodCloseTime: secondPeriodSource?.secondPeriodCloseTime,
    lunchOpenTime: firstPeriodSource?.lunchOpenTime,
    lunchCloseTime: firstPeriodSource?.lunchCloseTime,
    dinnerOpenTime: secondPeriodSource?.dinnerOpenTime,
    dinnerCloseTime: secondPeriodSource?.dinnerCloseTime,
  }
}

const ReservationBlock = ({
  title,
  subtitle,
  description,
  submitLabel,
  successMessage,
  errorMessage,
  submittingText,
  firstNameLabel,
  lastNameLabel,
  phoneLabel,
  emailLabel,
  dateLabel,
  timeLabel,
  coversLabel,
  messageLabel,
  firstNamePlaceholder,
  lastNamePlaceholder,
  phonePlaceholder,
  emailPlaceholder,
  messagePlaceholder,
  consentText,
  policyLinkText,
  consentRequiredText,
  rgpdInfoText,
  minAdvanceDays = 1,
  maxAdvanceDays = 60,
  lunchStart = '11:00',
  lunchEnd = '13:00',
  dinnerStart = '18:00',
  dinnerEnd = '20:00',
  minCovers = 1,
  maxCovers = 20,
  blockAlignment = 'center',
  maxWidth = 'medium',
  privacyPolicy,
  openingDays = [],
}: ReservationBlockProps) => {
  const pathname = usePathname()
  const currentLocale = useMemo<'fr' | 'en'>(() => {
    const firstSegment = pathname.split('/')[1]
    return firstSegment === 'en' ? 'en' : 'fr'
  }, [pathname])
  const dateLocale = currentLocale === 'en' ? 'en-US' : 'fr-FR'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    covers: String(minCovers),
    message: '',
    consent: false,
    // Honeypot - champ invisible pour piéger les bots
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)
  const [dateError, setDateError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false)

  // ── Réglages dynamiques depuis l'admin ───────────────────────────────────
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [dynamicMaxCovers, setDynamicMaxCovers] = useState<number>(maxCovers)
  const [adminOpeningDays, setAdminOpeningDays] = useState<OpeningDay[]>([])

  useEffect(() => {
    fetch('/api/public/reservation-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.blockedSlots) setBlockedSlots(d.blockedSlots)
        if (d.maxCoversPerSlot) setDynamicMaxCovers(d.maxCoversPerSlot)
        if (Array.isArray(d.openingDays)) setAdminOpeningDays(d.openingDays)
      })
      .catch(() => {
        /* silently fail — defaults are fine */
      })
  }, [])

  // Dates entièrement bloquées (pas de time)
  const blockedDates = useMemo(
    () => blockedSlots.filter((s) => !s.time).map((s) => s.date),
    [blockedSlots]
  )

  // Créneaux bloqués pour la date sélectionnée
  const blockedTimesForDate = useMemo(
    () =>
      blockedSlots
        .filter((s) => s.time && s.date === formData.date)
        .map((s) => s.time as string),
    [blockedSlots, formData.date]
  )

  const usableOpeningDays = useMemo(
    () =>
      (adminOpeningDays.length > 0 ? adminOpeningDays : openingDays).filter(
        (entry) => weekdayIndexFromDayLabel(entry.dayLabel || '') !== null
      ),
    [adminOpeningDays, openingDays]
  )

  const blockedWeekdays = useMemo(() => {
    if (usableOpeningDays.length === 0) return []

    const hasValidRange = (entry: OpeningDay) => {
      const hasFirstRange =
        !!entry.firstPeriodOpenTime && !!entry.firstPeriodCloseTime
      const hasSecondRange =
        !!entry.secondPeriodOpenTime && !!entry.secondPeriodCloseTime
      return hasFirstRange || hasSecondRange
    }

    const blocked: number[] = []

    for (const day of [1, 2, 3, 4, 5, 6, 7]) {
      const entries = usableOpeningDays.filter(
        (entry) => weekdayIndexFromDayLabel(entry.dayLabel || '') === day
      )

      if (entries.length === 0) {
        blocked.push(day)
        continue
      }

      if (entries.some((entry) => !!entry.isClosedAllDay)) {
        blocked.push(day)
        continue
      }

      if (!entries.some((entry) => hasValidRange(entry))) {
        blocked.push(day)
      }
    }

    return blocked
  }, [usableOpeningDays])

  const { minDateStr, maxDateStr } = useMemo(() => {
    const today = new Date()
    const min = new Date(today)
    min.setDate(min.getDate() + minAdvanceDays)
    const max = new Date(today)
    max.setDate(max.getDate() + maxAdvanceDays)
    return {
      minDateStr: min.toISOString().split('T')[0],
      maxDateStr: max.toISOString().split('T')[0],
    }
  }, [minAdvanceDays, maxAdvanceDays])

  const lunchSlots = useMemo(() => {
    const fallback = generateSlots(lunchStart, lunchEnd)
    if (!formData.date || usableOpeningDays.length === 0) return fallback

    const openingDay = findOpeningDayForDate(formData.date, usableOpeningDays)
    if (!openingDay || openingDay.isClosedAllDay) return []

    const open = openingDay.firstPeriodOpenTime ?? openingDay.lunchOpenTime
    const close = openingDay.firstPeriodCloseTime ?? openingDay.lunchCloseTime

    if (!open || !close) return []
    return generateSlots(open, close)
  }, [formData.date, lunchStart, lunchEnd, usableOpeningDays])

  const dinnerSlots = useMemo(() => {
    const fallback = generateSlots(dinnerStart, dinnerEnd)
    if (!formData.date || usableOpeningDays.length === 0) return fallback

    const openingDay = findOpeningDayForDate(formData.date, usableOpeningDays)
    if (!openingDay || openingDay.isClosedAllDay) return []

    const open = openingDay.secondPeriodOpenTime ?? openingDay.dinnerOpenTime
    const close = openingDay.secondPeriodCloseTime ?? openingDay.dinnerCloseTime

    if (!open || !close) return []
    return generateSlots(open, close)
  }, [formData.date, dinnerStart, dinnerEnd, usableOpeningDays])

  const blockAlignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full',
  }

  const maxWidthClasses = {
    small: 'max-w-2xl',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-none',
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.date) {
      setDateError(true)
      return
    }
    if (!formData.time) {
      setTimeError(true)
      return
    }
    setDateError(false)
    setTimeError(false)
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale: currentLocale }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi")
      }

      setSubmitStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        covers: String(minCovers),
        message: '',
        consent: false,
        website: '',
      })
    } catch (error) {
      console.error('Error submitting reservation:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`relative z-[60] w-full ${blockAlignmentClasses[blockAlignment]} ${maxWidthClasses[maxWidth]}  px-4`}
    >
      <div className="w-full ">
        {title && (
          <h2 className="text-2xl font-semibold text-[#ebffee] mb-6">
            {title}
          </h2>
        )}
        {subtitle && <p className="text-lg text-[#ebffee] mb-3">{subtitle}</p>}
        {description && (
          <p className="text-[#ebffee] mb-8 whitespace-pre-line">
            {description}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
            {/* ── Colonne gauche : Calendrier + Heure + Couverts ── */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#ebffee]">
                  {dateLabel || 'Date'} *
                </label>
                <InlineCalendar
                  value={formData.date}
                  onChange={(date) => {
                    setFormData((prev) => ({ ...prev, date, time: '' }))
                    setDateError(false)
                  }}
                  minDate={minDateStr}
                  maxDate={maxDateStr}
                  blockedDates={blockedDates}
                  blockedWeekdays={blockedWeekdays}
                  locale={currentLocale}
                />
                {formData.date ? (
                  <p className="text-sm text-[#ebffee] opacity-80">
                    {new Date(formData.date + 'T12:00:00').toLocaleDateString(
                      dateLocale,
                      {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </p>
                ) : dateError ? (
                  <p className="text-sm text-red-400">
                    {currentLocale === 'en'
                      ? 'Please select a date.'
                      : 'Veuillez sélectionner une date.'}
                  </p>
                ) : null}
              </div>

              {/* Heure + Couverts sous le calendrier */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#ebffee]">
                    {timeLabel || 'Heure'} *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTimePickerOpen(true)
                      setTimeError(false)
                    }}
                    className={[
                      'w-full rounded-xl border bg-[#E9F1EB] px-3 py-2 text-left text-sm shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900/60',
                      timeError ? 'border-red-400' : 'border-neutral-300',
                      formData.time ? 'text-neutral-900' : 'text-neutral-400',
                    ].join(' ')}
                  >
                    {formData.time ||
                      (currentLocale === 'en'
                        ? 'Choose a time...'
                        : 'Choisir une heure…')}
                  </button>
                  {timeError && (
                    <p className="text-sm text-red-400">
                      {currentLocale === 'en'
                        ? 'Please choose a time.'
                        : 'Veuillez choisir une heure.'}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#ebffee]">
                    {coversLabel || 'Couverts'} *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCoverPickerOpen(true)}
                    className="w-full rounded-xl border border-neutral-300 bg-[#E9F1EB] px-3 py-2 text-left text-sm shadow-sm text-neutral-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900/60"
                  >
                    {formData.covers
                      ? currentLocale === 'en'
                        ? `${formData.covers} ${Number(formData.covers) === 1 ? 'guest' : 'guests'}`
                        : `${formData.covers} ${Number(formData.covers) === 1 ? 'couvert' : 'couverts'}`
                      : currentLocale === 'en'
                        ? 'Choose...'
                        : 'Choisir…'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Colonne droite : Infos personnelles + Message + RGPD ── */}
            <div className="flex flex-col gap-6">
              {/* Prénom + Nom + Téléphone + Email en colonne */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-[#ebffee]"
                  >
                    {firstNameLabel || 'Prénom'} *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-[#E9F1EB] px-3 py-2 shadow-sm text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900/60"
                    placeholder={firstNamePlaceholder}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-[#ebffee]"
                  >
                    {lastNameLabel || 'Nom'} *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-[#E9F1EB] px-3 py-2 shadow-sm text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900/60"
                    placeholder={lastNamePlaceholder}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-[#ebffee]"
                  >
                    {phoneLabel || 'Téléphone'} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-[#E9F1EB] px-3 py-2 shadow-sm text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900/60"
                    placeholder={phonePlaceholder}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#ebffee]"
                  >
                    {emailLabel || 'Email'} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-[#E9F1EB] px-3 py-2 shadow-sm text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900/60"
                    placeholder={emailPlaceholder}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-4">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-[#ebffee]"
                >
                  {messageLabel || 'Message (optionnel)'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-xl border border-neutral-300 bg-[#E9F1EB] px-3 py-2 shadow-sm text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-neutral-900/60 resize-vertical"
                  placeholder={messagePlaceholder}
                />
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                }}
              />

              {/* Consentement RGPD */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    required
                    className="mt-1 h-4 w-4 rounded border border-neutral-300 text-neutral-900 focus:ring-neutral-900/60"
                  />
                  <label htmlFor="consent" className="text-sm text-[#ebffee]">
                    {consentText}{' '}
                    <button
                      type="button"
                      onClick={() => setIsPolicyModalOpen(true)}
                      className="underline underline-offset-2 transition-colors hover:text-neutral-700"
                    >
                      {policyLinkText}
                    </button>
                    . *
                  </label>
                </div>
                {rgpdInfoText && (
                  <div className="whitespace-pre-line rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-[#ebffee]">
                    {rgpdInfoText}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col items-start gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting || !formData.consent}
                >
                  {isSubmitting ? submittingText : submitLabel}
                </Button>
                {!formData.consent && consentRequiredText && (
                  <p className="text-xs text-[#ebffee]">
                    {consentRequiredText}
                  </p>
                )}
              </div>

              {submitStatus === 'success' && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
            </div>
            {/* fin colonne droite */}
          </div>
        </form>
      </div>

      <PrivacyPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        title={privacyPolicy?.title}
        content={privacyPolicy?.content}
        closeButtonText={privacyPolicy?.closeButtonText}
      />

      {isTimePickerOpen && (
        <TimePicker
          value={formData.time}
          onChange={(time) => setFormData((prev) => ({ ...prev, time }))}
          onClose={() => setIsTimePickerOpen(false)}
          label={
            timeLabel ||
            (currentLocale === 'en' ? 'Choose a time' : 'Choisir une heure')
          }
          lunchSlots={lunchSlots}
          dinnerSlots={dinnerSlots}
          blockedTimes={blockedTimesForDate}
          locale={currentLocale}
        />
      )}

      {isCoverPickerOpen && (
        <CoverPicker
          value={formData.covers}
          onChange={(covers) => setFormData((prev) => ({ ...prev, covers }))}
          onClose={() => setIsCoverPickerOpen(false)}
          min={minCovers}
          max={dynamicMaxCovers}
          label={
            coversLabel ||
            (currentLocale === 'en' ? 'Number of guests' : 'Nombre de couverts')
          }
          locale={currentLocale}
        />
      )}
    </div>
  )
}

export default ReservationBlock
