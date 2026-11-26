import { defaultLocale, type Locale } from "../locale.ts";

export const translations = {
	en: {
		about: "Notes on code, math and self.",
		"links.email": "email address",
		"links.key": "pgp key",
		"links.atom": "updates",
		notes: "notes",
		empty: "The first entry will be published on September 5.",
		title: "Alex's Notes",
		"title.format.md": "Markdown Format",
	},
	de: {
		about: "Notizen zu Code, Mathe and Selbst.",
		"links.email": "E-Mail Adresse",
		"links.key": "PGP-Schlüssel",
		"links.atom": "Neuigkeiten",
		notes: "notizen",
		empty: "Der erste Beitrag wird am 5. September veröffentlicht.",
		title: "Alex' Notizen",
		"title.format.md": "Markdown Schreib-Format",
	},
} as const;

export function useTranslations(locale: keyof typeof translations) {
	const cached: Record<string, string> = translations[locale];

	return (
		key: keyof (typeof translations)[typeof defaultLocale],
		locale?: Locale,
	) => {
		let localized = cached;
		if (typeof locale !== "undefined") {
			localized = translations[locale];
		}

		return key in localized ? localized[key] : translations[defaultLocale][key];
	};
}
