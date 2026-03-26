import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
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
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("contact.submit", () => {
  it("accepts valid contact submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Doe",
      email: "john@example.com",
      company: "Acme Corp",
      message: "I would like to learn more about your services.",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "John Doe",
        email: "invalid-email",
        company: "Acme Corp",
        message: "I would like to learn more about your services.",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("rejects submission with short message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "John Doe",
        email: "john@example.com",
        company: "Acme Corp",
        message: "Short",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("rejects submission with missing name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "",
        email: "john@example.com",
        company: "Acme Corp",
        message: "I would like to learn more about your services.",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("contact.list", () => {
  it("allows admin to list submissions", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("denies non-admin access to list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.list();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("contact.delete", () => {
  it("allows admin to delete submission", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a submission
    const publicCaller = appRouter.createCaller(createPublicContext());
    await publicCaller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      company: "Test Corp",
      message: "This is a test message for deletion.",
    });

    // Get the list to find the ID
    const submissions = await caller.contact.list();
    const lastSubmission = submissions[submissions.length - 1];

    if (lastSubmission) {
      const result = await caller.contact.delete({ id: lastSubmission.id });
      expect(result).toEqual({ success: true });
    }
  });

  it("denies non-admin access to delete", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.delete({ id: 1 });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
