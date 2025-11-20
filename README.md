# Sovity EDC Manager

Modern web interface for managing data assets and policies in the Eclipse Dataspace Components ecosystem.

## Quick Start

```bash
npm install && npm run dev
```

No backend required—mock API enabled by default with sample data.

## Core Features

**Assets** • Full CRUD with metadata, search, and contract associations
**Policies** • 15+ templates across 6 categories (GDPR, Time-Based, RBAC, etc.)
**Contracts** • Link assets to policies with flexible selectors
**Developer Ready** • Complete mock API, TypeScript, comprehensive tests

## Stack

- Next.js 15
- TypeScript
- React Hook Form
- Tailwind CSS
- React Query
- Zod
- Jest
- Playwright

## Setup

### Development (Mock API)

```bash
npm install
npm run dev  # http://localhost:3000
```

### Production with Real EDC Backend

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:11002
NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management
NEXT_PUBLIC_API_KEY=your-api-key
```

See [MOCK_API.md](./MOCK_API.md) for mock API details and [DOCKER.md](./DOCKER.md) for Docker deployment.

## Testing

```bash
npm test                    # Unit & integration tests
npm run test:coverage       # With coverage report
npm run test:e2e            # E2E tests (Playwright)
npm run test:e2e:ui         # Interactive E2E mode
```

## Deployment

### Cloudflare Pages (Recommended)

The project includes GitHub Actions workflow for automatic deployment:

1. **Set GitHub Secrets:**
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

2. **Push to main branch** - Auto-deploys to production
3. **Create PR** - Auto-deploys preview with comment

### Docker

```bash
docker-compose up -d        # Using docker-compose
# or
docker build -t sovity-edc-interface .
docker run -p 3000:3000 sovity-edc-interface
```

## Project Structure

```
├── app/              # Next.js pages (assets, policies, contracts)
├── components/       # Reusable UI components
├── lib/              # API client, utilities, mock data
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
└── __tests__/        # Unit, integration, and E2E tests
```

### Mock API

Full EDC Management API simulation:

- Realistic network delays
- Error simulation (configurable rate)
- Sample data pre-loaded
- No backend dependencies

## Architecture Highlights

**State Management:** React Query (server state) + useReducer (UI state)
**Forms:** React Hook Form + Zod schemas
**Styling:** Tailwind utility-first approach
**Type Safety:** Comprehensive TypeScript coverage
**Testing:** 3-layer strategy (unit, integration, E2E)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions.

## API Integration

Supports EDC Management API v3:

```
Assets:               /v3/assets/*
Policies:             /v3/policydefinitions/*
Contract Definitions: /v3/contractdefinitions/*
```

## Troubleshooting

**Server connection error?**
→ Check EDC connector is running or enable mock API

**Tests failing?**
→ `npm install && npm test -- --clearCache`

**Build errors?**
→ `rm -rf .next node_modules && npm install && npm run build`

## Resources

- [Sovity EDC-CE](https://github.com/sovity/edc-ce)
- [EDC Documentation](https://edc-ce.docs.sovity.de/key-concepts)
- [Eclipse Dataspace](https://eclipse-edc.github.io/documentation/)

---

Built with Next.js • TypeScript • Tailwind CSS
