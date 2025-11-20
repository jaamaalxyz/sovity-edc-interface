import type { Constraint, ConstraintOperator } from "@/types/policy";

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  icon: string;
  permissions: TemplatePermission[];
  useCases: string[];
  tags: string[];
}

export interface TemplatePermission {
  action: string;
  description: string;
  constraints?: TemplateConstraint[];
}

export interface TemplateConstraint {
  leftOperand: string;
  operator: ConstraintOperator;
  rightOperand: string;
  description: string;
}

export type PolicyCategory =
  | "data-sharing"
  | "access-control"
  | "compliance"
  | "usage-restriction"
  | "time-based"
  | "location-based";

export const policyTemplates: PolicyTemplate[] = [
  {
    id: "unrestricted-use",
    name: "Unrestricted Use",
    description:
      "Allows unrestricted use of data with no limitations or constraints",
    category: "data-sharing",
    icon: "🌐",
    permissions: [
      {
        action: "use",
        description: "Use the data for any purpose",
        constraints: [],
      },
    ],
    useCases: ["Open data sharing", "Public datasets", "Internal company data"],
    tags: ["open", "public", "unrestricted"],
  },
  {
    id: "read-only-access",
    name: "Read-Only Access",
    description: "Allows data viewing and reading but prohibits modification",
    category: "access-control",
    icon: "👁️",
    permissions: [
      {
        action: "use",
        description: "Read and view the data",
        constraints: [],
      },
      {
        action: "display",
        description: "Display the data in applications",
        constraints: [],
      },
    ],
    useCases: ["Read-only dashboards", "Analytics access", "Reporting tools"],
    tags: ["read-only", "view", "display"],
  },
  {
    id: "commercial-use",
    name: "Commercial Use Allowed",
    description: "Permits commercial use of data with attribution requirement",
    category: "data-sharing",
    icon: "💼",
    permissions: [
      {
        action: "use",
        description: "Use data for commercial purposes",
        constraints: [
          {
            leftOperand: "purpose",
            operator: "eq",
            rightOperand: "commercial",
            description: "Limited to commercial use only",
          },
        ],
      },
      {
        action: "commercialize",
        description: "Monetize or commercialize the data",
        constraints: [],
      },
    ],
    useCases: ["B2B data sharing", "Data marketplace", "Commercial analytics"],
    tags: ["commercial", "business", "monetize"],
  },
  {
    id: "non-commercial-research",
    name: "Non-Commercial Research",
    description: "Restricts data use to non-commercial research purposes only",
    category: "usage-restriction",
    icon: "🔬",
    permissions: [
      {
        action: "use",
        description: "Use data for research purposes",
        constraints: [
          {
            leftOperand: "purpose",
            operator: "eq",
            rightOperand: "research",
            description: "Research purposes only",
          },
          {
            leftOperand: "commercialUse",
            operator: "eq",
            rightOperand: "false",
            description: "Non-commercial only",
          },
        ],
      },
      {
        action: "derive",
        description: "Create derivative works for research",
        constraints: [],
      },
    ],
    useCases: [
      "Academic research",
      "Scientific studies",
      "University projects",
    ],
    tags: ["research", "academic", "non-commercial"],
  },

  // Time-Based Templates
  {
    id: "time-limited-access",
    name: "Time-Limited Access",
    description: "Grants access for a specific time period (30 days)",
    category: "time-based",
    icon: "⏰",
    permissions: [
      {
        action: "use",
        description: "Use data within time limit",
        constraints: [
          {
            leftOperand: "dateTime",
            operator: "lt",
            rightOperand: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            description: "Valid for 30 days from now",
          },
        ],
      },
    ],
    useCases: ["Trial access", "Temporary sharing", "Time-bound projects"],
    tags: ["temporary", "trial", "time-limited"],
  },
  {
    id: "business-hours-only",
    name: "Business Hours Only",
    description: "Restricts access to business hours (9 AM - 5 PM)",
    category: "time-based",
    icon: "🕒",
    permissions: [
      {
        action: "use",
        description: "Access during business hours",
        constraints: [
          {
            leftOperand: "timeOfDay",
            operator: "geq",
            rightOperand: "09:00:00",
            description: "After 9 AM",
          },
          {
            leftOperand: "timeOfDay",
            operator: "leq",
            rightOperand: "17:00:00",
            description: "Before 5 PM",
          },
        ],
      },
    ],
    useCases: [
      "Office hours access",
      "Business applications",
      "Scheduled data access",
    ],
    tags: ["business-hours", "scheduled", "daytime"],
  },

  // Compliance Templates
  {
    id: "gdpr-compliant",
    name: "GDPR Compliant",
    description: "Enforces GDPR compliance with data processing restrictions",
    category: "compliance",
    icon: "🔒",
    permissions: [
      {
        action: "use",
        description: "Process data in GDPR-compliant manner",
        constraints: [
          {
            leftOperand: "region",
            operator: "eq",
            rightOperand: "EU",
            description: "EU region only",
          },
          {
            leftOperand: "gdprCompliant",
            operator: "eq",
            rightOperand: "true",
            description: "GDPR compliance required",
          },
        ],
      },
      {
        action: "anonymize",
        description: "Anonymize personal data",
        constraints: [],
      },
    ],
    useCases: [
      "EU data processing",
      "Personal data handling",
      "Privacy compliance",
    ],
    tags: ["gdpr", "privacy", "compliance", "eu"],
  },
  {
    id: "data-retention-policy",
    name: "Data Retention Policy",
    description: "Enforces data deletion after retention period (90 days)",
    category: "compliance",
    icon: "🗑️",
    permissions: [
      {
        action: "use",
        description: "Use data during retention period",
        constraints: [
          {
            leftOperand: "retentionPeriod",
            operator: "leq",
            rightOperand: "90",
            description: "Max 90 days retention",
          },
        ],
      },
      {
        action: "delete",
        description: "Delete data after retention period",
        constraints: [],
      },
    ],
    useCases: [
      "Compliance requirements",
      "Data lifecycle management",
      "Legal requirements",
    ],
    tags: ["retention", "deletion", "compliance"],
  },

  // Location-Based Templates
  {
    id: "region-restricted",
    name: "Region Restricted",
    description: "Restricts data access to specific geographic regions",
    category: "location-based",
    icon: "🌍",
    permissions: [
      {
        action: "use",
        description: "Use data in specified regions only",
        constraints: [
          {
            leftOperand: "region",
            operator: "in",
            rightOperand: "US,CA,EU",
            description: "US, Canada, and EU only",
          },
        ],
      },
    ],
    useCases: [
      "Geographic restrictions",
      "Regional compliance",
      "Data sovereignty",
    ],
    tags: ["geographic", "regional", "location"],
  },

  // Access Control Templates
  {
    id: "role-based-access",
    name: "Role-Based Access",
    description: "Grants access based on user roles and permissions",
    category: "access-control",
    icon: "👥",
    permissions: [
      {
        action: "use",
        description: "Access based on role",
        constraints: [
          {
            leftOperand: "userRole",
            operator: "in",
            rightOperand: "admin,editor,viewer",
            description: "Specific roles only",
          },
        ],
      },
    ],
    useCases: [
      "Team access control",
      "Permission management",
      "User hierarchies",
    ],
    tags: ["rbac", "roles", "permissions"],
  },
  {
    id: "authenticated-users-only",
    name: "Authenticated Users Only",
    description: "Requires user authentication for data access",
    category: "access-control",
    icon: "🔐",
    permissions: [
      {
        action: "use",
        description: "Access for authenticated users",
        constraints: [
          {
            leftOperand: "authenticated",
            operator: "eq",
            rightOperand: "true",
            description: "Authentication required",
          },
        ],
      },
    ],
    useCases: ["Secure access", "Protected resources", "Member-only content"],
    tags: ["authentication", "secure", "protected"],
  },

  // Usage Restriction Templates
  {
    id: "no-redistribution",
    name: "No Redistribution",
    description: "Prohibits redistribution or sharing with third parties",
    category: "usage-restriction",
    icon: "🚫",
    permissions: [
      {
        action: "use",
        description: "Use data internally only",
        constraints: [
          {
            leftOperand: "allowRedistribution",
            operator: "eq",
            rightOperand: "false",
            description: "Redistribution prohibited",
          },
        ],
      },
    ],
    useCases: [
      "Confidential data",
      "Proprietary information",
      "Internal use only",
    ],
    tags: ["confidential", "no-sharing", "restricted"],
  },
  {
    id: "attribution-required",
    name: "Attribution Required",
    description: "Requires attribution to the data source",
    category: "usage-restriction",
    icon: "©️",
    permissions: [
      {
        action: "use",
        description: "Use with attribution",
        constraints: [
          {
            leftOperand: "attributionRequired",
            operator: "eq",
            rightOperand: "true",
            description: "Must attribute source",
          },
        ],
      },
      {
        action: "attribute",
        description: "Provide attribution to source",
        constraints: [],
      },
    ],
    useCases: ["Creative commons", "Licensed content", "Academic citations"],
    tags: ["attribution", "credit", "licensing"],
  },

  // Custom/Advanced Templates
  {
    id: "pay-per-use",
    name: "Pay-Per-Use",
    description: "Monetization policy with usage-based pricing",
    category: "data-sharing",
    icon: "💰",
    permissions: [
      {
        action: "use",
        description: "Access with payment",
        constraints: [
          {
            leftOperand: "paymentRequired",
            operator: "eq",
            rightOperand: "true",
            description: "Payment required",
          },
          {
            leftOperand: "pricePerUse",
            operator: "geq",
            rightOperand: "0.01",
            description: "Minimum price per use",
          },
        ],
      },
      {
        action: "compensate",
        description: "Pay for data usage",
        constraints: [],
      },
    ],
    useCases: ["Data marketplaces", "Paid APIs", "Premium content"],
    tags: ["monetization", "payment", "pricing"],
  },
];

