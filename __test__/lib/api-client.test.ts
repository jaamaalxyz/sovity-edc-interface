/**
 * API Client Tests
 * Note: These tests verify the API client structure and type safety
 */

import { apiClient } from "@/lib/api-client";

describe("API Client", () => {
  it("exports an API client instance", () => {
    expect(apiClient).toBeDefined();
  });

  it("has asset management methods", () => {
    expect(typeof apiClient.getAssets).toBe("function");
    expect(typeof apiClient.getAsset).toBe("function");
    expect(typeof apiClient.createAsset).toBe("function");
    expect(typeof apiClient.updateAsset).toBe("function");
    expect(typeof apiClient.deleteAsset).toBe("function");
  });

  it("has policy management methods", () => {
    expect(typeof apiClient.getPolicies).toBe("function");
    expect(typeof apiClient.getPolicy).toBe("function");
    expect(typeof apiClient.createPolicy).toBe("function");
    expect(typeof apiClient.deletePolicy).toBe("function");
  });

  it("has health check method", () => {
    expect(typeof apiClient.healthCheck).toBe("function");
  });
});
