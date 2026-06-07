import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for study answers
app.post("/api/generate", async (req: express.Request, res: express.Response) => {
  try {
    const { question, category, tone } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "A valid question string is required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = 
      "You are AIRA Education's AI Study Assistant. Your goal is to guide students with clear, structured, and highly readable academic explanations.\n" +
      "Format your response beautifully with Markdown. Include bolding for key words, headers, blockquotes, bullet points, or bullet numbered steps. Avoid long, dense blocks of raw paragraph text.\n\n" +
      "Use the following structure for your response:\n" +
      "### 💡 Core Summary\n" +
      "Provide a clear, high-level summary of the answer in 2-3 sentences.\n\n" +
      "### 🔍 Detailed Concept Breakdown\n" +
      "Break down the topic into logical points, definitions, or steps using bullet lists.\n\n" +
      "### 🌟 Simple Analogy\n" +
      "Give a simple real-world analogy to make this complex topic intuitive and easy to remember.\n\n" +
      "### ⚡ Quick Recall QA\n" +
      "Provide 1-2 interactive reflection questions or fill-in-the-blanks with the answers placed at the bottom so the student can self-test.\n" +
      `Focus Category context (if helpful): ${category || "General Studies"}.\n` +
      `Tone & Interaction Style: ${tone || "Highly encouraging, educational, and direct"}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Express /api/generate Route Error:", error);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred while communicating with the AI service." 
    });
  }
});

// Configure Vite or Static Files Middleware
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

configureApp().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Study Assistant backend listening on http://0.0.0.0:${PORT}`);
  });
});
