import "@testing-library/jest-dom";

// Set up test environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:11000";
process.env.NEXT_PUBLIC_MANAGEMENT_API_PATH = "/api/management";
process.env.NEXT_PUBLIC_API_KEY = "test-api-key";
process.env.NODE_ENV = "test";
