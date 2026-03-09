import { describe, expect, it } from 'vitest'
import {
  isValidBlockedSlotInput,
  isValidReservationTime,
  validateReservationInput,
} from './reservation-validation'

function dateOffset(days: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

describe('reservation-validation', () => {
  it('accepts a valid reservation payload', () => {
    const result = validateReservationInput({
      firstName: 'Romain',
      lastName: 'Calmelet',
      phone: '+33 6 12 34 56 78',
      email: 'romain@example.com',
      date: dateOffset(1),
      time: '11:30',
      covers: '4',
      consent: true,
    })

    expect(result.ok).toBe(true)
  })

  it('rejects invalid reservation slot values', () => {
    expect(isValidReservationTime('99:99')).toBe(false)
    expect(isValidReservationTime('11:30')).toBe(true)
  })

  it('rejects reservation in the past', () => {
    const result = validateReservationInput({
      firstName: 'Romain',
      lastName: 'Calmelet',
      phone: '+33 6 12 34 56 78',
      email: 'romain@example.com',
      date: dateOffset(-1),
      time: '11:30',
      covers: '2',
      consent: true,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/passe|pass/gi)
    }
  })

  it('validates blocked-slot payloads for whole-day and time-based blocks', () => {
    const futureDate = dateOffset(2)

    expect(isValidBlockedSlotInput(futureDate, null)).toBe(true)
    expect(isValidBlockedSlotInput(futureDate, '18:30')).toBe(true)
    expect(isValidBlockedSlotInput(futureDate, '25:00')).toBe(false)
    expect(isValidBlockedSlotInput('invalid-date', null)).toBe(false)
  })
})
