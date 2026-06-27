import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http';
import { appRouter } from '../../server/routers';
import { createContext } from '../../server/_core/context';

// Disable default body parser so Vercel does not pre-parse the stream,
// which prevents nodeHTTPRequestHandler from hanging.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  // Extract the trpc path parameter provided by Vercel dynamic routing
  const path = (req.query.trpc as string) || '';

  await nodeHTTPRequestHandler({
    router: appRouter,
    createContext,
    req,
    res,
    path,
  });
}
