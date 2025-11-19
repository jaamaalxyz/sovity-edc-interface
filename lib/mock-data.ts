/**
 * Mock Data for Development
 * Provides realistic test data for assets and policies
 */

import type { Asset } from "@/types/asset";
import type { ContractDefinition } from "@/types/contract";
import type { PolicyDefinition } from "@/types/policy";

/**
 * Mock Assets
 */
export const mockAssets: Asset[] = [
  {
    "@id": "asset-1",
    "@type": "Asset",
    properties: {
      "asset:prop:id": "asset-1",
      "asset:prop:name": "Customer Database",
      "asset:prop:description":
        "Production customer database with anonymized data",
      "asset:prop:contenttype": "application/json",
      "asset:prop:version": "1.0.0",
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: "https://api.example.com/customers",
    },
  },
  {
    "@id": "asset-2",
    "@type": "Asset",
    properties: {
      "asset:prop:id": "asset-2",
      "asset:prop:name": "Sales Analytics",
      "asset:prop:description": "Real-time sales and revenue analytics data",
      "asset:prop:contenttype": "application/json",
      "asset:prop:version": "2.1.0",
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: "https://api.example.com/sales",
    },
  },
  {
    "@id": "asset-3",
    "@type": "Asset",
    properties: {
      "asset:prop:id": "asset-3",
      "asset:prop:name": "Product Catalog",
      "asset:prop:description":
        "Complete product catalog with pricing and inventory",
      "asset:prop:contenttype": "text/csv",
      "asset:prop:version": "1.5.2",
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: "https://api.example.com/products",
    },
  },
  {
    "@id": "asset-4",
    "@type": "Asset",
    properties: {
      "asset:prop:id": "asset-4",
      "asset:prop:name": "Inventory Reports",
      "asset:prop:description": "Monthly inventory and stock reports",
      "asset:prop:contenttype": "application/pdf",
      "asset:prop:version": "1.0.0",
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: "https://api.example.com/inventory",
    },
  },
  {
    "@id": "asset-5",
    "@type": "Asset",
    properties: {
      "asset:prop:id": "asset-5",
      "asset:prop:name": "Marketing Data",
      "asset:prop:description":
        "Customer engagement and marketing campaign data",
      "asset:prop:contenttype": "application/json",
      "asset:prop:version": "3.0.0",
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: "https://api.example.com/marketing",
    },
  },
];

/**
 * Mock Policies
 */
export const mockPolicies: PolicyDefinition[] = [
  {
    "@id": "policy-1",
    "@type": "PolicyDefinition",
    policy: {
      "@id": "policy-1-policy",
      "@type": "Policy",
      permissions: [
        {
          action: "USE",
          constraint: [
            {
              leftOperand: "region",
              operator: "eq",
              rightOperand: "EU",
            },
          ],
        },
      ],
    },
  },
  {
    "@id": "policy-2",
    "@type": "PolicyDefinition",
    policy: {
      "@id": "policy-2-policy",
      "@type": "Policy",
      permissions: [
        {
          action: "TRANSFER",
          constraint: [
            {
              leftOperand: "purpose",
              operator: "eq",
              rightOperand: "research",
            },
          ],
        },
      ],
    },
  },
  {
    "@id": "policy-3",
    "@type": "PolicyDefinition",
    policy: {
      "@id": "policy-3-policy",
      "@type": "Policy",
      permissions: [
        {
          action: "USE",
        },
      ],
    },
  },
  {
    "@id": "policy-4",
    "@type": "PolicyDefinition",
    policy: {
      "@id": "policy-4-policy",
      "@type": "Policy",
      permissions: [
        {
          action: "DISPLAY",
          constraint: [
            {
              leftOperand: "country",
              operator: "in",
              rightOperand: "US,CA,MX",
            },
          ],
        },
      ],
    },
  },
  {
    "@id": "policy-5",
    "@type": "PolicyDefinition",
    policy: {
      "@id": "policy-5-policy",
      "@type": "Policy",
      permissions: [
        {
          action: "MODIFY",
          constraint: [
            {
              leftOperand: "role",
              operator: "eq",
              rightOperand: "admin",
            },
            {
              leftOperand: "department",
              operator: "eq",
              rightOperand: "engineering",
            },
          ],
        },
      ],
    },
  },
];

/**
 * Mock Contract Definitions
 * Links assets to policies for data sharing
 */
export const mockContracts: ContractDefinition[] = [
  {
    "@id": "contract-1",
    "@type": "ContractDefinition",
    accessPolicyId: "policy-1",
    contractPolicyId: "policy-1",
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "=",
        operandRight: "asset-1",
      },
    ],
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
  },
  {
    "@id": "contract-2",
    "@type": "ContractDefinition",
    accessPolicyId: "policy-2",
    contractPolicyId: "policy-3",
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "=",
        operandRight: "asset-2",
      },
    ],
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
  },
  {
    "@id": "contract-3",
    "@type": "ContractDefinition",
    accessPolicyId: "policy-3",
    contractPolicyId: "policy-3",
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "=",
        operandRight: "asset-3",
      },
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "=",
        operandRight: "asset-4",
      },
    ],
    createdAt: Date.now() - 86400000 * 3, // 3 days ago
  },
  {
    "@id": "contract-4",
    "@type": "ContractDefinition",
    accessPolicyId: "policy-4",
    contractPolicyId: "policy-4",
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "=",
        operandRight: "asset-5",
      },
    ],
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    "@id": "contract-5",
    "@type": "ContractDefinition",
    accessPolicyId: "policy-1",
    contractPolicyId: "policy-5",
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/contenttype",
        operator: "=",
        operandRight: "application/json",
      },
    ],
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
  },
];
