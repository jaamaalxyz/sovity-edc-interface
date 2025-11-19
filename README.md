# Sovity EDC Manager

A modern web application for managing data assets and policies within the Sovity EDC (Eclipse Dataspace Components) Connector. Built with Next.js, TypeScript, and Tailwind CSS.

## Overview

This application provides a user-friendly interface for interacting with the Sovity EDC Connector, enabling users to:

- **Manage Assets**: Create, view, update, and delete data assets
- **Manage Policies**: Define and manage access policies with permissions and constraints
- **Search & Filter**: Quickly find assets and policies
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Features

### Asset Management

- ✅ List all assets with search functionality
- ✅ View detailed asset information including properties and data address
- ✅ Create new assets with metadata (ID, name, description, content type)
- ✅ Edit existing asset properties
- ✅ Delete assets with confirmation dialog
- ✅ Responsive card-based layout
- ✅ View associated contracts and policies for each asset

### Policy Management

- ✅ Display all policy definitions
- ✅ View policy details including permissions, prohibitions, and obligations
- ✅ Create new policies with custom permissions
- ✅ Delete policies with confirmation
- ✅ Visual categorization of policy rules

### Contract Definition Management

- ✅ Create contract definitions linking assets to policies
- ✅ List all contract definitions with search functionality
- ✅ View contract details showing asset selectors and policies
- ✅ Delete contract definitions with confirmation
- ✅ Asset selector configuration with multiple criteria
- ✅ Integration with asset and policy management

### User Experience

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states for all async operations
- ✅ Comprehensive error handling with retry capability
- ✅ Form validation with helpful error messages
- ✅ Confirmation dialogs for destructive actions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) for server state, useReducer for UI state
- **HTTP Client**: Axios
- **Form Management**: React Hook Form + Zod
- **Testing**:
  - Unit/Integration: Jest + React Testing Library
  - E2E: Playwright
- **Icons**: React Icons

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **Sovity EDC-CE Connector** - _Optional!_ See Mock API section below

### 🎭 Mock API for Development (No Backend Required!)

**New!** This application includes a built-in mock API that lets you develop and test without running the EDC backend!

**Quick Start:**

```bash
npm install
npm run dev
```

That's it! The mock API is **enabled by default** and includes sample data.

**Features:**

- ✅ Full CRUD operations for Assets and Policies
- ✅ Realistic network delays and error simulation
- ✅ 5 sample assets and 5 sample policies pre-loaded
- ✅ Perfect for frontend development, testing, and demos
- ✅ Works offline

**Switch between Mock and Real API:**

`.env.local` controls this:

```env
# Use Mock API (default) - no backend needed
NEXT_PUBLIC_USE_MOCK_API=true

# Or use Real EDC Backend
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:11002
NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management
NEXT_PUBLIC_API_KEY=your-api-key
```

📖 **Full documentation**: See [MOCK_API.md](./MOCK_API.md)

### Setting up Sovity EDC Connector (For Real API)

Only needed if you want to connect to a real backend (`NEXT_PUBLIC_USE_MOCK_API=false`):

1. Clone the Sovity EDC-CE repository:

   ```bash
   git clone https://github.com/sovity/edc-ce.git
   cd edc-ce
   ```

2. Follow the setup instructions in the Sovity EDC-CE repository to run the connector locally.

3. The connector typically runs on `http://localhost:11002` with the Management API at `/api/management`.

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd sovity-edc-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your EDC connector details:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:11002
   NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

#### Option 1: Docker Compose (Recommended)

The easiest way to run the application with Docker:

```bash
# Copy environment file
cp .env.docker.example .env.docker

# Edit .env.docker with your EDC connector details
# Then start the application
docker-compose up -d

# View logs
docker-compose logs -f sovity-edc-frontend

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`.

#### Option 2: Docker Build & Run

Build and run the Docker image manually:

```bash
# Build the image
docker build -t sovity-edc-frontend \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:11002 \
  --build-arg NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management \
  --build-arg NEXT_PUBLIC_API_KEY=your-api-key \
  .

# Run the container
docker run -d \
  -p 3000:3000 \
  --name sovity-edc-frontend \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:11002 \
  -e NEXT_PUBLIC_MANAGEMENT_API_PATH=/api/management \
  -e NEXT_PUBLIC_API_KEY=your-api-key \
  sovity-edc-frontend

# View logs
docker logs -f sovity-edc-frontend

# Stop the container
docker stop sovity-edc-frontend
docker rm sovity-edc-frontend
```

