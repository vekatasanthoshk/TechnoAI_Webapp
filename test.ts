import "dotenv/config";
import { appRouter } from "./server/routers";
import { TRPCError } from "@trpc/server";

async function runTests() {
  console.log("--- Starting Tests ---");

  // Mock Request/Response objects
  const req = { headers: {} };
  const res = {
    cookie: (name: string, value: string, options: any) => {
      console.log(`[Mock Res] Setting Cookie: ${name} = [HIDDEN_TOKEN]`);
    }
  };

  const unauthCaller = appRouter.createCaller({ req: req as any, res: res as any, user: null });

  // 1. Test Form Submission
  console.log("\n[1] Testing Form Submission...");
  try {
    const submitResult = await unauthCaller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      company: "Test Company",
      message: "This is a test message from the automated script."
    });
    console.log("✅ Form submitted successfully:", submitResult);
  } catch (err) {
    console.error("❌ Form submission failed:", err);
  }

  // 2. Test Admin Login
  console.log("\n[2] Testing Admin Login...");
  try {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";
    const loginResult = await unauthCaller.auth.loginAdmin({ password: adminPassword });
    console.log("✅ Admin login successful:", loginResult);
  } catch (err) {
    console.error("❌ Admin login failed:", err);
  }

  // 3. Test Protected Route (Unauthorized)
  console.log("\n[3] Testing Protected Route (Without Session)...");
  try {
    await unauthCaller.contact.list();
    console.error("❌ FAIL: Was able to fetch contacts without a session!");
  } catch (err) {
    if (err instanceof TRPCError && err.code === "UNAUTHORIZED") {
      console.log("✅ Access properly blocked with UNAUTHORIZED.");
    } else {
      console.error("❌ Unexpected error:", err);
    }
  }

  // 4. Test Protected Route (Authorized)
  console.log("\n[4] Testing Protected Route (With Admin Session)...");
  const authCaller = appRouter.createCaller({
    req: req as any,
    res: res as any,
    user: {
      id: 1,
      openId: "admin",
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
      loginMethod: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date()
    }
  });

  try {
    const contacts = await authCaller.contact.list();
    console.log(`✅ Successfully fetched ${contacts.length} contacts.`);
    if (contacts.length > 0) {
      console.log("   Latest contact:", contacts[0]);
    }
  } catch (err) {
    console.error("❌ Failed to fetch contacts with admin session:", err);
  }

  console.log("\n--- Tests Complete ---");
}

runTests().catch(console.error);
