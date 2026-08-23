export const locales = {
  de: "Deutsch",
  en: "English",
  default: "en" as const,
};

export type Locale = Exclude<keyof typeof locales, "default">;

export const getLocale = function (url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang !== "default" && lang in locales) {
    return lang as Locale;
  }
  return locales.default;
};
