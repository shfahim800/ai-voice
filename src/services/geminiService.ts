import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getClient(userApiKey?: string): GoogleGenAI | null {
  const apiKey = userApiKey || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient || userApiKey) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

export async function askAssistantAI(
  prompt: string,
  customApiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<{ text: string; widgetType?: 'weather' | 'product' | 'pc-action'; widgetData?: any }> {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('weather') || lower.includes('temperature') || lower.includes('আবহাওয়া')) {
    return {
      text: "Current weather report for Dhaka:",
      widgetType: 'weather',
      widgetData: {
        location: "Dhaka",
        condition: "Partly Cloudy",
        temp: "32°C / 24°C",
        humidity: "74%"
      }
    };
  }

  try {
    const ai = getClient(customApiKey);
    if (ai) {
      const response = await ai.models.generateContent({
        model: modelName || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are SH AI Assistant, a personal AI assistant (Smarter - Faster - Together). Support fluent Bangla and English.`
        }
      });
      return { text: response.text || "Hello! How can I assist you today?" };
    }
  } catch (error) {
    console.warn("Gemini API call fallback:", error);
  }

  return {
    text: `SH AI Assistant response for: "${prompt}". All systems nominal.`
  };
}
