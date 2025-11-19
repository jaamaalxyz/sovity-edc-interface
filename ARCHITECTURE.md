# Architecture Documentation

## System Architecture

### Overview

The Sovity EDC Manager is built using a modern, layered architecture that separates concerns and promotes maintainability.

```
┌─────────────────────────────────────────────┐
│           User Interface Layer              │
│  (React Components + Tailwind CSS)          │
├─────────────────────────────────────────────┤
│         State Management Layer              │
│     (Zustand Stores: Assets, Policies)      │
├─────────────────────────────────────────────┤
│          API Integration Layer              │
│      (Axios Client + Type Definitions)      │
├─────────────────────────────────────────────┤
│           External Services                 │
│    (Sovity EDC Management API)              │
└─────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. User Interface Layer

**Location**: `app/` and `components/`

**Responsibilities**:

- Render UI components
- Handle user interactions
- Display loading and error states
- Form validation and submission

**Key Components**:

- **Pages**: Assets, Policies, Home
- **Smart Components**: AssetCard, PolicyCard (connected to state)
- **Dumb Components**: Button, Input, Modal (pure presentation)

**Design Patterns**:

- **Component Composition**: Building complex UIs from simple, reusable components
- **Container/Presenter Pattern**: Separating logic from presentation
- **Controlled Components**: Form inputs managed by React Hook Form

### 2. State Management Layer

**Location**: `store/`

**Responsibilities**:

- Global application state
- Business logic for CRUD operations
- Loading and error state management
- State persistence and updates

**Implementation**:

```typescript
// Zustand Store Pattern
interface AssetState {
  // State
  assets: Asset[];
  loading: boolean;
  error: ApiError | null;

  // Actions
  fetchAssets: () => Promise<void>;
  createAsset: (asset: CreateAssetInput) => Promise<Asset>;
  updateAsset: (id: string, updates: UpdateAssetInput) => Promise<Asset>;
  deleteAsset: (id: string) => Promise<void>;
}
```

**Benefits**:

- Centralized state management
- Type-safe actions and state
- Minimal boilerplate
- Easy to test

### 3. API Integration Layer

**Location**: `lib/api-client.ts`

**Responsibilities**:

- HTTP communication with EDC connector
- Request/response transformation
- Error handling and normalization
- API endpoint configuration

**Key Features**:

```typescript
class EdcApiClient {
  // Singleton pattern
  private client: AxiosInstance;

  // Asset operations
  async getAssets(querySpec?: QuerySpec): Promise<Asset[]>;
  async createAsset(asset: CreateAssetInput): Promise<Asset>;

  // Policy operations
  async getPolicies(querySpec?: QuerySpec): Promise<PolicyDefinition[]>;
  async createPolicy(policy: CreatePolicyInput): Promise<PolicyDefinition>;

  // Error handling
  private handleError(error: AxiosError): ApiError;
}
```

### 4. Type System

**Location**: `types/`

**Purpose**:

- Define contracts between layers
- Ensure type safety
- Document API structures
- Enable IDE autocomplete

**Type Hierarchy**:

```
types/
├── asset.ts          # Asset domain types
├── policy.ts         # Policy domain types
└── api.ts            # Common API types
```

## Data Flow

### Read Operations (GET)

```
User Action
    ↓
UI Component
    ↓
Store Action (fetchAssets)
    ↓
API Client (getAssets)
    ↓
HTTP Request → EDC API
    ↓
HTTP Response
    ↓
Store Update (set assets)
    ↓
UI Re-render
```

### Write Operations (POST/PUT/DELETE)

```
User Form Submission
    ↓
Form Validation (Zod Schema)
    ↓
Store Action (createAsset)
    ↓
API Client (createAsset)
    ↓
HTTP Request → EDC API
    ↓
HTTP Response
    ↓
Store Update (add/update/remove)
    ↓
UI Re-render + Success Feedback
```

## Error Handling Strategy

### Error Propagation

```typescript
// 1. API Client catches HTTP errors
try {
  await this.client.post(...)
} catch (error: AxiosError) {
  throw this.handleError(error)  // Normalized ApiError
}

// 2. Store catches and stores error
try {
  await apiClient.createAsset(...)
} catch (error) {
  set({ error: error as ApiError, loading: false })
  throw error  // Re-throw for UI handling
}

