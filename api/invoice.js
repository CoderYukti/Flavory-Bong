import fetch from "node-fetch";

export default async function handler(req, res) {
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyI-XsEIekyrKiXdsRL9wDDNe4gARCdzdGde50nEuZPhtpuU3B3M5B5E2iCylVvVhQJhA/exec";

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // Convert JSON body to URLSearchParams for Apps Script
    const params = new URLSearchParams();
    for (const key in req.body) {
      if (typeof req.body[key] === "object") {
        params.append(key, JSON.stringify(req.body[key])); // stringify objects/arrays
      } else {
        params.append(key, req.body[key]);
      }
    }

    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const text = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(text);

  } catch (err) {
    return res.status(500).json({ result: "error", message: err.message });
  }
}
