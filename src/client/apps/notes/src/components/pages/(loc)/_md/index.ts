import type { APIRoute } from "astro";
import { defaultLocale } from "~/modules/i18n/locale.ts";
import { useTranslations } from "~/modules/i18n/translations/index.ts";

export const GET: APIRoute = function ({ url }) {
  const t = useTranslations(defaultLocale);

  return new Response(
    [
      `# -`,
      "",
      `- [English](${new URL(`/en/${t("notes", "en")}`, url)})`,
      `- [Deutsch](${new URL(`/de/${t("notes", "de")}`, url)})`,
    ].join("\n"),
    {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
};
