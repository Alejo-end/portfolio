import { list } from "@vercel/blob";

export async function GET() {
  const { blobs } = await list({
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return Response.json(blobs);
}
