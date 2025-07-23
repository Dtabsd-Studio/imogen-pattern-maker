# Environment Variables Setup Guide

## 🚨 SECURITY ALERT: API Keys Exposed!

Your Gemini API key was exposed through GitHub, which is why Google detected it. Here's how to fix it:

## Step 1: Get a New Gemini API Key

1. **Go to Google AI Studio:** https://aistudio.google.com/apikey
2. **Click "Create API key"** 
3. **Copy the new key** (it looks like: `AIza...`)
4. **Revoke the old key** (if you can find it in the console)

## Step 2: Update Your Local Environment

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your real values:**
   ```bash
   # Replace YOUR_NEW_GEMINI_API_KEY_HERE with your actual key
   VITE_GEMINI_API_KEY=AIza...your_actual_key_here
   ```

3. **Never commit `.env` to git** (it's already in `.gitignore`)

## Step 3: Set Up Firebase Hosting Environment

For Firebase Hosting, you need to set environment variables in GitHub Actions:

1. **Go to your GitHub repository:** https://github.com/Dtabsd-Studio/imogen-pattern-maker
2. **Go to Settings → Secrets and variables → Actions**
3. **Add these Repository Secrets:**
   - `VITE_GEMINI_API_KEY` = your new Gemini API key
   - `VITE_FIREBASE_API_KEY` = your Firebase API key
   - (Add other secrets as needed)

## Step 4: Test Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test that Gemini API works
# Check browser console for any API errors
```

## Step 5: Deploy with New Key

```bash
# Build and deploy
npm run build
firebase deploy --only hosting
```

## 🔒 Security Best Practices

- ✅ Keep `.env` in `.gitignore`
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use different keys for development vs production
- ✅ Regularly rotate API keys
- ❌ Never commit API keys to git
- ❌ Never share API keys in chat/email
- ❌ Never hardcode API keys in code

## Current Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_GEMINI_API_KEY` | Gemini AI API access | ✅ |
| `VITE_FIREBASE_API_KEY` | Firebase authentication | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `VITE_STRIPE_API_KEY` | Stripe payments | 🔄 Optional |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA verification | 🔄 Optional |

## Troubleshooting

### "API key not valid" error:
- Make sure you copied the full key
- Check that the key is for the correct Google project
- Verify the key has Gemini API access enabled

### Environment variables not loading:
- Make sure your `.env` file is in the project root
- Restart your development server after changing `.env`
- Check that variable names start with `VITE_`

### Deployment issues:
- Verify GitHub Secrets are set correctly
- Check build logs for environment variable errors
- Make sure all required variables are set 