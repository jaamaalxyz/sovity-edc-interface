# Mock API for Development

This project includes a mock API implementation that allows you to develop and test the frontend without running the actual EDC backend. This is perfect for rapid frontend development, testing, and demos.

## Quick Start

### Enable Mock API

The mock API is **enabled by default** in `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK_API=true
```

Just start the development server and you're ready to go - no backend required!

```bash
npm run dev
```

### Switch to Real API

To connect to a real EDC backend, update `.env.local`:

```env
# Disable mock API
NEXT_PUBLIC_USE_MOCK_API=false

# Configure real backend connection
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_MANAGEMENT_API_PATH=/management/v3
NEXT_PUBLIC_API_KEY=your-api-key-here
```

## Features

### ✅ Full CRUD Operations

The mock API supports all operations:

**Assets:**

- ✅ List all assets with pagination
- ✅ Get single asset by ID
- ✅ Create new asset
- ✅ Update existing asset
- ✅ Delete asset
- ✅ Search/filter assets

**Policies:**

- ✅ List all policies with pagination
- ✅ Get single policy by ID
- ✅ Create new policy
- ✅ Delete policy
- ✅ Search/filter policies

### 🎭 Realistic Behavior

- **Network delays**: Simulates realistic API response times (200-500ms)
- **Error simulation**: 5% random error rate to test error handling
- **In-memory storage**: Changes persist during the session
- **Proper validation**: Throws errors for invalid operations (duplicate IDs, not found, etc.)

### 📦 Pre-loaded Data

The mock API comes with sample data:

- **5 sample assets** (customer database, sales analytics, product catalog, etc.)
- **5 sample policies** (various actions and constraints)

## API Implementation

### File Structure

```
lib/
├── mock-api-client.ts    # Mock API implementation
├── mock-data.ts          # Sample assets and policies
├── api-client.ts         # Main API client (auto-switches between mock/real)
└── env.ts                # Environment variable validation
```

### Mock Data Customization

Edit `lib/mock-data.ts` to customize the pre-loaded data:

```typescript
export const mockAssets: Asset[] = [
  {
    "@id": "my-asset",
    properties: {
      "asset:prop:name": "My Custom Asset",
      // ... more properties
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: "https://example.com/data",
    },
  },
];
```

### Reset Mock Data

The mock API stores data in memory. To reset to original data, restart the development server.

Programmatically reset (useful for tests):

```typescript
import { resetMockData } from "@/lib/mock-api-client";

resetMockData(); // Resets to original mock data
```

## Development Workflow

### 1. Frontend Development (Mock API)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=true

# Start development
npm run dev
```

Work on UI, components, and logic without backend dependencies.

### 2. Integration Testing (Real API)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_MANAGEMENT_API_PATH=/management/v3
NEXT_PUBLIC_API_KEY=your-api-key

# Start backend
docker-compose up -d  # or however you run your EDC backend

# Start development
npm run dev
```

Test against the real EDC backend to ensure everything works end-to-end.

## Benefits

### 👨‍💻 For Developers

- **No backend setup required** for frontend development
- **Faster development** - instant responses, no network delays
- **Offline development** - work anywhere without backend access
- **Predictable data** - same test data every time
- **Easy testing** - test edge cases without backend changes

### 🧪 For Testing

- **Reliable tests** - no flaky network issues
- **Fast test execution** - no real HTTP requests
- **Controlled scenarios** - test error cases easily
- **Isolation** - frontend tests don't need backend

### 📊 For Demos

- **Always works** - no backend downtime
- **Consistent data** - predictable demo flow
- **Portable** - run demos anywhere
- **Fast** - instant responses

## Configuration Reference

### Environment Variables

| Variable                          | Default | Description                            |
| --------------------------------- | ------- | -------------------------------------- |
| `NEXT_PUBLIC_USE_MOCK_API`        | `false` | Enable/disable mock API                |
| `NEXT_PUBLIC_API_BASE_URL`        | -       | Real API base URL (when mock disabled) |
| `NEXT_PUBLIC_MANAGEMENT_API_PATH` | -       | Real API path (when mock disabled)     |
| `NEXT_PUBLIC_API_KEY`             | -       | Real API key (when mock disabled)      |

### Mock API Configuration

Edit `lib/mock-api-client.ts` to adjust:

```typescript
// Change network delay simulation
const delay = (ms: number = 300) => ...  // Default 300ms

// Change error rate
const maybeThrowError = () => {
  if (Math.random() < 0.05) {  // 5% error rate
    throw new Error('Simulated network error');
  }
};
```

## Troubleshooting

### Mock API not working

1. Check `.env.local` has `NEXT_PUBLIC_USE_MOCK_API=true`
2. Restart dev server after changing env vars
3. Check console for "🎭 Using Mock API" message

### Seeing validation errors

If you disabled mock API, ensure real API vars are set:

```env
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080  # Required
NEXT_PUBLIC_MANAGEMENT_API_PATH=/management/v3  # Required
NEXT_PUBLIC_API_KEY=your-key                    # Required
```

### Changes not persisting

Mock data is **in-memory only**. It resets when you:

- Refresh the page (hot reload preserves it)
- Restart the dev server

This is intentional for testing. For persistence, use the real API.

## Next Steps

- ✅ Mock API implemented and ready to use
- 🔄 Consider adding more sample data in `lib/mock-data.ts`
- 📝 Consider adding GraphQL mock if you add GraphQL later
- 🧪 Use mock API in your test suite for faster tests

## Related Files

- `lib/mock-api-client.ts` - Mock implementation
- `lib/mock-data.ts` - Sample data
- `lib/api-client.ts` - API client (switches between mock/real)
- `lib/env.ts` - Environment configuration
- `.env.local` - Local environment variables
- `.env.local.example` - Example environment file

---

**Happy coding! 🎉**
