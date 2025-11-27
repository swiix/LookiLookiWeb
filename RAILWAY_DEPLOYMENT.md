# Railway Deployment Guide for Looki Looki

## Prerequisites
1. Create a free account at [railway.app](https://railway.app)
2. Install Railway CLI (optional): `npm i -g @railway/cli`

## Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git push -u origin main
   ```

2. **Go to Railway Dashboard**:
   - Visit [railway.app/new](https://railway.app/new)
   - Click "Deploy from GitHub repo"
   - Select your repository: `swiix/LookiLookiWeb`

3. **Railway will auto-detect** the configuration from `railway.json`

4. **Add Environment Variables** (if needed):
   - Click on your service
   - Go to "Variables" tab
   - Add `NODE_ENV=production`

5. **Deploy**:
   - Railway will automatically build and deploy
   - You'll get a public URL like `https://your-app.up.railway.app`

### Option 2: Deploy via CLI

1. **Login to Railway**:
   ```bash
   railway login
   ```

2. **Initialize project**:
   ```bash
   railway init
   ```

3. **Deploy**:
   ```bash
   railway up
   ```

4. **Open your app**:
   ```bash
   railway open
   ```

## Important Notes

- **Custom Server**: This app uses a custom Socket.io server, which is why Railway is needed (Vercel doesn't support this)
- **Port**: Railway automatically assigns a `PORT` environment variable. The server is configured to use `process.env.PORT || 3000`
- **WebSockets**: Railway supports WebSocket connections out of the box
- **Build Command**: `npm run build` (Next.js build)
- **Start Command**: `npm run server` (starts both Next.js and Socket.io)

## Troubleshooting

If deployment fails:
1. Check Railway logs in the dashboard
2. Ensure all dependencies are in `package.json`
3. Verify `railway.json` configuration
4. Make sure `server.ts` is committed to git

## Testing Your Deployment

1. Visit your Railway URL
2. Click "Start Session" to create a room
3. Share the room URL with another device/browser
4. Test video, audio, chat, and timer features

## Cost

Railway offers:
- **Free tier**: $5 credit/month (usually enough for development)
- **Pro plan**: $20/month for production apps
