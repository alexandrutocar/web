import {
    EnumChangefreq,
    type SitemapItemLoose,
    SitemapStream,
    streamToPromise,
} from "sitemap";
import type { APIRoute } from "astro";
import { Readable } from "node:stream";
import { type Locale, locales } from "~/modules/i18n/locale.ts";
import {
    getAlternates,
    getNotePath,
    getNotesIndex,
} from "~/modules/content/notes.ts";
import { useTranslations } from "~/modules/i18n/translations/index.ts";

export function toHreflangLinks(
    pairs: { locale: Locale; url: string }[],
): { lang: Locale; url: string }[] {
    return pairs.map(({ locale, url }) => ({ lang: locale, url }));
}

export const GET: APIRoute = async function ({ url }) {
    const stream = new SitemapStream({
        hostname: url.origin,
    });

    const links: SitemapItemLoose[] = [];

    const { by } = await getNotesIndex();

    for (const locale of locales) {
        const t = useTranslations(locale);

        // The notes index exists in every locale, so its hreflang links
        // can be generated directly from the configured locale list.
        links.push({
            changefreq: EnumChangefreq.WEEKLY,
            priority: 1.0,
            url: `/${locale}/${t("notes")}`,
            links: toHreflangLinks(
                locales.map((l) => ({
                    locale: l,
                    url: `/${l}/${t("notes", l)}`,
                })),
            ),
        });

        for (
            const { data, implicitMetadata: { count, slug } }
                of by.locale.get(locale) ?? []
        ) {
            // Find entries having the same count and turn them into hreflang links.
            const alternates = await getAlternates(count);

            links.push({
                changefreq: EnumChangefreq.NEVER,
                priority: 0.5,
                url: getNotePath(locale, slug),
                links: toHreflangLinks(
                    alternates.map((
                        { implicitMetadata: { locale: l, slug: altSlug } },
                    ) => ({
                        locale: l,
                        url: getNotePath(l, altSlug),
                    })),
                ),
                lastmod: data.updated.toISOString(),
            });
        }
    }

    const buffer = await streamToPromise(Readable.from(links).pipe(stream));

    return new Response(new Uint8Array(buffer), {
        headers: {
            "Content-Type": "application/xml; encoding: utf-8;",
        },
    });
};
