import { locales } from "../locale.ts";

export const translations = {
  en: {
    "links.email": "email address",
    "links.key": "pgp key",
    "links.atom": "updates",
    "notes": "notes",
    "empty": "The first entry will be published on August 29."
  },
  de: {
    "links.email": "E-Mail Adresse",
    "links.key": "PGP-Schlüssel",
    "links.atom": "Neuigkeiten",
    "notes": "notizen",
    "empty": "Der erste Eintrag wird am 29. August veröffentlicht."
  },
} as const;

export function useTranslations(locale: keyof typeof translations) {
  const localized: Record<string, string> = translations[locale];
  return function t(
    key: keyof (typeof translations)[(typeof locales)["default"]],
  ) {
    return key in localized
      ? localized[key]
      : translations[locales.default][key];
  };
}
