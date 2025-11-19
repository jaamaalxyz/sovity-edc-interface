/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the entire app
 */

"use client";

import React, { Component, ReactNode } from "react";

import { isDevelopment } from "@/lib/env";
import { logError } from "@/lib/error-logger";

import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error tracking service
    logError(error, "ReactErrorBoundary", {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="size-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Oops! Something went wrong
              </h1>
              <p className="mb-6 text-gray-600">
                We encountered an unexpected error. Please try refreshing the
                page or contact support if the problem persists.
              </p>

              {isDevelopment && this.state.error && (
                <div className="mb-6 text-left">
                  <details className="rounded-lg bg-red-50 p-4 text-sm">
                    <summary className="mb-2 cursor-pointer font-semibold text-red-900">
                      Error Details (Development Only)
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong className="text-red-900">Error:</strong>
                        <pre className="mt-1 overflow-auto text-xs text-red-800">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong className="text-red-900">
                            Component Stack:
                          </strong>
                          <pre className="mt-1 max-h-40 overflow-auto text-xs text-red-800">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex justify-center gap-3">
                <Button onClick={this.handleReset} variant="primary">
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="secondary"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
