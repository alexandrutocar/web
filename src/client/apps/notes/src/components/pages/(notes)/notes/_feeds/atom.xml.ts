import type { APIRoute } from "astro";
import { getFeed } from "~/modules/content/notes.feed.ts";

export const GET: APIRoute = async (context) => {
	const feed = await getFeed(context);

	return new Response(feed.atom1(), {
		headers: {
			"Content-Type": "text/xml; charset=utf-8",
		},
	});
};
