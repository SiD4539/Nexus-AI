
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ResumeData } from '../types';

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string[]> => {
  const ai = getAi();
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 4,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });
  
  return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};

export const generateCsv = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate only CSV data based on the following prompt. Do not include any explanation, titles, or markdown formatting like \`\`\`csv. Just the raw CSV data. Prompt: ${prompt}`,
    });
    return response.text;
};

export const generateCode = async (prompt: string, language: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate a code snippet for the following prompt in ${language}. Only output the code, without any explanation or markdown formatting. Prompt: ${prompt}`,
    });
    return response.text;
};


export const generateResume = async (data: ResumeData): Promise<string> => {
    const ai = getAi();
    const prompt = `
    Generate a professional resume in Markdown format based on the following JSON data.
    Make it well-structured and use professional language.

    Data:
    ${JSON.stringify(data, null, 2)}
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
};

export const generateVideo = async (prompt: string, image?: { data: string; mimeType: string }) => {
  const ai = getAi();
  const imagePayload = image ? { imageBytes: image.data, mimeType: image.mimeType } : undefined;
  
  const operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: imagePayload,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
  return operation;
};

export const pollVideoStatus = async (operation: any) => {
  const ai = getAi();
  return await ai.operations.getVideosOperation({ operation: operation });
};
