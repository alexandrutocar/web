import type { Locale } from "../i18n/locale.ts";

type Meta = {
  locale: Locale;
  index: number;
  slug: string;
};

export function decode(id: string): Meta {
  const [locale, rest] = id.split("/") as [Locale, string];
  const [idx, ...slug] = rest.split("-");

  return {
    locale,
    index: parseInt(idx),
    slug: slug.join("-"),
  };
}

export function encode({ locale, index, slug }: Meta): string {
  return `${locale}/${index}-${slug}`;
}
