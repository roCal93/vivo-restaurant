export type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type AppLocale = 'fr' | 'en'

const WEEKDAY_INDEX_TO_KEY: Record<number, WeekdayKey> = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday',
}

const WEEKDAY_KEY_TO_INDEX: Record<WeekdayKey, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
}

const WEEKDAY_LABELS: Record<AppLocale, Record<WeekdayKey, string>> = {
  fr: {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  },
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
}

const DAY_KEY_SET: Set<string> = new Set<WeekdayKey>([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

const LEGACY_FR_TO_KEY: Record<string, WeekdayKey> = {
  lundi: 'monday',
  mardi: 'tuesday',
  mercredi: 'wednesday',
  jeudi: 'thursday',
  vendredi: 'friday',
  samedi: 'saturday',
  dimanche: 'sunday',
}

const normalizeDayToken = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export const parseWeekdayKey = (value: string): WeekdayKey | null => {
  const normalized = normalizeDayToken(value)
  if (DAY_KEY_SET.has(normalized)) return normalized as WeekdayKey
  return LEGACY_FR_TO_KEY[normalized] ?? null
}

export const localizeOpeningDayLabel = (
  value: string,
  locale: AppLocale
): string => {
  const key = parseWeekdayKey(value)
  if (!key) return value
  return WEEKDAY_LABELS[locale][key]
}

export const weekdayIndexFromDayLabel = (value: string): number | null => {
  const key = parseWeekdayKey(value)
  if (!key) return null
  return WEEKDAY_KEY_TO_INDEX[key]
}

export const weekdayIndexFromDate = (dateStr: string): number | null => {
  if (!dateStr) return null
  const date = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const jsDay = date.getDay() // 0 = Sunday
  return jsDay === 0 ? 7 : jsDay // 1 = Monday ... 7 = Sunday
}

export const weekdayKeyFromDate = (dateStr: string): WeekdayKey | null => {
  const index = weekdayIndexFromDate(dateStr)
  if (!index) return null
  return WEEKDAY_INDEX_TO_KEY[index] ?? null
}
