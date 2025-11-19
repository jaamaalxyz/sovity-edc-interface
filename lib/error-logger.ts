/**
 * Error Logging Utility
 * Centralized error logging with support for different environments
 * Can be easily extended to integrate with Sentry, LogRocket, etc.
 */

import { isDevelopment } from "@/lib/env";

interface ErrorContext {
  context?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

class ErrorLogger {
  private isDevelopment = isDevelopment;

  /**
   * Log an error with context
   */
  logError(error: unknown, context?: ErrorContext): void {
    const errorInfo = this.formatError(error, context);

    if (this.isDevelopment) {
      // In development, use console.error for immediate visibility
      console.error("[Error]", errorInfo.message, {
        context: errorInfo.context,
        stack: errorInfo.stack,
        metadata: errorInfo.metadata,
      });
    } else {
      // In production, send to error tracking service
      // TODO: Integrate with Sentry, LogRocket, or similar service
      // Example: Sentry.captureException(error, { contexts: { ...context } });

      // For now, still log to console in production (should be replaced)
      console.error("[Error]", errorInfo.message);
    }
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: ErrorContext): void {
    if (this.isDevelopment) {
      console.warn("[Warning]", message, context);
    }
  }

  /**
   * Log info (for debugging)
   */
  logInfo(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.info("[Info]", message, data);
    }
  }

  /**
   * Format error for logging
   */
  private formatError(error: unknown, context?: ErrorContext) {
    let message = "Unknown error";
    let stack: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    } else if (typeof error === "string") {
      message = error;
    } else if (error && typeof error === "object") {
      message = JSON.stringify(error);
    }

    return {
      message,
      stack,
      context: context?.context,
      userId: context?.userId,
      metadata: context?.metadata,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

/**
 * Convenience function for logging errors
 */
export function logError(
  error: unknown,
  context?: string,
  metadata?: Record<string, unknown>
): void {
  errorLogger.logError(error, { context, metadata });
}

/**
 * Convenience function for logging warnings
 */
export function logWarning(message: string, context?: string): void {
  errorLogger.logWarning(message, { context });
}

/**
 * Convenience function for logging info
 */
export function logInfo(message: string, data?: unknown): void {
  errorLogger.logInfo(message, data);
}
