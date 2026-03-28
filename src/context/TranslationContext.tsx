import { enumData } from "@/common/enums/enum";
import type { TranslationDto } from "@/dto/translation.dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "vi";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, { en: string; vi: string }>;
  t: (key: string, params?: Record<string, any>) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_language");
    return (saved as Language) || "vi";
  });

  const [translations, setTranslations] = useState<
    Record<string, { en: string; vi: string }>
  >({});

  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = async () => {
    try {
      setIsLoading(true);
      const response = await rootApiService.post<{ data: TranslationDto[] }>(
        API_ENDPOINTS.TRANSLATIONS.PAGINATION,
        {
          skip: 0,
          take: enumData.PAGE.PAGESIZE_MAX,
          where: {},
        },
      );

      const translationMap: Record<string, { en: string; vi: string }> = {};

      if (response?.data) {
        response.data.forEach((item: TranslationDto) => {
          translationMap[item.key] = {
            en: item.en,
            vi: item.vi,
          };
        });
      }

      setTranslations(translationMap);
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTranslations();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const translation = translations[key];
    if (!translation) return key;
    let text = translation[language] || key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        const value = params[paramKey];
        text = text.replace(new RegExp(`{{${paramKey}}}`, "g"), value);
      });
    }

    return text;
  };

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, translations, t, isLoading }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
};
