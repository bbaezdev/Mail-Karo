import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// 🔒 GLOBAL COOLDOWN (ADDED)
let lastQualityCheckTime = 0;
const QUALITY_COOLDOWN_MS = 5000;

router.post('/quality-check', async (req, res) => {
  try {
    const now = Date.now();
    if (now - lastQualityCheckTime < QUALITY_COOLDOWN_MS) {
      return res.json(
        fallbackReport("AI rate limit reached. Please wait a few seconds.")
      );
    }
    lastQualityCheckTime = now;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json(fallbackReport("Server config error"));
    }

    const { email, checkType = "normal" } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
      return res.json(fallbackReport("Email content missing"));
    }

    if (email.length > 6000) {
      return res.json(fallbackReport("Email too long"));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite'
    });

    // 🧠 LIGHTWEIGHT PROMPT (UPDATED)
    const prompt = `
You are an email quality checker.

Mode: ${checkType}

Return ONLY valid JSON.

{
  "score": number,
  "severity": "Low" | "Medium" | "High",
  "summary": string,
  "grammar": string,
  "clarity": string,
  "tone": string,
  "risk": string,
  "suggestions": string,
  "improvedEmail": string
}

Rules:
- Keep values short
- score 0–100
- If not advanced, improvedEmail = ""

Email:
"""${email}"""
`.trim();

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let parsed;
    try {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON found");
      parsed = JSON.parse(match[0]);
    } catch (e) {
      console.error("❌ Gemini JSON error:", rawText);
      return res.json(fallbackReport("AI response issue"));
    }

    const score = Number(parsed.score) || 0;

    return res.json({
      score,
      severity:
        parsed.severity ||
        (score >= 80 ? "Low" : score >= 60 ? "Medium" : "High"),
      summary: parsed.summary || "No summary provided.",
      grammar: parsed.grammar || "N/A",
      clarity: parsed.clarity || "N/A",
      tone: parsed.tone || "N/A",
      risk: parsed.risk || "N/A",
      suggestions: parsed.suggestions || "",
      improvedEmail:
        checkType === "advanced" ? parsed.improvedEmail || "" : ""
    });

  } catch (err) {
    console.error("🔥 Quality check failed:", err?.message);
    return res.json(fallbackReport("AI service temporarily unavailable"));
  }
});

function fallbackReport(reason) {
  return {
    score: 0,
    severity: "High",
    summary: `Unable to analyze email (${reason}).`,
    grammar: "N/A",
    clarity: "N/A",
    tone: "N/A",
    risk: "N/A",
    suggestions: "",
    improvedEmail: ""
  };
}

export default router;
