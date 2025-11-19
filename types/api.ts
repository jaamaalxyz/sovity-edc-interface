/**
 * Common API Types
 */

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * EDC API Error Response Structure
 * Based on Eclipse Dataspace Components error format
 */
export interface EdcErrorResponse {
  message?: string;
  error?: string;
  errors?: Array<{
    message: string;
    invalidValue?: unknown;
    path?: string;
    type?: string;
  }>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface QuerySpec {
  offset?: number;
  limit?: number;
  sortOrder?: "ASC" | "DESC";
  sortField?: string;
  filterExpression?: FilterExpression[];
  filter?: string; // Simplified filter for mock API
}

export interface FilterExpression {
  operandLeft: string;
  operator: string;
  operandRight: string | number | boolean;
}
