import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { jwtVerify } from "jose";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import { ENV } from "./env";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookies = opts.req.headers.cookie ? parseCookieHeader(opts.req.headers.cookie) : {};
    const token = cookies[COOKIE_NAME];
    if (token) {
      const secret = new TextEncoder().encode(ENV.cookieSecret || "fallback-secret");
      const { payload } = await jwtVerify(token, secret);
      if (payload.role === "admin") {
        user = {
          id: 1,
          openId: "admin",
          name: "Admin",
          email: "admin@example.com",
          role: "admin",
          loginMethod: "password",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date()
        } as User;
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
