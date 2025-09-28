export default async function handler(req, res) {
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyrj-C-scbx7i2dJoNNCOyvP539uS-yGYhMW1TQLhwFZGONxzIng_BPAqyxS4pl72EJJQ/exec"; // replace

  if (req.method === "OPTIONS") {
    // Handle CORS preflight
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Convert JSON body to URLSearchParams for Apps Script
    const params = new URLSearchParams(req.body);

    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const text = await response.text(); // Apps Script returns HTML
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
