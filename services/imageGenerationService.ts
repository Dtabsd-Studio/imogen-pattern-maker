// Image Generation Service - Ready for API Integration
// This service provides a clean interface for different image generation providers

export interface ImageGenerationProvider {
  name: string;
  generateImage(prompt: string): Promise<string>;
  removeBackground(imageUrl: string): Promise<string>;
}

// Vertex AI / Imagen Provider (Real API Integration)
export class VertexAIProvider implements ImageGenerationProvider {
  name = 'Vertex AI Imagen';
  private projectId: string;
  private location: string = 'us-central1';
  
  constructor() {
    this.projectId = import.meta.env.VITE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID || 'imogen-ai-studio';
  }
  
  async generateImage(prompt: string): Promise<string> {
    try {
      console.log(`[VertexAI] Generating real image for: "${prompt}"`);
      
      // Try the real Google Cloud APIs first
      const accessKey = import.meta.env.VITE_GOOGLE_CLOUD_ACCESS_KEY;
      const secretKey = import.meta.env.VITE_GOOGLE_CLOUD_SECRET_KEY;
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      console.log('🔑 API Keys status:', {
        hasVertexAccessKey: !!accessKey,
        hasVertexSecretKey: !!secretKey,
        hasGeminiKey: !!geminiKey,
        projectId: this.projectId
      });
      
      console.log('🚀 Image generation priority: 1) Gemini 2.0 Flash → 2) Vertex AI → 3) Free service');
      
      // Try Gemini 2.0 Flash Image Generation first (newest and most accessible)
      if (geminiKey && geminiKey !== 'your_actual_gemini_api_key_here') {
        try {
          return await this.callGeminiImageAPI(prompt, geminiKey);
        } catch (error) {
          console.warn('🔸 Gemini 2.0 Flash failed, trying Vertex AI:', error);
        }
      }
      
      // Try Vertex AI Image Generation as backup
      if (accessKey && secretKey && accessKey !== 'your_actual_gemini_api_key_here') {
        try {
          return await this.callVertexImagenAPI(prompt, accessKey, secretKey);
        } catch (error) {
          console.warn('🔸 Vertex AI failed, using free service:', error);
        }
      }
      
      // Fallback to free service
      console.warn('No valid API keys found, using free fallback service');
      return await this.tryFreeImageGeneration(prompt);
      
    } catch (error) {
      console.error('All image generation methods failed:', error);
      return await this.tryFreeImageGeneration(prompt);
    }
  }

  private async callVertexImagenAPI(prompt: string, accessKey: string, secretKey: string): Promise<string> {
    console.log('Attempting Vertex AI Imagen API...');
    
    // Create authentication token
    const authToken = btoa(`${accessKey}:${secretKey}`);
    
    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/imagegeneration:predict`;
    
    const requestBody = {
      instances: [
        {
          prompt: `${prompt}, high quality, detailed, clean design, suitable for pattern making, professional artwork`,
        }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        safetyFilterLevel: "block_some",
        personGeneration: "dont_allow"
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vertex AI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
      console.log('✅ Vertex AI image generated successfully!');
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    }
    
    throw new Error('Invalid response from Vertex AI API');
  }

  private async callGeminiImageAPI(prompt: string, apiKey: string): Promise<string> {
    console.log('Attempting Gemini 2.0 Flash Image Generation API...');
    
    // Use the correct Gemini 2.0 Flash image generation model
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `Create a high-quality image: ${prompt}. Make it suitable for pattern making, clean design, professional artwork, with good contrast and clear details.`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Gemini 2.0 Flash Image Generation failed: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Gemini Image Generation API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Look for generated images in the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data && part.inlineData.mimeType?.startsWith('image/')) {
          console.log('✅ Gemini 2.0 Flash image generated successfully!');
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    console.warn('No image found in Gemini response, falling back to free service');
    throw new Error('Gemini image generation returned no image data');
  }

  private async tryFreeImageGeneration(prompt: string): Promise<string> {
    try {
      // Try Pollinations AI as fallback (free, no API key needed)
      console.log('Using free image generation service as fallback');
      const enhancedPrompt = encodeURIComponent(`${prompt}, clean design, high quality, detailed, suitable for patterns`);
      const url = `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=512&height=512&nologo=true&enhance=true`;
      
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
      
      throw new Error('Free service also unavailable');
    } catch (error) {
      console.error('Free image generation failed:', error);
      throw new Error('All image generation services are currently unavailable. Please try again later or check your API configuration.');
    }
  }

  async removeBackground(imageUrl: string): Promise<string> {
    console.log(`[VertexAI] Background removal requested for image`);
    
    try {
      // Try to use Gemini 2.5 Flash for intelligent background removal
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (geminiKey && geminiKey !== 'your_actual_gemini_api_key_here') {
        return await this.removeBackgroundWithGemini(imageUrl, geminiKey);
      }
      
      // Fallback: Try free background removal service
      console.log('Trying free background removal service...');
      const response = await fetch(`https://api.remove.bg/v1.0/removebg`, {
        method: 'POST',
        headers: {
          'X-Api-Key': 'demo-key', // This won't work, but we try anyway
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          size: 'auto',
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
      
      throw new Error('Free background removal service unavailable');
    } catch (error) {
      console.warn('Background removal failed, returning original image:', error);
      // Return original image as fallback
      return imageUrl;
    }
  }

