import { list } from "@vercel/blob";
import { projects } from "@/data/projects";

// Always run on request (the blob store is mutable), but let the CDN and
// browser cache the response for 5 minutes via the Cache-Control header;
// stale responses may be served for a day while revalidating in the background.
export const dynamic = "force-dynamic";

export async function GET() {
  const { blobs } = await list({
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  // Only expose files the site actually displays, not the whole store.
  const allowedPrefixes = ["Images/", ...projects.map((p) => `${p.alias}/`)];
  const files = blobs
    .filter(
      ({ pathname }) =>
        !pathname.endsWith("/") &&
        allowedPrefixes.some((prefix) => pathname.startsWith(prefix))
    )
    .map(({ url, pathname }) => ({ url, pathname }));
  return Response.json(files, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
