/**
 * API Client for Sovity EDC Connector
 * Handles all API communication with the EDC Management API
 * Supports both real backend API and mock API for development
 */

import axios, { AxiosError, AxiosInstance } from "axios";

import { env, useMockApi } from "@/lib/env";
import type { ApiError, EdcErrorResponse, QuerySpec } from "@/types/api";
import type { Asset, CreateAssetInput, UpdateAssetInput } from "@/types/asset";
import type {
  ContractDefinition,
  CreateContractInput,
  UpdateContractInput,
} from "@/types/contract";
import type { CreatePolicyInput, PolicyDefinition } from "@/types/policy";

class EdcApiClient {
  private client: AxiosInstance;
  private managementPath: string;

  constructor() {
    // Use validated environment variables for type safety
    this.managementPath = env.NEXT_PUBLIC_MANAGEMENT_API_PATH || "";
    const apiKey = env.NEXT_PUBLIC_API_KEY || "";

    this.client = axios.create({
      baseURL: this.managementPath,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      timeout: 30000,
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<EdcErrorResponse>) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<EdcErrorResponse>): ApiError {
    if (error.response) {
      const errorData = error.response.data;
      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorData?.errors?.[0]?.message ||
        error.message ||
        "An error occurred while processing your request";

      return {
        message: errorMessage,
        code: error.response.status.toString(),
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message:
          "No response from server. Please check if the EDC connector is running.",
        code: "NETWORK_ERROR",
      };
    } else {
      return {
        message: error.message || "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      };
    }
  }

  // ==================== Asset Management ====================

  /**
   * Get all assets with optional query specification
   */
  async getAssets(querySpec?: QuerySpec): Promise<Asset[]> {
    try {
      const response = await this.client.post("/v3/assets/request", {
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@type": "QuerySpec",
        ...querySpec,
      });
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific asset by ID
   */
  async getAsset(id: string): Promise<Asset> {
    try {
      const response = await this.client.get(
        `/v3/assets/${encodeURIComponent(id)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new asset
   */
  async createAsset(asset: CreateAssetInput): Promise<Asset> {
    try {
      const payload = {
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@id": asset.id,
        "@type": "Asset",
        properties: {
          ...asset.properties,
          name: asset.properties.name,
          description: asset.properties.description || "",
          contenttype: asset.properties.contentType || "application/json",
        },
        dataAddress: {
          "@type": "DataAddress",
          ...asset.dataAddress,
        },
      };

      const response = await this.client.post("/v3/assets", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing asset
   * Note: EDC assets are immutable, so we delete and recreate
   */
  async updateAsset(id: string, updates: UpdateAssetInput): Promise<Asset> {
    try {
      // First, get the existing asset to preserve dataAddress
      const existingAsset = await this.getAsset(id);

      // Delete the existing asset
      await this.deleteAsset(id);

      // Recreate with updated properties
      const payload = {
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@id": id,
        "@type": "Asset",
        properties: {
          ...existingAsset.properties,
          ...updates.properties,
        },
        dataAddress: {
          "@type": "DataAddress",
          type: "HttpData",
          ...existingAsset.dataAddress,
          ...updates.dataAddress,
        },
      };

      const response = await this.client.post("/v3/assets", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<void> {
    try {
      await this.client.delete(`/v3/assets/${encodeURIComponent(id)}`);
    } catch (error) {
      throw error;
    }
  }

  // ==================== Policy Management ====================

  /**
   * Get all policy definitions
   */
  async getPolicies(querySpec?: QuerySpec): Promise<PolicyDefinition[]> {
    try {
      const response = await this.client.post("/v3/policydefinitions/request", {
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@type": "QuerySpec",
        ...querySpec,
      });
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific policy definition by ID
   */
  async getPolicy(id: string): Promise<PolicyDefinition> {
    try {
      const response = await this.client.get(
        `/v3/policydefinitions/${encodeURIComponent(id)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new policy definition
   */
  async createPolicy(
    policyInput: CreatePolicyInput
  ): Promise<PolicyDefinition> {
    try {
      // Transform permissions to include odrl: prefix
      const transformPermissions = (items: any[] = []) =>
        items.map((item) => ({
          "odrl:action": item.action,
          ...(item.constraints && item.constraints.length > 0
            ? { "odrl:constraint": item.constraints }
            : {}),
        }));

      const payload = {
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          odrl: "http://www.w3.org/ns/odrl/2/",
        },
        "@id": policyInput.id,
        "@type": "PolicyDefinition",
        policy: {
          "@type": "odrl:Set",
          ...(policyInput.policy.permissions &&
          policyInput.policy.permissions.length > 0
            ? {
                "odrl:permission": transformPermissions(
                  policyInput.policy.permissions
                ),
              }
            : {}),
          ...(policyInput.policy.prohibitions &&
          policyInput.policy.prohibitions.length > 0
            ? {
                "odrl:prohibition": transformPermissions(
                  policyInput.policy.prohibitions
                ),
              }
            : {}),
          ...(policyInput.policy.obligations &&
          policyInput.policy.obligations.length > 0
            ? {
                "odrl:obligation": transformPermissions(
                  policyInput.policy.obligations
                ),
              }
            : {}),
        },
      };

      const response = await this.client.post("/v3/policydefinitions", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a policy definition
   */
  async deletePolicy(id: string): Promise<void> {
    try {
      await this.client.delete(
        `/v3/policydefinitions/${encodeURIComponent(id)}`
      );
    } catch (error) {
      throw error;
    }
  }

  // ==================== Contract Definition Management ====================

  /**
   * Get all contract definitions
   */
  async getContracts(querySpec?: QuerySpec): Promise<ContractDefinition[]> {
    try {
      const response = await this.client.post(
        "/v3/contractdefinitions/request",
        {
          "@context": {
            "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          },
          "@type": "QuerySpec",
          ...querySpec,
        }
      );
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a specific contract definition by ID
   */
  async getContract(id: string): Promise<ContractDefinition> {
    try {
      const response = await this.client.get(
        `/v3/contractdefinitions/${encodeURIComponent(id)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new contract definition
   */
  async createContract(
    contractInput: CreateContractInput
  ): Promise<ContractDefinition> {
    try {
      const payload = {
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@id": contractInput.id,
        "@type": "ContractDefinition",
        accessPolicyId: contractInput.accessPolicyId,
        contractPolicyId: contractInput.contractPolicyId,
        assetsSelector: contractInput.assetsSelector.map((selector) => ({
          "@type": "CriterionDto",
          operandLeft: selector.operandLeft,
          operator: selector.operator,
          operandRight: selector.operandRight,
        })),
      };

      const response = await this.client.post(
        "/v3/contractdefinitions",
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing contract definition
   * Note: EDC contract definitions may be immutable, so we delete and recreate
   */
  async updateContract(
    id: string,
    updates: UpdateContractInput
  ): Promise<ContractDefinition> {
    try {
      // Get the existing contract definition
      const existingContract = await this.getContract(id);

      // Delete the existing contract definition
      await this.deleteContract(id);

      // Recreate with updated properties
      const payload = {
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          edc: "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@id": id,
        "@type": "ContractDefinition",
        accessPolicyId:
          updates.accessPolicyId || existingContract.accessPolicyId,
        contractPolicyId:
          updates.contractPolicyId || existingContract.contractPolicyId,
        assetsSelector: (
          updates.assetsSelector || existingContract.assetsSelector
        ).map((selector) => ({
          "@type": "CriterionDto",
          operandLeft: selector.operandLeft,
          operator: selector.operator,
          operandRight: selector.operandRight,
        })),
      };

      const response = await this.client.post(
        "/v3/contractdefinitions",
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a contract definition
   */
  async deleteContract(id: string): Promise<void> {
    try {
      await this.client.delete(
        `/v3/contractdefinitions/${encodeURIComponent(id)}`
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Health check to verify connector is reachable
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get("/check/health");
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance - conditionally use mock or real API
let apiClientInstance:
  | EdcApiClient
  | typeof import("./mock-api-client").mockApiClient;

if (useMockApi) {
  // Use mock API for development without backend
  const { mockApiClient } = require("./mock-api-client");
  apiClientInstance = mockApiClient;
  console.log("🎭 Using Mock API - no backend required");
} else {
  // Use real EDC API
  apiClientInstance = new EdcApiClient();
  console.log("🌐 Using Real EDC API");
}

export const apiClient = apiClientInstance;
export default apiClient;