/**
 * Get all policy templates
 */
export function getPolicyTemplates(): PolicyTemplate[] {
  return policyTemplates;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: PolicyCategory
): PolicyTemplate[] {
  return policyTemplates.filter((template) => template.category === category);
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): PolicyTemplate | undefined {
  return policyTemplates.find((template) => template.id === id);
}

export function searchTemplates(query: string): PolicyTemplate[] {
  const lowerQuery = query.toLowerCase();
  return policyTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      template.useCases.some((useCase) =>
        useCase.toLowerCase().includes(lowerQuery)
      )
  );
}

export function getPolicyCategories(): {
  id: PolicyCategory;
  name: string;
  description: string;
  icon: string;
}[] {
  return [
    {
      id: "data-sharing",
      name: "Data Sharing",
      description: "Templates for sharing data with different access levels",
      icon: "🔄",
    },
    {
      id: "access-control",
      name: "Access Control",
      description: "Templates for managing user access and permissions",
      icon: "🔑",
    },
    {
      id: "compliance",
      name: "Compliance",
      description: "Templates for regulatory and legal compliance",
      icon: "📋",
    },
    {
      id: "usage-restriction",
      name: "Usage Restrictions",
      description: "Templates for restricting how data can be used",
      icon: "⚠️",
    },
    {
      id: "time-based",
      name: "Time-Based",
      description: "Templates with temporal access restrictions",
      icon: "⏱️",
    },
    {
      id: "location-based",
      name: "Location-Based",
      description: "Templates with geographic restrictions",
      icon: "📍",
    },
  ];
}