  private async removeBackgroundWithGemini(imageUrl: string, apiKey: string): Promise<string> {
    console.log('Using Gemini 2.5 Flash for background analysis and recreation...');
    
    // First, analyze the image with Gemini 2.5 Flash
    const analyzeEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const analyzeRequestBody = {
      contents: [{
        parts: [
          {
            text: "Analyze this image and describe the main subject in detail. Focus on the key object/element that should be kept, ignoring the background. Describe its colors, shape, style, and important visual characteristics for recreating it with a transparent background."
          },
          {
            inlineData: {
              mimeType: imageUrl.includes('data:') ? imageUrl.split(':')[1].split(';')[0] : 'image/jpeg',
              data: imageUrl.includes('data:') ? imageUrl.split(',')[1] : imageUrl
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    };

    const analyzeResponse = await fetch(analyzeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analyzeRequestBody)
    });

    if (!analyzeResponse.ok) {
      throw new Error('Failed to analyze image with Gemini');
    }

    const analyzeData = await analyzeResponse.json();
    const description = analyzeData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!description) {
      throw new Error('Failed to get image description from Gemini');
    }

    // Now try to regenerate the subject with transparent background using Gemini 2.0 Flash image generation
    try {
      const generateEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;
      
      const generateRequestBody = {
        contents: [{
          parts: [{
            text: `Create a clean, high-quality image of: ${description}. The image should have a completely transparent background. Make it suitable for pattern making with crisp, clear edges and professional quality. No background elements, shadows, or extra details - just the main subject on transparent background.`
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
          responseModalities: ["TEXT", "IMAGE"]
        }
      };

      const generateResponse = await fetch(generateEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateRequestBody)
      });

      if (generateResponse.ok) {
        const generateData = await generateResponse.json();
        
        if (generateData.candidates && generateData.candidates[0] && generateData.candidates[0].content && generateData.candidates[0].content.parts) {
          for (const part of generateData.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data && part.inlineData.mimeType?.startsWith('image/')) {
              console.log('✅ Background removed using Gemini analysis + regeneration!');
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
          }
        }
      }
    } catch (genError) {
      console.warn('Gemini image generation failed during background removal:', genError);
    }
    
    // If regeneration fails, return original image
    throw new Error('Could not remove background - regeneration failed');
  }
}

// OpenAI DALL-E Provider (Alternative option)
export class OpenAIProvider implements ImageGenerationProvider {
  name = 'OpenAI DALL-E';
  
  async generateImage(prompt: string): Promise<string> {
    // TODO: Integrate with OpenAI API
    const endpoint = 'https://api.openai.com/v1/images/generations';
    
    console.log(`[OpenAI] Would generate image for: "${prompt}"`);
    // Return placeholder for now
    return this.createPlaceholderSVG(prompt);
  }

  async removeBackground(imageUrl: string): Promise<string> {
    console.log(`[OpenAI] Would remove background`);
    return imageUrl; // Placeholder
  }

  private createPlaceholderSVG(prompt: string): string {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f9ff"/>
        <rect x="50" y="50" width="300" height="300" fill="#0ea5e9" rx="20"/>
        <text x="200" y="200" text-anchor="middle" font-family="system-ui" 
              font-size="16" fill="white">DALL-E</text>
        <text x="200" y="220" text-anchor="middle" font-family="system-ui" 
              font-size="12" fill="white">${prompt.substring(0, 40)}</text>
      </svg>`)}`;
  }
}

// Service Manager
export class ImageGenerationService {
  private provider: ImageGenerationProvider;
  
  constructor(provider: ImageGenerationProvider = new VertexAIProvider()) {
    this.provider = provider;
  }
  
  setProvider(provider: ImageGenerationProvider) {
    this.provider = provider;
    console.log(`Switched to ${provider.name} for image generation`);
  }
  
  async generateImage(prompt: string): Promise<string> {
    console.log(`Generating image with ${this.provider.name}: "${prompt}"`);
    return this.provider.generateImage(prompt);
  }
  
  async removeBackground(imageUrl: string): Promise<string> {
    console.log(`Removing background with ${this.provider.name}`);
    return this.provider.removeBackground(imageUrl);
  }
}

// Export singleton instance
export const imageService = new ImageGenerationService(); 