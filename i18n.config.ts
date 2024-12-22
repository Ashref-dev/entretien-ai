import type { InitOptions } from 'i18next'
import { translations as enTranslations } from '@/public/locales/en/common'
import { translations as frTranslations } from '@/public/locales/fr/common'

export const defaultNS = 'common'
export const fallbackLng = 'en'

export const resources = {
  en: {
    common: enTranslations,
  },
  fr: {
    common: frTranslations,
  },
} as const

export function getOptions(lng = fallbackLng, ns = defaultNS): InitOptions {
  return {
    supportedLngs: ['en', 'fr'],
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    resources,
  }
} 