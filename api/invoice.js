import fetch from "node-fetch";

export default async function handler(req, res) {
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxKvUEkUSM5Rx0c8QzM3QvkQdxCmOsv8nNJUzreUWOCPH3srVgoJFlqLEIwUgOQbur0_w/exec"; // Replace with your Apps Script URL

  if (req.method === "OPTIONS") {
    // Handle CORS preflight
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).send("");
  }

  if (req.method === "POST") {
    try {
      // Convert body to URLSearchParams (form-encoded)
      const params = new URLSearchParams(req.body);

      const response = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      });

      const text = await response.text(); // Apps Script returns JSON text
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).send(text);

    } catch (err) {
      return res.status(500).json({ result: "error", message: err.message });
    }
  }

  return res.status(405).send("Method Not Allowed");
}
