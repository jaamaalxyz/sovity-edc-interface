/**
 * Environment Variables Validation
 * Uses Zod to validate environment variables at build/runtime
 * Provides type-safe access to environment variables
 */

import { z } from "zod";

/**
 * Environment variables schema
 * Defines the shape and validation rules for all environment variables
 */
const envSchema = z.object({
  // Mock API toggle (optional, defaults to false)
  NEXT_PUBLIC_USE_MOCK_API: z
    .string()
    .optional()
    .transform((val) => val === "true"),

  // API Configuration (optional when using mock API)
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url("API Base URL must be a valid URL")
    .min(1, "API Base URL is required")
    .optional(),

  NEXT_PUBLIC_MANAGEMENT_API_PATH: z
    .string()
    .min(1, "Management API Path is required")
    .regex(/^\//, "Management API Path must start with /")
    .optional(),

  NEXT_PUBLIC_API_KEY: z
    .string()
    .min(1, "API Key is required")
    .min(8, "API Key must be at least 8 characters long")
    .optional(),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Type of validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 */
function validateEnv(): Env {
  try {
    const parsed = envSchema.parse({
      NEXT_PUBLIC_USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API,
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_MANAGEMENT_API_PATH:
        process.env.NEXT_PUBLIC_MANAGEMENT_API_PATH,
      NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });

    // Validate that real API vars are set when not using mock API
    if (!parsed.NEXT_PUBLIC_USE_MOCK_API) {
      if (!parsed.NEXT_PUBLIC_API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_BASE_URL is required when NEXT_PUBLIC_USE_MOCK_API is false"
        );
      }
      if (!parsed.NEXT_PUBLIC_MANAGEMENT_API_PATH) {
        throw new Error(
          "NEXT_PUBLIC_MANAGEMENT_API_PATH is required when NEXT_PUBLIC_USE_MOCK_API is false"
        );
      }
      if (!parsed.NEXT_PUBLIC_API_KEY) {
        throw new Error(
          "NEXT_PUBLIC_API_KEY is required when NEXT_PUBLIC_USE_MOCK_API is false"
        );
      }
    }

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        return `  - ${err.path.join(".")}: ${err.message}`;
      });

      console.error("❌ Environment variable validation failed:");
      console.error(missingVars.join("\n"));
      console.error(
        "\n💡 Please check your .env.local file and ensure all required variables are set."
      );
      console.error("📄 See .env.local.example for reference.\n");

      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * Use this instead of process.env for type safety and validation
 */
export const env = validateEnv();

/**
 * Helper to check if we're in development mode
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Helper to check if we're in production mode
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Helper to check if we're in test mode
 */
export const isTest = env.NODE_ENV === "test";

/**
 * Helper to check if we're using mock API
 */
export const useMockApi = env.NEXT_PUBLIC_USE_MOCK_API || false;
