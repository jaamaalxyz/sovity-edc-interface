/**
 * Contract Definition Types for Sovity EDC Connector
 * Contract Definitions link Assets to Policies for data sharing
 */

export interface ContractDefinition {
  "@id": string;
  "@type": string;
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: AssetSelector[];
  createdAt?: number;
}

export interface AssetSelector {
  "@type"?: string;
  operandLeft: string;
  operator: string;
  operandRight: string;
}

export interface CreateContractInput {
  id: string;
  accessPolicyId: string;
  contractPolicyId: string;
  assetsSelector: AssetSelector[];
}

export interface ContractListResponse {
  contracts: ContractDefinition[];
  total?: number;
}

export interface UpdateContractInput {
  accessPolicyId?: string;
  contractPolicyId?: string;
  assetsSelector?: AssetSelector[];
}
