fetch("http://localhost:3000/api/trpc/contact.submit?batch=1", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    "0": {
      json: {
        name: "Test",
        email: "test@example.com",
        company: "Test Corp",
        message: "This is a test message to verify the new Resend API key."
      }
    }
  })
}).then(res => res.json()).then(console.log).catch(console.error);
