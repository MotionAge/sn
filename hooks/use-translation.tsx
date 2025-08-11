"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "np"

interface TranslationContextType {
  language: Language
  toggleLanguage: () => void
  translate: (text: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Toggle between English and Nepali
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "np" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)

    // In a real implementation, this would trigger Google Translate API
    // For now, we'll just log the language change
    console.log(`Language changed to ${newLanguage}`)
  }

  // Mock translation function
  // In production, this would use Google Translate API
  const translate = (text: string) => {
    // For now, just return the original text
    return text
  }

  return (
    <TranslationContext.Provider value={{ language, toggleLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

export default useTranslation
