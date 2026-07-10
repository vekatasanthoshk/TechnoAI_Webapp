import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";

/**
 * Vercel serverless entry. Bundled into api/_lib/trpc-handler.mjs by
 * build:vercel (see package.json) so the function has zero runtime
 * imports outside its own file — extensionless ESM imports of ../server
 * do not resolve inside /var/task.
 */
export default async function handler(req: any, res: any) {
  try {
    // Path parameter from Vercel dynamic routing, with URL fallback
    const path =
      (req.query?.trpc as string) ||
      req.url?.split("/api/trpc/")[1]?.split("?")[0] ||
      "";

    await nodeHTTPRequestHandler({
      router: appRouter,
      createContext,
      req,
      res,
      path,
    });
  } catch (err: any) {
    console.error("[api/trpc] handler error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          error: "HANDLER_ERROR",
          message: err?.message ?? String(err),
        })
      );
    } else {
      res.end();
    }
  }
}
