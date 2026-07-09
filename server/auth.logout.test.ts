import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; headers: Map<string, unknown> } {
  const headers = new Map<string, unknown>();

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      getHeader: (name: string) => headers.get(name.toLowerCase()),
      setHeader: (name: string, value: unknown) => {
        headers.set(name.toLowerCase(), value);
      },
    } as unknown as TrpcContext["res"],
  };

  return { ctx, headers };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, headers } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    const setCookie = headers.get("set-cookie") as string[];
    expect(setCookie).toHaveLength(1);
    const cookie = setCookie[0]!;
    expect(cookie.startsWith(`${COOKIE_NAME}=`)).toBe(true);
    // Cleared via epoch expiry, secure attributes preserved
    expect(cookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=None");
    expect(cookie).toContain("Path=/");
  });
});
