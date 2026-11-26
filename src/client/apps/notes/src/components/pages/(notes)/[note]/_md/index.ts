import type { APIRoute, GetStaticPaths } from "astro";
import { stringify } from "yaml";
import {
	getNotesIndex,
	type NoteEntryWithImplicitMetadata,
} from "~/modules/content/notes.ts";
import type { Locale } from "~/modules/i18n/locale.ts";

export function getGetStaticPaths(locale: Locale): GetStaticPaths {
	return async () => {
		const entries = await getNotesIndex().then(
			({ by }) => by.locale.get(locale) ?? [],
		);

		return entries.map((entry) => ({
			params: { slug: entry.implicitMetadata.slug },
			props: entry,
		}));
	};
}

export const GET: APIRoute<NoteEntryWithImplicitMetadata> = ({ props }) => {
	const { body, data } = props;

	return new Response(
		body
			? ["---", stringify(data).slice(0, -1), "---", "", body].join("\n")
			: "-",
		{
			status: 200,
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
			},
		},
	);
};
