import fetch from "node-fetch";

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbze0Q0vWoKQI4DqQEMwOKUKYqREJyqLhUlCt45xRtLEjhikq1PxWsEc4NqjBJ6zT4m7bg/exec";

export default async function handler(req, res) {
  // 1️⃣ Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).send("");
  }

  // 2️⃣ Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    console.log("Received body:", req.body);

    // 3️⃣ Convert JSON body to URL-encoded form
    const formBody = Object.entries(req.body)
      .map(([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(typeof value === "object" ? JSON.stringify(value) : value)}`
      )
      .join("&");

    // 4️⃣ Send to Apps Script
    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody
    });

    const text = await response.text();

    // 5️⃣ Return Apps Script response directly
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(text);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ result: "error", message: err.message });
  }
}
