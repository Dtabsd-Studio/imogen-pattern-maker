# IMOGEN AI STUDIO Setup Guide

## Required API Keys & Services

### 1. Gemini API Key Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy your API key
4. Update `.env.local` with: `VITE_GEMINI_API_KEY=your_actual_api_key_here`

### 2. Firebase Project Setup
Your Firebase config is already set up for `imogen-ai-studio` project:
- Project ID: `imogen-ai-studio`
- Storage Bucket: `imogen-ai-studio.firebasestorage.app`

Make sure these services are enabled in your Firebase console:
- Authentication
- Firestore Database
- Cloud Storage
- Analytics (optional)

### 3. reCAPTCHA Setup
Your reCAPTCHA site key is already configured:
- Site Key: `6Lf_vIUrAAAAAKZ3TJ2G_1ZO1oSavIgcLzFycGY6`

## Environment Variables

Update your `.env.local` file with your actual API keys:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## Current Limitations & Next Steps

### Image Generation
- Currently using SVG placeholders based on prompts
- **TO INTEGRATE**: Connect to actual image generation service:
  - Google's Imagen API via Vertex AI
  - OpenAI DALL-E API
  - Stable Diffusion API
  - Midjourney API

### Background Removal
- Currently using Gemini Vision for analysis + SVG recreation
- **TO IMPROVE**: Integrate dedicated background removal:
  - remove.bg API
  - Adobe Photoshop API
  - Custom ML models

### Vertex AI Studio Integration
Ready for training custom models:
1. Upload your pattern datasets
2. Fine-tune models for your specific use cases
3. Replace placeholder functions with trained model endpoints

## Testing the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test basic functionality:
   - Create a new pattern project
   - Generate an image (will create SVG placeholder)
   - Try background removal (will analyze and recreate)
   - Test crest generation with uploaded images

3. Check console for API responses and errors

## Deployment Ready Features

✅ **Working Components:**
- Project workflow management
- Layer system with image and procedural patterns
- Crest generation with custom text
- Canvas rendering and download
- Responsive UI with Tailwind CSS

✅ **Stable Integrations:**
- Firebase configuration
- Environment variable management
- TypeScript types and error handling
- Build system optimization

🔄 **Ready for API Integration:**
- Gemini API structure in place
- Error handling and fallbacks
- Placeholder functions ready to replace

## Performance Optimizations

✅ **Memory Management:**
- SVG-based graphics (lightweight)
- Lazy loading of components
- Efficient React state management
- Minimal re-renders with proper dependencies

✅ **Build Optimization:**
- Tree-shaking enabled
- Code splitting ready
- Asset optimization
- Production build tested 