// 3. UI displays error
{error && <ErrorMessage message={error.message} />}
```

### Error Types

1. **Network Errors**: No connection to server
2. **API Errors**: Server returned error response
3. **Validation Errors**: Form input validation failures
4. **Unknown Errors**: Unexpected errors

## Component Patterns

### 1. Smart Components (Containers)

Connected to state, handle business logic:

```typescript
// Example: Assets Page
const { assets, loading, fetchAssets } = useAssetStore();

useEffect(() => {
  fetchAssets();
}, [fetchAssets]);
```

### 2. Presentational Components

Pure components, receive props:

```typescript
// Example: AssetCard
interface AssetCardProps {
  asset: Asset;
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}
```

### 3. Form Components

Use React Hook Form + Zod for validation:

```typescript
const schema = z.object({
  id: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

## State Management Philosophy

### Why Zustand?

1. **Simplicity**: No providers, actions, or reducers
2. **Performance**: Minimal re-renders
3. **TypeScript**: First-class TypeScript support
4. **Size**: ~1KB gzipped
5. **DevTools**: Redux DevTools integration

### Store Structure

Each domain has its own store:

- `useAssetStore`: Asset management
- `usePolicyStore`: Policy management

Future stores could include:

- `useAuthStore`: Authentication
- `useContractStore`: Contract management

## API Client Design

### Singleton Pattern

One instance shared across the application:

```typescript
export const apiClient = new EdcApiClient();
```

### Benefits:

- Consistent configuration
- Shared interceptors
- Easy to mock in tests
- Centralized error handling

### Interceptors

```typescript
this.client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(this.handleError(error))
);
```

## Testing Strategy

### Unit Tests

**What to Test**:

- Component rendering
- User interactions
- State management logic
- API client methods

**Tools**:

- Jest: Test runner
- React Testing Library: Component testing
- Mock functions: Isolate dependencies

### Test Structure

```typescript
describe("Component/Function", () => {
  beforeEach(() => {
    // Setup
  });

  it("should do something", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Performance Considerations

### 1. Code Splitting

Next.js automatically splits code by route:

- Each page is a separate bundle
- Lazy loading of components
- Optimized bundle sizes

### 2. Memoization

Strategic use of React hooks:

```typescript
const filteredAssets = useMemo(() =>
  assets.filter(asset => /* filter logic */),
  [assets, searchQuery]
)
```

### 3. Debouncing

Search inputs debounced to reduce API calls:

```typescript
const debouncedSearch = useCallback(
  debounce((query) => setSearchQuery(query), 300),
  []
);
```

## Security Considerations

### Current Implementation

1. **Input Validation**: Zod schemas validate all form inputs
2. **XSS Prevention**: React automatically escapes output
3. **Type Safety**: TypeScript prevents type-related vulnerabilities

### Production Requirements

For production deployment, implement:

1. **Authentication**: JWT tokens or OAuth
2. **Authorization**: Role-based access control
3. **HTTPS**: Encrypted communication
4. **CORS**: Proper CORS configuration
5. **Rate Limiting**: Prevent abuse
6. **Input Sanitization**: Additional validation layer

## Scalability

### Current Limitations

- Client-side filtering (works for <1000 items)
- No pagination implementation
- No caching strategy

### Future Improvements

1. **Server-Side Pagination**:

   ```typescript
   const { offset, limit } = usePagination();
   await apiClient.getAssets({ offset, limit });
   ```

2. **Caching**:
   - React Query for server state
   - IndexedDB for offline support

3. **Virtualization**:
   - React Virtual for large lists
   - Render only visible items

## Deployment

### Build Process

```bash
npm run build  # Creates optimized production build
npm start      # Runs production server
```

### Environment Variables

Required for deployment:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_MANAGEMENT_API_PATH`

### Docker Support (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Maintenance Guidelines

### Code Quality

1. **Linting**: ESLint configuration
2. **Formatting**: Prettier (recommended)
3. **Type Checking**: `tsc --noEmit`
4. **Testing**: Maintain >70% coverage

### Adding New Features

1. **Types**: Define TypeScript interfaces
2. **API**: Add client methods
3. **Store**: Create/update Zustand store
4. **Components**: Build UI components
5. **Tests**: Write unit tests
6. **Documentation**: Update README

### Debugging

1. **React DevTools**: Component inspection
2. **Zustand DevTools**: State debugging
3. **Network Tab**: API request/response
4. **Console Logs**: Strategic logging

## Conclusion

This architecture provides:

- ✅ Clear separation of concerns
- ✅ Type safety throughout
- ✅ Easy testing and maintenance
- ✅ Scalable structure
- ✅ Modern development practices
