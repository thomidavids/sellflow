// Serverless function (Vercel/Netlify-style Node function).
// Keeps the Anthropic API key on the server — it is never sent to the browser.
// Requires the environment variable ANTHROPIC_API_KEY to be set in your
// hosting provider's dashboard (see README.md).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY. Add it in your hosting provider's environment variables." });
    return;
  }

  try {
    const { system, message } = req.body || {};
    if (!message) {
      res.status(400).json({ error: "Missing 'message' in request body." });
      return;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: system || "",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: `Anthropic API error: ${errText}` });
      return;
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .filter(Boolean)
      .join("\n");

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown server error" });
  }
}
