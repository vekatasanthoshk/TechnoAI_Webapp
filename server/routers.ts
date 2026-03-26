import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createContactSubmission, getAllContactSubmissions, deleteContactSubmission } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
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
        try {
          await createContactSubmission(input);
        } catch (err) {
          // Log but don't fail the user if DB is unavailable in dev
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
