import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  let message = req.body.message;

  let response = await fetch("https://api.openai.com/v1/chat/completions", {
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

  let data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("AI Server running"));
