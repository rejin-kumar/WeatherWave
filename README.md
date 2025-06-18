# WeatherWave

A modern weather application with real-time weather data and forecasts.

## Environment Variables

### Server (Render)
Create the following environment variables in your Render dashboard:
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
- `NODE_ENV`: Set to `production`

### Client (Vercel)
Create the following environment variables in your Vercel dashboard:
- `VITE_API_BASE_URL`: Your Render server URL (e.g., `https://weatherwave-a6qq.onrender.com`)

### Local Development
Create a `.env` file in the root directory:
```
OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_API_BASE_URL=http://localhost:5000
```

## Deployment

### Deploy Server to Render
1. Connect your GitHub repository to Render
2. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
3. Add the environment variables listed above

### Deploy Client to Vercel
1. Connect your GitHub repository to Vercel
2. Use the following settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`
3. Add the environment variables listed above

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
``` 