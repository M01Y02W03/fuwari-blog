import { siteConfig } from "@/config";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
	const sourceUrl = siteConfig.banner.src;
	if (!/^https?:\/\//i.test(sourceUrl)) {
		return new Response("Banner source is not a remote image.", {
			status: 400,
		});
	}

	try {
		const upstreamResponse = await fetch(sourceUrl, {
			headers: {
				Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
			},
		});

		if (!upstreamResponse.ok) {
			return new Response("Failed to fetch banner image.", {
				status: upstreamResponse.status,
			});
		}

		const responseHeaders = new Headers();
		const contentType = upstreamResponse.headers.get("content-type");
		if (contentType) {
			responseHeaders.set("content-type", contentType);
		}
		responseHeaders.set("cache-control", "no-store, max-age=0");

		return new Response(await upstreamResponse.arrayBuffer(), {
			status: 200,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error("Banner image proxy failed:", error);
		return new Response("Banner image proxy failed.", {
			status: 502,
		});
	}
};
