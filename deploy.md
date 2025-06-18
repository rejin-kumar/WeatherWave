# Deployment Guide

## 📋 Pre-deployment Checklist

1. ✅ CORS configuration added to server
2. ✅ Client configured to use environment variables
3. ✅ Configuration files created (render.yaml, vercel.json)
4. ✅ Environment variables documented

## 🚀 Deploy Server to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service" 
3. Connect your GitHub repository
4. Configure service:
   - **Name**: weatherwave-server
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables
In Render dashboard → Environment tab:
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
- `NODE_ENV`: `production`

### Step 4: Deploy
- Click "Create Web Service"
- Note your server URL: `https://your-app-name.onrender.com`

## 🌐 Deploy Client to Vercel

### Step 1: Update CORS (Important!)
In your `server/index.ts`, update the CORS configuration to include your Vercel domain:
```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000', 
  'https://weatherwave-a6qq.onrender.com',
  'https://your-vercel-app.vercel.app' // Add your Vercel domain here
];
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:
- `VITE_API_BASE_URL`: Your Render server URL (e.g., `https://weatherwave-a6qq.onrender.com`)

### Step 4: Deploy
- Click "Deploy"
- Note your client URL: `https://your-vercel-app.vercel.app`

## 🔧 Post-Deployment Steps

1. **Update CORS**: Add your Vercel domain to the CORS allowedOrigins array in server/index.ts
2. **Test API**: Visit `https://your-render-app.onrender.com/api/weather/search?q=london`
3. **Test Client**: Visit your Vercel URL and test weather functionality
4. **Monitor**: Check Render and Vercel dashboards for any errors

## 🚨 Troubleshooting

**CORS Errors:**
- Ensure your Vercel domain is added to allowedOrigins
- Check that API_BASE_URL is correctly set

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed

**API Not Working:**
- Verify OPENWEATHER_API_KEY is set in Render
- Check API endpoint URLs are correct

## 📝 Environment Variables Summary

### Render (Server)
```
OPENWEATHER_API_KEY=your_actual_api_key
NODE_ENV=production
```

### Vercel (Client)
```
VITE_API_BASE_URL=https://your-render-app.onrender.com
```

### Local Development (.env)
```
OPENWEATHER_API_KEY=your_actual_api_key
VITE_API_BASE_URL=http://localhost:5000
``` 