export const locales = {
    de: "Deutsch",
    en: "English",
    default: "en" as const,
};

export type Locale = Exclude<keyof typeof locales, "default">;

export const getLocale = function (url: URL) {
    const [, locale] = url.pathname.split("/");
    if (locale !== "default" && locale in locales) {
        return locale as Locale;
    }
    return locales.default;
};
