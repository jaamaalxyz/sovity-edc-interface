/**
 * Policy Types for Sovity EDC Connector
 * Based on Eclipse Dataspace Components (EDC) specification
 */

export interface Policy {
  "@id": string;
  "@type"?: string;
  "@context"?: Record<string, unknown>;
  permissions?: Permission[];
  prohibitions?: Prohibition[];
  obligations?: Duty[];
  target?: string;
  assigner?: string;
  assignee?: string;
}

export interface Permission {
  action: string | Action;
  constraint?: Constraint[];
  constraints?: Constraint[];
  duties?: Duty[];
  target?: string;
}

export interface Prohibition {
  action: string | Action;
  constraint?: Constraint[];
  constraints?: Constraint[];
  target?: string;
}

export interface Duty {
  action: string | Action;
  constraint?: Constraint[];
  constraints?: Constraint[];
  consequence?: Duty[];
  target?: string;
}

export interface Action {
  type: string;
  includedIn?: string;
  constraint?: Constraint[];
}

export interface Constraint {
  "@type"?: string;
  leftOperand: string;
  operator: ConstraintOperator;
  rightOperand: string | number | boolean;
}

export type ConstraintOperator =
  | "eq"
  | "neq"
  | "gt"
  | "geq"
  | "lt"
  | "leq"
  | "in"
  | "hasPart"
  | "isA"
  | "isAllOf"
  | "isAnyOf"
  | "isNoneOf";

export interface CreatePolicyInput {
  id: string;
  policy: {
    permissions: Array<{
      action: string;
      constraints?: Constraint[];
    }>;
    prohibitions?: Array<{
      action: string;
      constraints?: Constraint[];
    }>;
    obligations?: Array<{
      action: string;
      constraints?: Constraint[];
    }>;
  };
}

export interface PolicyDefinition {
  "@id": string;
  "@type": string;
  policy: Policy;
}

export interface PolicyListResponse {
  policies: PolicyDefinition[];
  total?: number;
}
