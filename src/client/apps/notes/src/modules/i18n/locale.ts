export const locales = ["de", "en"] as const;

export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

export const getLocale = function (url: URL) {
  const [, locale] = url.pathname.split("/");
  if ((locales as readonly string[]).includes(locale)) {
    return locale as Locale;
  }
  return defaultLocale;
};
