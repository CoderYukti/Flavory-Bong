import fetch from "node-fetch";

export default async function handler(req, res) {
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyrj-C-scbx7i2dJoNNCOyvP539uS-yGYhMW1TQLhwFZGONxzIng_BPAqyxS4pl72EJJQ/exec"; // replace

  try {
    if (req.method === "POST") {
      // Forward POST request to Google Apps Script
      const response = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Apps Script expects form data
        },
        body: new URLSearchParams(req.body),
      });

      const text = await response.text(); // Apps Script returns HTML output
      res.setHeader("Access-Control-Allow-Origin", "*"); // optional if frontend is same domain
      res.status(200).send(text);

    } else if (req.method === "OPTIONS") {
      // Preflight CORS
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.status(200).send("");
    } else {
      res.status(405).send("Method Not Allowed");
    }

  } catch (err) {
    res.status(500).send(err.message);
  }
}
