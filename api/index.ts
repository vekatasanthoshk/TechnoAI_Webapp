import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

try {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Catch-all error handler to prevent Vercel's generic HTML error page
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Express Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message, stack: err.stack });
  });

  // Catch-all 404 handler so frontend gets JSON instead of HTML
  app.use((req, res) => {
    res.status(404).json({ 
      error: "Not Found", 
      url: req.url, 
      originalUrl: req.originalUrl,
      path: req.path
    });
  });
} catch (err: any) {
  console.error("Initialization Error:", err);
  app.use((req, res) => res.status(500).json({ error: "Initialization Error", message: err.message }));
}

export default app;