#### Docker Image Details

- **Base Image:** node:18-alpine (lightweight)
- **Multi-stage Build:** Optimized for production
- **Image Size:** ~150MB (approximate)
- **Non-root User:** Runs as `nextjs` user for security
- **Health Check:** Built-in health check endpoint
- **Port:** 3000

For detailed Docker deployment instructions, troubleshooting, and production configuration, see [DOCKER.md](./DOCKER.md).

## Running Tests

### Unit & Integration Tests (Jest + React Testing Library)

Run all unit and integration tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### End-to-End Tests (Playwright)

Run E2E tests in headless mode:

```bash
npm run test:e2e
```

Run E2E tests with interactive UI mode:

```bash
npm run test:e2e:ui
```

Debug E2E tests (step through with DevTools):

```bash
npm run test:e2e:debug
```

View test report (after running tests):

```bash
npm run test:e2e:report
```

Generate test code using Playwright Inspector:

```bash
npm run test:e2e:codegen
```

**Note:** E2E tests automatically start the dev server before running tests. Make sure port 3000 is available.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── assets/            # Assets page
│   ├── policies/          # Policies page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── AssetCard.tsx
│   ├── AssetForm.tsx
│   ├── PolicyCard.tsx
│   └── ...
├── lib/                   # Utility libraries
│   ├── api-client.ts      # API client for EDC connector
│   └── e2e-helpers.ts     # E2E test helper functions
├── store/                 # State management
│   ├── useAssetStore.ts   # Asset state management
│   └── usePolicyStore.ts  # Policy state management
├── types/                 # TypeScript type definitions
│   ├── asset.ts
│   ├── policy.ts
│   └── api.ts
├── __tests__/            # Tests
│   ├── components/       # Component unit tests
│   ├── lib/              # Library unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests (Playwright)
│       ├── assets.spec.ts
│       ├── policies.spec.ts
│       └── navigation.spec.ts
├── playwright.config.ts  # Playwright configuration
└── README.md             # This file
```

## Architecture Decisions

### 1. **Next.js App Router**

- Chosen for its modern approach to routing and server/client components
- Provides excellent developer experience with file-based routing
- Built-in optimization for performance

### 2. **TypeScript**

- Ensures type safety across the entire application
- Reduces runtime errors with compile-time type checking
- Improves IDE support and developer productivity
- Comprehensive type definitions for EDC API responses

### 3. **React Query for State Management**

- Industry-standard library for server state management
- Built-in caching, optimistic updates, and background refetching
- Excellent TypeScript support with type inference
- Separation of concerns: server state (React Query) vs UI state (useReducer)
- Automatic request deduplication and garbage collection

### 4. **Tailwind CSS**

- Utility-first approach enables rapid UI development
- Consistent design system through configuration
- Excellent responsive design support
- Small bundle size with purging

### 5. **React Hook Form + Zod**

- Performant form handling with minimal re-renders
- Schema-based validation with Zod
- Excellent TypeScript integration
- Reduces boilerplate for form management

### 6. **Component Architecture**

- Separation of concerns with reusable components
- Composition over inheritance
- Single Responsibility Principle
- Easy to test and maintain

### 7. **API Client Pattern**

- Centralized API communication logic
- Consistent error handling
- Easy to mock for testing
- Type-safe API calls

## API Integration

The application integrates with the Sovity EDC Management API v3 for assets and v2 for policies.

### Asset Endpoints

- `POST /v3/assets/request` - Fetch all assets
- `GET /v3/assets/{id}` - Get specific asset
- `POST /v3/assets` - Create asset
- `PUT /v3/assets/{id}` - Update asset
- `DELETE /v3/assets/{id}` - Delete asset

### Policy Endpoints

- `POST /v3/policydefinitions/request` - Fetch all policies
- `GET /v3/policydefinitions/{id}` - Get specific policy
- `POST /v3/policydefinitions` - Create policy
- `DELETE /v3/policydefinitions/{id}` - Delete policy

### Contract Definition Endpoints

- `POST /v3/contractdefinitions/request` - Fetch all contract definitions
- `GET /v3/contractdefinitions/{id}` - Get specific contract definition
- `POST /v3/contractdefinitions` - Create contract definition
- `PUT /v3/contractdefinitions/{id}` - Update contract definition
- `DELETE /v3/contractdefinitions/{id}` - Delete contract definition

## Error Handling

The application implements comprehensive error handling:

- **Network Errors**: Detected and displayed with retry functionality
- **API Errors**: Parsed and shown with meaningful messages
- **Form Validation**: Real-time validation with clear error messages
- **Loading States**: Visual feedback during async operations

## Testing Strategy

### Unit Tests

- Component tests using React Testing Library
- Store tests for state management logic
- API client tests with mocked HTTP calls

### Integration Tests

- Component integration with hooks and state management
- Form validation and submission flows
- API client integration with mock responses

### End-to-End Tests (Playwright)

E2E tests verify complete user journeys in a real browser:

**Asset Management** (`__tests__/e2e/assets.spec.ts`):

- Create, view, edit, and delete assets
- Search and filter functionality
- Form validation and error handling
- Confirmation dialogs

**Policy Management** (`__tests__/e2e/policies.spec.ts`):

- Create and delete policies
- View policy details and permissions
- Form validation
- Policy rule display

**Navigation & General** (`__tests__/e2e/navigation.spec.ts`):

- Page navigation and routing
- Browser back/forward functionality
- Responsive design (mobile, tablet, desktop)
- Accessibility (keyboard navigation, ARIA labels)
- Performance benchmarks
- Mock API integration

### Coverage

Tests cover critical user flows:

- Asset CRUD operations
- Policy management
- Form validation
- Error handling
- Navigation and routing
- Responsive behavior
- Accessibility compliance

## Assumptions

1. **EDC Connector Availability**: The Sovity EDC connector is running and accessible at the configured URL.

2. **API Compatibility**: The application assumes compatibility with EDC Management API v3 for assets and v2 for policies.

3. **Authentication**: The current implementation assumes no authentication is required. For production use, implement proper authentication mechanisms.

4. **Data Address**: Assets use `HttpData` type by default for data address configuration.

5. **Policy Structure**: Policies follow the ODRL (Open Digital Rights Language) specification used by EDC.

## How Contract Definitions Work

Contract Definitions are the bridge between Assets and Policies in the EDC ecosystem. They define which policies apply to which assets for data sharing.

### Creating a Contract Definition

1. Navigate to the **Contracts** page
2. Click **Create Contract** button
3. Fill in the required fields:
   - **Contract ID**: Unique identifier for the contract definition
   - **Access Policy**: Policy that controls who can access the assets
   - **Contract Policy**: Policy that defines the contract terms
   - **Asset Selectors**: Criteria to match assets (e.g., by ID, content type)
4. Add multiple asset selectors if needed to match multiple assets
5. Submit to create the contract definition

### Viewing Contract Associations

When viewing an **Asset's details**, you'll see a section showing all **Contract Definitions** that reference that asset, along with their associated policies. This provides full visibility into how assets are shared and under what conditions.

## Future Enhancements

Potential improvements for future iterations:

- [ ] Authentication & Authorization
- [ ] Contract Negotiations visualization
- [ ] Transfer Processes monitoring
- [ ] Advanced policy templates
- [ ] Bulk operations for assets and contracts
- [ ] Export/Import functionality
- [ ] Real-time updates with WebSockets
- [ ] Advanced search with filters
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Contract definition editing (currently only create/delete)
- [ ] Advanced asset selector operators (like, regex, etc.)

## Troubleshooting

### Common Issues

**Issue**: "No response from server" error

- **Solution**: Ensure the EDC connector is running at the configured URL
- Check if the connector ports are accessible
- Verify CORS settings if running on different domains

**Issue**: Tests failing

- **Solution**: Ensure all dependencies are installed with `npm install`
- Clear Jest cache: `npm test -- --clearCache`

**Issue**: Build errors

- **Solution**: Delete `.next` folder and `node_modules`, then reinstall:
  ```bash
  rm -rf .next node_modules
  npm install
  npm run build
  ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created as part of the Sovity Senior Frontend Developer coding challenge.

## Resources

- [Sovity EDC-CE GitHub](https://github.com/sovity/edc-ce)
- [Sovity EDC Documentation](https://edc-ce.docs.sovity.de/key-concepts)
- [Eclipse Dataspace Components](https://eclipse-edc.github.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
