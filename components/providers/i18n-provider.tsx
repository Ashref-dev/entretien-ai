'use client'

import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { getOptions } from '@/i18n.config'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init(getOptions())

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
} 