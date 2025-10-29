# Deployment and Setup Guide

## Overview

This guide covers how to securely deploy the Películas 2025 application with the new backend proxy server.

## Prerequisites

- Node.js 18+ and npm
- TMDb API key (get one at https://www.themoviedb.org/settings/api)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your TMDb API key:

```env
TMDB_API_KEY=your_actual_tmdb_api_key_here
PORT=3000
```

**Important**: Never commit the `.env` file to version control. It's already listed in `.gitignore`.

### 3. Start the Development Server

```bash
npm start
```

The application will be available at http://localhost:3000

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`** in the project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add `TMDB_API_KEY` as an environment variable

4. **Deploy**:
   ```bash
   vercel
   ```

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Create `netlify.toml`**:
   ```toml
   [build]
     publish = "."
     command = "echo 'No build required'"
   
   [dev]
     command = "npm start"
     port = 3000
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

3. **Convert server.js to serverless functions** (create `netlify/functions/api.js`)

4. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 3: Traditional Server (VPS, Cloud VM)

1. **Install Node.js** on your server

2. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Peliculas2025-2.git
   cd Peliculas2025-2
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set environment variables**:
   ```bash
   export TMDB_API_KEY=your_api_key
   export PORT=3000
   ```

5. **Use a process manager** like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name peliculas
   pm2 save
   pm2 startup
   ```

6. **Set up a reverse proxy** with Nginx:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Security Best Practices

### 1. Environment Variables

- ✅ **DO**: Store API keys in environment variables
- ❌ **DON'T**: Commit `.env` file to Git
- ✅ **DO**: Use different API keys for dev/staging/production

### 2. HTTPS

- ✅ **DO**: Use HTTPS in production (use Let's Encrypt for free SSL)
- ✅ **DO**: Set secure CORS policies in production

### 3. Rate Limiting

Consider adding rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Security Headers

Add helmet for security headers:

```javascript
const helmet = require('helmet');
app.use(helmet());
```

## Monitoring and Maintenance

### Health Check

The server includes a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "hasApiKey": true
}
```

### Logs

- Development: Logs are printed to console
- Production: Use a logging service (Logtail, Papertrail, CloudWatch)

### Database Migration

Currently using localStorage. For production, consider:
- Adding a real database (MongoDB, PostgreSQL)
- Implementing user authentication
- Adding data backup mechanisms

## Troubleshooting

### Problem: "TMDB_API_KEY is not set"

**Solution**: Make sure your `.env` file exists and contains the API key.

### Problem: "fetch failed" or "ENOTFOUND api.themoviedb.org"

**Solution**: 
- Check your internet connection
- Verify the API key is correct
- Check if TMDb API is accessible from your server

### Problem: Static files not loading

**Solution**: 
- Check that file extensions are in the whitelist in `server.js`
- Verify files exist in the correct directories

### Problem: "Cannot GET /api/search"

**Solution**: Make sure the server is running and the port is correct.

## Performance Optimization

### 1. Enable Gzip Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching Headers

```javascript
app.use(express.static('.', {
    maxAge: '1d', // Cache static files for 1 day
    dotfiles: 'deny',
    extensions: ['html', 'css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico']
}));
```

### 3. Use a CDN

- Upload static assets to a CDN (Cloudflare, AWS CloudFront)
- Update image URLs in the application

## Useful Commands

```bash
# Development
npm start              # Start the server
npm test              # Run tests (if configured)

# Production
npm install --production  # Install only production dependencies
NODE_ENV=production npm start  # Start in production mode

# Process Management (with PM2)
pm2 start server.js --name peliculas
pm2 stop peliculas
pm2 restart peliculas
pm2 logs peliculas
pm2 monit
```

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TMDb API Documentation](https://developers.themoviedb.org/3)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
