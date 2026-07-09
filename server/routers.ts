import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions, setSessionCookie } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createContactSubmission, getAllContactSubmissions, deleteContactSubmission } from "./db";
import { SignJWT } from "jose";
import { ENV } from "./_core/env";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    loginAdmin: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const adminPass = process.env.ADMIN_PASSWORD || "admin";
        if (input.password !== adminPass) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid password" });
        }
        
        const secret = new TextEncoder().encode(ENV.cookieSecret || "fallback-secret");
        const token = await new SignJWT({ role: "admin", openId: "admin" })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("1y")
          .sign(secret);
          
        const cookieOptions = getSessionCookieOptions(ctx.req);
        // maxAge is in seconds for raw Set-Cookie headers
        setSessionCookie(ctx.res, COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS / 1000,
        });

        return { success: true };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      setSessionCookie(ctx.res, COOKIE_NAME, "", { ...cookieOptions, expires: new Date(0) });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email address"),
          company: z.string().min(1, "Company is required"),
          message: z.string().min(10, "Message must be at least 10 characters"),
        })
      )
      .mutation(async ({ input }) => {
        // Save to DB strictly without emails
        try {
          await createContactSubmission(input);
        } catch (err) {
          console.error("[contact.submit] DB error:", err);
          if (process.env.NODE_ENV === "production") {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save submission. Please try again." });
          }
        }
        return { success: true };
      }),

    list: adminProcedure.query(async () => {
      return await getAllContactSubmissions();
    }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteContactSubmission(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
