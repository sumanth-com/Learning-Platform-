/**
 * Smoke-test Gemini env + provider without printing secrets.
 * Run: node --env-file=.env.local scripts/smoke-ai-mentor.mjs
 */
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const provider = (process.env.AI_MENTOR_PROVIDER || "gemini").toLowerCase();
const model = process.env.AI_MENTOR_MODEL || "gemini-2.5-flash";
const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() || "";

console.log("provider:", provider);
console.log("model:", model);
console.log("keyPresent:", Boolean(key));
console.log("keyLength:", key.length);

if (provider !== "gemini") {
  console.error("FAIL: AI_MENTOR_PROVIDER is not gemini");
  process.exit(1);
}
if (!key) {
  console.error("FAIL: GOOGLE_GENERATIVE_AI_API_KEY missing");
  process.exit(1);
}

const google = createGoogleGenerativeAI({ apiKey: key });
let text = "";
try {
  const result = streamText({
    model: google(model),
    system: "Reply in one short sentence.",
    messages: [{ role: "user", content: "Say hello to SupraLearn in 5 words." }],
    temperature: 0.2,
  });
  for await (const chunk of result.textStream) {
    text += chunk;
  }
  console.log("streamChars:", text.length);
  console.log("streamPreview:", text.slice(0, 80).replace(/\n/g, " "));
  if (!text.trim()) {
    console.error("FAIL: empty response");
    process.exit(1);
  }
  console.log("PASS: Gemini streaming works");
} catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error("FAIL:", msg.slice(0, 240));
  process.exit(1);
}
