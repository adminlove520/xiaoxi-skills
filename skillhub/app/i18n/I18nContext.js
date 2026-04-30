'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { zh } from './zh';
import { en } from './en';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('zh');
  const [translations, setTranslations] = useState(zh);

  useEffect(() => {
    // Try to load from localStorage
    const savedLang = localStorage.getItem('skillhub_lang');
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLang(savedLang);
      setTranslations(savedLang === 'zh' ? zh : en);
    } else {
      // Browser language detect
      const browserLang = navigator.language;
      if (browserLang.startsWith('en')) {
        setLang('en');
        setTranslations(en);
      }
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    setTranslations(newLang === 'zh' ? zh : en);
    localStorage.setItem('skillhub_lang', newLang);
  };

  return (
    <I18nContext.Provider value={{ lang, t: translations, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
