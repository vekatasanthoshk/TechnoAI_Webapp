import { appRouter } from "./server/routers";

async function run() {
  try {
    const caller = appRouter.createCaller({ user: undefined } as any);
    await caller.contact.submit({
      name: "Test",
      email: "test@example.com",
      company: "Test Corp",
      message: "This is a test message to verify the new Resend API key configuration."
    });
    console.log("Success! Email sent.");
  } catch (err) {
    console.error("Error testing:", err);
  }
}

run();
