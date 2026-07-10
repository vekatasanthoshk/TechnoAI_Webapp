// Disable default body parser so Vercel does not pre-parse the stream,
// which prevents nodeHTTPRequestHandler from hanging.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  // The real handler is bundled from server/vercel.ts into a single
  // self-contained ESM file during build:vercel; a direct relative import
  // of ../../server would not resolve at runtime (extensionless ESM).
  // @ts-ignore -- generated at build time
  const mod = await import("../_lib/trpc-handler.mjs");
  return mod.default(req, res);
}
