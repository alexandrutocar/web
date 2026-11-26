import { type CollectionEntry, getCollection } from "astro:content";
import { type Locale, locales } from "~/modules/i18n/locale.ts";
import { useTranslations } from "~/modules/i18n/translations/index.ts";

// Implicit Metadata
// -----------------
export type ImplicitMetadata = {
	locale: Locale;
	count: number;
	slug: string;
};

export function parseImplicitMetadataFromID(id: string): ImplicitMetadata {
	const [locale, rest] = id.split("/") as [Locale, string];
	const [cnt, ...slug] = rest.split("-");

	return {
		locale,
		count: parseInt(cnt),
		slug: slug.join("-"),
	};
}

export type NoteEntryWithImplicitMetadata = CollectionEntry<"notes"> & {
	implicitMetadata: ImplicitMetadata;
};

export type NoteEntryWithLocaleAndSlug = CollectionEntry<"notes"> & {
	implicitMetadata: Pick<ImplicitMetadata, "locale" | "slug">;
};

export type NoteEntryWithSlug = CollectionEntry<"notes"> & {
	implicitMetadata: Pick<ImplicitMetadata, "slug">;
};

export function completeWithImplicitMetadata(
	entries: CollectionEntry<"notes">[],
): NoteEntryWithImplicitMetadata[] {
	return entries.map((entry) => ({
		...entry,
		implicitMetadata: parseImplicitMetadataFromID(entry.id),
	}));
}

// Notes Index
// -----------
export type NotesIndex = {
	by: {
		locale: Map<Locale, NoteEntryWithImplicitMetadata[]>;
		count: Map<number, Map<Locale, NoteEntryWithSlug>>;
	};
};

// Shared Module-level Cache
let __notesIndex: Promise<NotesIndex> | null = null;

/**
 * Fetch and index all notes, once per process lifetime.
 */
export async function getNotesIndex(): Promise<NotesIndex> {
	if (!__notesIndex || import.meta.env.DEV) {
		const entries = await getCollection("notes").then(
			completeWithImplicitMetadata,
		);

		const byLocale: NotesIndex["by"]["locale"] = new Map();
		const byCount: NotesIndex["by"]["count"] = new Map();

		for (const entry of entries) {
			const {
				implicitMetadata: { locale, count, slug },
			} = entry;

			if (!byLocale.has(locale)) byLocale.set(locale, []);
			byLocale.get(locale)!.push(entry);

			if (!byCount.has(count)) byCount.set(count, new Map());
			byCount.get(count)!.set(locale, {
				...entry,
				implicitMetadata: { slug },
			});
		}

		__notesIndex = { by: { locale: byLocale, count: byCount } };
	}
	return __notesIndex;
}

// Path
// ----
export function getNotePath(locale: Locale, slug: string): string {
	const t = useTranslations(locale);
	return `/${locale}/${t("notes")}/${slug}`;
}

// Alternates
// ----------
export async function getAlternates(
	count: number,
): Promise<NoteEntryWithLocaleAndSlug[]> {
	const { by } = await getNotesIndex();

	const alternates = by.count.get(count);

	if (!alternates) return [];

	return locales
		.filter((l) => alternates.has(l))
		.map((l) => {
			const alternate = alternates.get(l);

			return {
				...alternate,
				implicitMetadata: { ...alternate.implicitMetadata, locale: l },
			};
		});
}
