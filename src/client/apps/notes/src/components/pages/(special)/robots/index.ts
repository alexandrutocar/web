import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) =>
	new Response(
		[
			"User-agent: *",
			"Allow: /",
			`Sitemap: ${new URL("/sitemap.xml", url)}`,
		].join("\n"),
		{
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
		},
	);
