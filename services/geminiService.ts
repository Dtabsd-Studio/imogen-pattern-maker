import { GoogleGenerativeAI } from "@google/generative-ai";
import { imageService } from './imageGenerationService';

// Initialize the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY environment variable not set. The application will not be able to generate AI images.");
}

const ai = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Helper to convert a base64 data URL to a GenerativePart object
const fileToGenerativePart = (dataUrl: string) => {
  const mimeType = dataUrl.split(':')[1].split(';')[0];
  const base64Data = dataUrl.split(',')[1];
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    // Enhanced prompt for better pattern generation
    const enhancedPrompt = `A single, clean, simple styled icon of ${prompt}, centered, on a fully transparent background. The entire subject must be fully visible within the frame, not touching any edges. The design should be easily tileable for a repeating pattern. No shadows or extra elements.`;
    
    // Use the modular image generation service
    return await imageService.generateImage(enhancedPrompt);
  } catch (error: any) {
    console.error("Error generating image:", error);
    const message = error.message?.includes('API key') 
      ? "Invalid or missing API Key." 
      : "Failed to generate image. Please check the console for details.";
    throw new Error(message);
  }
};

export const removeBackgroundFromImage = async (imageUrl: string): Promise<string> => {
    try {
        // Use the modular image generation service for background removal
        return await imageService.removeBackground(imageUrl);
    } catch (error: any) {
        console.error("Error in background removal process:", error);
        throw new Error("Failed to remove background. Please try again or use a different image.");
    }
};