import type { APIRoute } from "astro";
import { getLocale } from "~/modules/i18n/locale.ts";
import { useTranslations } from "~/modules/i18n/translations/index.ts";
import { getNotePath, getNotesIndex } from "~/modules/content/notes.ts";

export const GET: APIRoute = async function ({ site, url }) {
    const locale = getLocale(url);
    const t = useTranslations(locale);

    const entries = await getNotesIndex().then(({ by }) =>
        by.locale.get(locale) ?? []
    );

    return new Response(
        [
            `# ${t("title")}`,
            "",
            entries.length > 0
                ? entries.map(
                    ({ data: { title }, implicitMetadata: { slug } }) => {
                        return `- [${title}](${new URL(
                            getNotePath(locale, slug),
                            site,
                        )})\n`;
                    },
                )
                : t("empty"),
            "",
            `[alexandru.tocar@outlook.com](mailto:alexandru.tocar@outlook.com), [0xB617DD24](https://keys.openpgp.org/vks/v1/by-fingerprint/B617DD243AB02E3F2E67DBFD13052A85D7A42AA4), [atom.xml](${new URL(
                `/${locale}/${t("notes")}/atom.xml`,
                url,
            )})`,
        ].join("\n"),
        {
            status: 200,
            headers: {
                "Content-Type": "text/markdown; charset=utf-8",
            },
        },
    );
};
