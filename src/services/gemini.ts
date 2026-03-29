import { GoogleGenAI, Modality, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set in the environment.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const MODELS = {
  TEXT: "gemini-3-flash-preview",
  IMAGE: "gemini-2.5-flash-image",
  VISION: "gemini-3-flash-preview",
};

export async function generateText(prompt: string, systemInstruction?: string) {
  const response = await ai.models.generateContent({
    model: MODELS.TEXT,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text;
}

export async function generateImage(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") {
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE,
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio,
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned");
}

export async function analyzeImage(prompt: string, base64Image: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: MODELS.VISION,
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Image.split(",")[1],
            mimeType,
          },
        },
      ],
    },
  });
  return response.text;
}
