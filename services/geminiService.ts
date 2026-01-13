
import { GoogleGenAI, Type } from "@google/genai";
import { MedicineInfo } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const MEDICINE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    brandName: { type: Type.STRING },
    genericName: { type: Type.STRING },
    activeIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    indications: { type: Type.STRING },
    dosageInstructions: { type: Type.STRING },
    sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
    genericAlternatives: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          priceRange: { type: Type.STRING, description: "Estimated retail price range (e.g. '$15 - $30')" }
        },
        required: ['name', 'priceRange']
      } 
    },
    fdaStatus: { type: Type.STRING }
  },
  required: ['name', 'brandName', 'genericName', 'activeIngredients', 'indications', 'dosageInstructions', 'sideEffects', 'genericAlternatives', 'fdaStatus']
};

export const scanMedicineLabel = async (base64Image: string): Promise<MedicineInfo> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Analyze this medicine label or prescription. Extract the medicine name, dosage, and details. Then, search for generic alternatives that are FDA approved. For each alternative, provide an estimated retail price range. Return the data in structured JSON format." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: MEDICINE_SCHEMA,
      tools: [{ googleSearch: {} }]
    }
  });

  return JSON.parse(response.text || '{}');
};

export const searchGenericAlternatives = async (query: string): Promise<MedicineInfo> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find FDA-approved generic alternatives for the drug: ${query}. Include full details about the drug, its indications, side effects, and a list of generic versions with their estimated retail price ranges.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: MEDICINE_SCHEMA,
      tools: [{ googleSearch: {} }]
    }
  });

  return JSON.parse(response.text || '{}');
};

export const translateMedicineInfo = async (info: MedicineInfo, targetLanguage: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following medicine information into ${targetLanguage}. Ensure medical terms are accurate and the tone is helpful.
    Medicine: ${info.name}
    Instructions: ${info.dosageInstructions}
    Indications: ${info.indications}
    Side Effects: ${info.sideEffects.join(', ')}`,
  });

  return response.text || "Translation failed.";
};
