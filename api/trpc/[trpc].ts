// Disable default body parser so Vercel does not pre-parse the stream,
// which prevents nodeHTTPRequestHandler from hanging.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  try {
    // Dynamic imports so a module-init failure surfaces as a readable
    // response instead of an opaque FUNCTION_INVOCATION_FAILED.
    const [{ nodeHTTPRequestHandler }, { appRouter }, { createContext }] = await Promise.all([
      import("@trpc/server/adapters/node-http"),
      import("../../server/routers"),
      import("../../server/_core/context"),
    ]);

    // Extract the trpc path parameter provided by Vercel dynamic routing,
    // falling back to parsing the URL directly.
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
          stack: err?.stack,
        })
      );
    } else {
      res.end();
    }
  }
}
