import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createContactSubmission, getAllContactSubmissions, deleteContactSubmission } from "./db";
import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_API_KEY || "re_dtdnQ9y4_7swHAxqpD18q7rEbZrLriEbm";
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

async function sendContactEmail(data: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email");
    return;
  }

  const contactEmail = process.env.CONTACT_EMAIL || "technoaikvs@gmail.com";
  if (!contactEmail) {
    console.warn("[email] CONTACT_EMAIL not set — unable to send notification email.");
    return;
  }

  await resend.emails.send({
    from: "TechnoAI Contact <onboarding@resend.dev>",
    to: contactEmail,
    replyTo: data.email,
    subject: `New Contact Form Submission from ${data.name} — ${data.company}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8faff;border-radius:8px;">
        <div style="background:linear-gradient(135deg,#2962FF,#00C8B3);padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">New Contact Form Submission</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">KVS TechnoAI LLC Website</p>
        </div>
        <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e8ff;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f4ff;color:#5a6a9a;font-size:13px;width:100px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f4ff;font-weight:600;color:#0d1b3e;">${data.name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f4ff;color:#5a6a9a;font-size:13px;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f4ff;color:#2962FF;"><a href="mailto:${data.email}" style="color:#2962FF;">${data.email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0f4ff;color:#5a6a9a;font-size:13px;">Company</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f4ff;color:#0d1b3e;">${data.company}</td></tr>
            <tr><td style="padding:10px 0;color:#5a6a9a;font-size:13px;vertical-align:top;">Message</td>
                <td style="padding:10px 0;color:#0d1b3e;white-space:pre-wrap;">${data.message}</td></tr>
          </table>
          <p style="margin:20px 0 0;font-size:12px;color:#8a9abf;">Reply directly to this email to respond to ${data.name}.</p>
        </div>
      </div>
    `,
  });
}

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
        // Save to DB (graceful fail in dev without DB)
        try {
          await createContactSubmission(input);
        } catch (err) {
          console.error("[contact.submit] DB error:", err);
          if (process.env.NODE_ENV === "production") {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save submission. Please try again." });
          }
        }
        // Send notification email
        try {
          await sendContactEmail(input);
        } catch (err) {
          console.error("[contact.submit] Email error:", err);
          // Don't fail the request if email fails
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
