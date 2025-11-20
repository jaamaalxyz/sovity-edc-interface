# Deployment Guide

## Cloudflare Pages

### Automated Deployment via GitHub Actions

The repository includes a CI/CD workflow that automatically deploys to Cloudflare Pages.

**Setup:**

1. **Create Cloudflare API Token:**
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create token with "Cloudflare Pages" template
   - Copy the token

2. **Add GitHub Secrets:**
   Navigate to your GitHub repository → Settings → Secrets and variables → Actions

   Add these secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

3. **Deploy:**
   - **Production:** Push to `main` branch → auto-deploys
   - **Preview:** Create PR → auto-deploys preview with URL comment

**Workflow Features:**

- Runs tests before deployment
- Generates code coverage reports
- Deploys preview for PRs
- Comments preview URL on PR

### Manual Deployment

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy
wrangler pages deploy .next --project-name=sovity-edc-interface
```

## Docker

### Docker Compose

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Docker CLI

```bash
# Build
docker build -t sovity-edc-interface .

# Run
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_USE_MOCK_API=true \
  sovity-edc-interface

# With real backend
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_USE_MOCK_API=false \
  -e NEXT_PUBLIC_API_BASE_URL=http://backend:11000 \
  -e NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management \
  -e NEXT_PUBLIC_API_KEY=your-key \
  sovity-edc-interface
```

## Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Configure environment variables in Vercel dashboard.

## Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

Or connect GitHub repository for automatic deployments.

## Self-Hosted (Node.js)

```bash
# Build
npm run build

# Start production server
npm start

# Or use PM2
npm install -g pm2
pm2 start npm --name "edc-interface" -- start
```

## Environment Variables

**Required for all deployments:**

- `NEXT_PUBLIC_USE_MOCK_API`: Set to `false` for production with real backend

**Required when using real backend:**

- `NEXT_PUBLIC_API_BASE_URL`: EDC connector URL
- `NEXT_PUBLIC_MANAGEMENT_API_PATH`: Management API path (default: `/api/management`)
- `NEXT_PUBLIC_API_KEY`: API authentication key

## Health Checks

All deployment methods include health check endpoint:

```bash
curl http://localhost:3000/api/health
```

## Performance Optimization

**Build optimization:**

- Uses Next.js automatic static optimization
- Image optimization enabled
- Bundle size analysis available via `npm run analyze`

**Caching:**

- Static assets cached with long TTL
- API responses cached via React Query
- Incremental Static Regeneration for dynamic routes

## Monitoring

**Recommended tools:**

- **Cloudflare Analytics** (built-in for Cloudflare Pages)
- **Sentry** for error tracking
- **Vercel Analytics** (if using Vercel)

## Security Checklist

- [ ] Environment variables secured (not in source code)
- [ ] API keys rotated regularly
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies up to date

## Rollback

**GitHub Actions:**

- Re-run previous successful workflow
- Or revert commit and push

**Docker:**

```bash
docker pull sovity-edc-interface:previous-tag
docker run -d -p 3000:3000 sovity-edc-interface:previous-tag
```

**Cloudflare Pages:**

- Dashboard → Deployments → Select previous deployment → Rollback

## Troubleshooting

**Build fails:**
→ Check Node.js version (requires v18+)
→ Clear cache: `rm -rf .next node_modules && npm install`

**Deploy fails:**
→ Verify environment variables are set
→ Check deployment logs for specific errors

**Application not loading:**
→ Verify network access to EDC backend
→ Check browser console for errors
→ Enable mock API mode for testing
