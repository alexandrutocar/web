import { render } from "astro:content";
import { loadRenderers } from "astro:container";

import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import { Feed } from "feed";

import { useTranslations } from "../i18n/translations/index.ts";
import { getLocale } from "../i18n/locale.ts";
import { getNotePath, getNotesIndex } from "./notes.ts";

export const getFeed = async function (
    { url }: { url: URL },
) {
    const locale = getLocale(url);
    const t = useTranslations(locale);

    const entries = await getNotesIndex().then(({ by }) =>
        by.locale.get(locale) ?? []
    );

    const updated = entries.reduce(
        (latest, { data: { updated } }) => updated > latest ? updated : latest,
        entries[0]?.data.updated ?? new Date(),
    );

    const feed = new Feed({
        description: t("about"),
        stylesheet: new URL(`/rss/${locale}/style.xsl`, url).toString(),
        updated,
        title: t("title"),
        link: url.toString(),
        id: new URL("/", url).toString(),
        author: {
            name: "Alexandru Tocar",
            email: "alexandru.tocar@outlook.com",
        },
        feedLinks: {
            atom: new URL(`/${locale}/${t("notes")}/atom.xml`, url).toString(),
            json: new URL(`/${locale}/${t("notes")}/feed.json`, url).toString(),
        },
    });

    const renderers = await loadRenderers([getMDXRenderer()]);
    const container = await AstroContainer.create({ renderers });

    for (const entry of entries) {
        const link = new URL(
            getNotePath(locale, entry.implicitMetadata.slug),
            url,
        ).toString();

        // Content
        const { Content } = await render(entry);
        const content = await container.renderToString(Content);

        feed.addItem({
            content,
            link,
            id: link,
            date: entry.data.updated,
            title: entry.data.title,
            description: entry.data.abstract,
        });
    }

    return feed;
};
