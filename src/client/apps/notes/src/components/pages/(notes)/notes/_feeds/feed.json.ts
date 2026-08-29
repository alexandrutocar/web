import type { APIRoute } from "astro";
import { getFeed } from "../../../../../modules/content/notes.feed.ts";

export const GET: APIRoute = async function (context) {
    const feed = await getFeed(context);

    return new Response(feed.json1(), {
        headers: {
            "Content-Type": "application/feed+json; charset=utf-8",
        },
    });
};
