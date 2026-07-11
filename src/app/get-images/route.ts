import { list } from "@vercel/blob";

// Cache the blob listing: serve from CDN/browser for 5 minutes instead of
// hitting the Blob API on every visit; stale responses may be served for a
// day while revalidating in the background.
export const revalidate = 300;

export async function GET() {
  const { blobs } = await list({
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  const files = blobs
    .filter(({ pathname }) => !pathname.endsWith("/"))
    .map(({ url, pathname }) => ({ url, pathname }));
  return Response.json(files, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
