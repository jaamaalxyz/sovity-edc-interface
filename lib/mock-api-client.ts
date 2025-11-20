/**
 * Mock API Client for Development
 * Simulates backend API without requiring a running server
 */

import type { QuerySpec } from "@/types/api";
import type {
  Asset,
  AssetProperties,
  CreateAssetInput,
  UpdateAssetInput,
} from "@/types/asset";
import type {
  ContractDefinition,
  CreateContractInput,
  UpdateContractInput,
} from "@/types/contract";
import type { CreatePolicyInput, PolicyDefinition } from "@/types/policy";

import { mockAssets, mockContracts, mockPolicies } from "./mock-data";

// In-memory storage (simulates database)
let assets: Asset[] = [...mockAssets];
let policies: PolicyDefinition[] = [...mockPolicies];
let contracts: ContractDefinition[] = [...mockContracts];

/**
 * Simulate network delay
 */
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulate random failures (5% chance)
 */
const maybeThrowError = () => {
  if (Math.random() < 0.05) {
    throw new Error("Simulated network error");
  }
};

/**
 * Mock API Client
 */
export const mockApiClient = {
  // ===== ASSETS =====

  /**
   * Get all assets with optional filtering
   */
  async getAssets(querySpec: QuerySpec = {}): Promise<Asset[]> {
    await delay(400);
    maybeThrowError();

    let result = [...assets];

    // Apply filtering if filter string is provided
    if (querySpec.filter) {
      const searchTerm = querySpec.filter.toLowerCase();
      result = result.filter((asset) => {
        const id = asset["@id"].toLowerCase();
        const name = (
          asset.properties?.["asset:prop:name"] ||
          asset.properties?.name ||
          ""
        )
          .toString()
          .toLowerCase();
        const description = (
          asset.properties?.["asset:prop:description"] ||
          asset.properties?.description ||
          ""
        )
          .toString()
          .toLowerCase();

        return (
          id.includes(searchTerm) ||
          name.includes(searchTerm) ||
          description.includes(searchTerm)
        );
      });
    }

    // Apply pagination
    const offset = querySpec.offset || 0;
    const limit = querySpec.limit || result.length;
    result = result.slice(offset, offset + limit);

    return result;
  },

  /**
   * Get a single asset by ID
   */
  async getAsset(id: string): Promise<Asset> {
    await delay(200);
    maybeThrowError();

    const asset = assets.find((a) => a["@id"] === id);
    if (!asset) {
      throw new Error(`Asset with ID "${id}" not found`);
    }
    return asset;
  },

  /**
   * Create a new asset
   */
  async createAsset(input: CreateAssetInput): Promise<Asset> {
    await delay(500);
    maybeThrowError();

    // Check if asset with same ID already exists
    if (assets.some((a) => a["@id"] === input.id)) {
      throw new Error(`Asset with ID "${input.id}" already exists`);
    }

    const newAsset: Asset = {
      "@id": input.id,
      "@type": "Asset",
      properties: {
        "asset:prop:id": input.id,
        "asset:prop:name": input.properties.name,
        "asset:prop:description": input.properties.description,
        "asset:prop:contenttype": input.properties.contentType,
        "asset:prop:version": input.properties.version,
      },
      dataAddress: {
        "@type": "DataAddress",
        type: input.dataAddress.type,
        baseUrl: input.dataAddress.baseUrl,
      },
    };

    assets = [newAsset, ...assets];
    return newAsset;
  },

  /**
   * Update an existing asset
   */
  async updateAsset(id: string, updates: UpdateAssetInput): Promise<Asset> {
    await delay(500);
    maybeThrowError();

    const assetIndex = assets.findIndex((a) => a["@id"] === id);
    if (assetIndex === -1) {
      throw new Error(`Asset with ID "${id}" not found`);
    }

    const existingAsset = assets[assetIndex];
    const updatedAsset: Asset = {
      ...existingAsset,
      properties: {
        ...existingAsset.properties,
        ...(updates.properties?.name && {
          "asset:prop:name": updates.properties.name,
        }),
        ...(updates.properties?.description && {
          "asset:prop:description": updates.properties.description,
        }),
        ...(updates.properties?.contentType && {
          "asset:prop:contenttype": updates.properties.contentType,
        }),
        ...(updates.properties?.version && {
          "asset:prop:version": updates.properties.version,
        }),
      } as AssetProperties,
      dataAddress: updates.dataAddress
        ? {
            "@type": "DataAddress",
            type: (updates.dataAddress.type ||
              existingAsset.dataAddress?.type) as string,
            baseUrl:
              updates.dataAddress.baseUrl || existingAsset.dataAddress?.baseUrl,
          }
        : existingAsset.dataAddress,
    };

    assets[assetIndex] = updatedAsset;
    return updatedAsset;
  },

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<void> {
    await delay(400);
    maybeThrowError();

    const assetIndex = assets.findIndex((a) => a["@id"] === id);
    if (assetIndex === -1) {
      throw new Error(`Asset with ID "${id}" not found`);
    }

    assets = assets.filter((a) => a["@id"] !== id);
  },

  // ===== POLICIES =====

  /**
   * Get all policies with optional filtering
   */
  async getPolicies(querySpec: QuerySpec = {}): Promise<PolicyDefinition[]> {
    await delay(400);
    maybeThrowError();

    let result = [...policies];

    // Apply filtering if filter string is provided
    if (querySpec.filter) {
      const searchTerm = querySpec.filter.toLowerCase();
      result = result.filter((policy) => {
        const id = policy["@id"].toLowerCase();
        return id.includes(searchTerm);
      });
    }

    // Apply pagination
    const offset = querySpec.offset || 0;
    const limit = querySpec.limit || result.length;
    result = result.slice(offset, offset + limit);

    return result;
  },

  /**
   * Get a single policy by ID
   */
  async getPolicy(id: string): Promise<PolicyDefinition> {
    await delay(200);
    maybeThrowError();

    const policy = policies.find((p) => p["@id"] === id);
    if (!policy) {
      throw new Error(`Policy with ID "${id}" not found`);
    }
    return policy;
  },

  /**
   * Create a new policy
   */
  async createPolicy(input: CreatePolicyInput): Promise<PolicyDefinition> {
    await delay(500);
    maybeThrowError();

    // Check if policy with same ID already exists
    if (policies.some((p) => p["@id"] === input.id)) {
      throw new Error(`Policy with ID "${input.id}" already exists`);
    }

    const newPolicy: PolicyDefinition = {
      "@id": input.id,
      "@type": "PolicyDefinition",
      policy: {
        "@id": `${input.id}-policy`,
        "@type": "Policy",
        permissions: input.policy.permissions?.map((p) => ({
          action: p.action,
          constraint: p.constraints,
        })),
        prohibitions: input.policy.prohibitions?.map((p) => ({
          action: p.action,
          constraint: p.constraints,
        })),
        obligations: input.policy.obligations?.map((p) => ({
          action: p.action,
          constraint: p.constraints,
        })),
      },
    };

    policies = [newPolicy, ...policies];
    return newPolicy;
  },

  /**
   * Delete a policy
   */
  async deletePolicy(id: string): Promise<void> {
    await delay(400);
    maybeThrowError();

    const policyIndex = policies.findIndex((p) => p["@id"] === id);
    if (policyIndex === -1) {
      throw new Error(`Policy with ID "${id}" not found`);
    }

    policies = policies.filter((p) => p["@id"] !== id);
  },

  // ===== CONTRACTS =====

  /**
   * Get all contract definitions with optional filtering
   */
  async getContracts(querySpec: QuerySpec = {}): Promise<ContractDefinition[]> {
    await delay(400);
    maybeThrowError();

    let result = [...contracts];

    // Apply filtering if filter string is provided
    if (querySpec.filter) {
      const searchTerm = querySpec.filter.toLowerCase();
      result = result.filter((contract) => {
        const id = contract["@id"].toLowerCase();
        const accessPolicyId = contract.accessPolicyId.toLowerCase();
        const contractPolicyId = contract.contractPolicyId.toLowerCase();
        return (
          id.includes(searchTerm) ||
          accessPolicyId.includes(searchTerm) ||
          contractPolicyId.includes(searchTerm)
        );
      });
    }

    // Apply pagination
    const offset = querySpec.offset || 0;
    const limit = querySpec.limit || result.length;
    result = result.slice(offset, offset + limit);

    return result;
  },

  /**
   * Get a single contract definition by ID
   */
  async getContract(id: string): Promise<ContractDefinition> {
    await delay(200);
    maybeThrowError();

    const contract = contracts.find((c) => c["@id"] === id);
    if (!contract) {
      throw new Error(`Contract with ID "${id}" not found`);
    }
    return contract;
  },

  /**
   * Create a new contract definition
   */
  async createContract(
    input: CreateContractInput
  ): Promise<ContractDefinition> {
    await delay(500);
    maybeThrowError();

    // Check if contract with same ID already exists
    if (contracts.some((c) => c["@id"] === input.id)) {
      throw new Error(`Contract with ID "${input.id}" already exists`);
    }

    // Validate that referenced policies exist
    if (!policies.some((p) => p["@id"] === input.accessPolicyId)) {
      throw new Error(
        `Access policy with ID "${input.accessPolicyId}" not found`
      );
    }
    if (!policies.some((p) => p["@id"] === input.contractPolicyId)) {
      throw new Error(
        `Contract policy with ID "${input.contractPolicyId}" not found`
      );
    }

    const newContract: ContractDefinition = {
      "@id": input.id,
      "@type": "ContractDefinition",
      accessPolicyId: input.accessPolicyId,
      contractPolicyId: input.contractPolicyId,
      assetsSelector: input.assetsSelector,
      createdAt: Date.now(),
    };

    contracts = [newContract, ...contracts];
    return newContract;
  },

  /**
   * Update an existing contract definition
   */
  async updateContract(
    id: string,
    updates: UpdateContractInput
  ): Promise<ContractDefinition> {
    await delay(500);
    maybeThrowError();

    const contractIndex = contracts.findIndex((c) => c["@id"] === id);
    if (contractIndex === -1) {
      throw new Error(`Contract with ID "${id}" not found`);
    }

    const existingContract = contracts[contractIndex];
    const updatedContract: ContractDefinition = {
      ...existingContract,
      ...(updates.accessPolicyId && {
        accessPolicyId: updates.accessPolicyId,
      }),
      ...(updates.contractPolicyId && {
        contractPolicyId: updates.contractPolicyId,
      }),
      ...(updates.assetsSelector && {
        assetsSelector: updates.assetsSelector,
      }),
    };

    contracts[contractIndex] = updatedContract;
    return updatedContract;
  },

  /**
   * Delete a contract definition
   */
  async deleteContract(id: string): Promise<void> {
    await delay(400);
    maybeThrowError();

    const contractIndex = contracts.findIndex((c) => c["@id"] === id);
    if (contractIndex === -1) {
      throw new Error(`Contract with ID "${id}" not found`);
    }

    contracts = contracts.filter((c) => c["@id"] !== id);
  },

  // ===== HEALTH CHECK =====

  /**
   * Health check - always returns true for mock API
   */
  async healthCheck(): Promise<boolean> {
    await delay(100);
    return true;
  },
};

/**
 * Reset mock data (useful for testing)
 */
export function resetMockData() {
  assets = [...mockAssets];
  policies = [...mockPolicies];
  contracts = [...mockContracts];
}
