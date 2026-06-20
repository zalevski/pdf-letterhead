import type { AppLanguage } from '../../shared/types'

export function detectAppLanguage(locale: string | null | undefined): AppLanguage {
  const normalized = (locale ?? '').toLowerCase()

  if (normalized.startsWith('pl')) {
    return 'pl'
  }

  if (normalized.startsWith('de')) {
    return 'de'
  }

  return 'en'
}
