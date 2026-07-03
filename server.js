const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// صفحه اصلی
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// چت AI
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// اجرا
app.listen(3000, () => console.log("AI Server running on http://localhost:3000"));
