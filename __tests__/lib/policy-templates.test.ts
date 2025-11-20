/**
 * Tests for Policy Template System
 */

import {
  getPolicyCategories,
  getPolicyTemplates,
  getTemplateById,
  getTemplatesByCategory,
  searchTemplates,
} from "@/lib/policy-templates";

describe("Policy Template System", () => {
  describe("getPolicyTemplates", () => {
    it("should return all policy templates", () => {
      const templates = getPolicyTemplates();
      expect(templates).toBeDefined();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it("should have required fields for each template", () => {
      const templates = getPolicyTemplates();
      templates.forEach((template) => {
        expect(template).toHaveProperty("id");
        expect(template).toHaveProperty("name");
        expect(template).toHaveProperty("description");
        expect(template).toHaveProperty("category");
        expect(template).toHaveProperty("icon");
        expect(template).toHaveProperty("permissions");
        expect(template).toHaveProperty("useCases");
        expect(template).toHaveProperty("tags");
      });
    });

    it("should have at least one permission for each template", () => {
      const templates = getPolicyTemplates();
      templates.forEach((template) => {
        expect(template.permissions.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getTemplatesByCategory", () => {
    it("should return templates for data-sharing category", () => {
      const templates = getTemplatesByCategory("data-sharing");
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((template) => {
        expect(template.category).toBe("data-sharing");
      });
    });

    it("should return templates for access-control category", () => {
      const templates = getTemplatesByCategory("access-control");
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((template) => {
        expect(template.category).toBe("access-control");
      });
    });

    it("should return templates for compliance category", () => {
      const templates = getTemplatesByCategory("compliance");
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((template) => {
        expect(template.category).toBe("compliance");
      });
    });

    it("should return templates for usage-restriction category", () => {
      const templates = getTemplatesByCategory("usage-restriction");
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((template) => {
        expect(template.category).toBe("usage-restriction");
      });
    });

    it("should return templates for time-based category", () => {
      const templates = getTemplatesByCategory("time-based");
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((template) => {
        expect(template.category).toBe("time-based");
      });
    });

    it("should return templates for location-based category", () => {
      const templates = getTemplatesByCategory("location-based");
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((template) => {
        expect(template.category).toBe("location-based");
      });
    });

    it("should return empty array for non-existent category", () => {
      const templates = getTemplatesByCategory("non-existent" as any);
      expect(templates).toEqual([]);
    });
  });

  describe("getTemplateById", () => {
    it("should return template by id", () => {
      const template = getTemplateById("unrestricted-use");
      expect(template).toBeDefined();
      expect(template?.id).toBe("unrestricted-use");
      expect(template?.name).toBe("Unrestricted Use");
    });

    it("should return read-only-access template", () => {
      const template = getTemplateById("read-only-access");
      expect(template).toBeDefined();
      expect(template?.id).toBe("read-only-access");
    });

    it("should return undefined for non-existent id", () => {
      const template = getTemplateById("non-existent-template");
      expect(template).toBeUndefined();
    });
  });

  describe("searchTemplates", () => {
    it("should find templates by name", () => {
      const results = searchTemplates("commercial");
      expect(results.length).toBeGreaterThan(0);
      const hasCommercial = results.some((t) =>
        t.name.toLowerCase().includes("commercial")
      );
      expect(hasCommercial).toBe(true);
    });

    it("should find templates by description", () => {
      const results = searchTemplates("gdpr");
      expect(results.length).toBeGreaterThan(0);
      const hasGDPR = results.some(
        (t) =>
          t.description.toLowerCase().includes("gdpr") ||
          t.tags.some((tag) => tag.toLowerCase().includes("gdpr"))
      );
      expect(hasGDPR).toBe(true);
    });

    it("should find templates by tags", () => {
      const results = searchTemplates("research");
      expect(results.length).toBeGreaterThan(0);
      const hasResearch = results.some((t) =>
        t.tags.some((tag) => tag.toLowerCase().includes("research"))
      );
      expect(hasResearch).toBe(true);
    });

    it("should find templates by use cases", () => {
      const results = searchTemplates("academic");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case-insensitive", () => {
      const lowerResults = searchTemplates("commercial");
      const upperResults = searchTemplates("COMMERCIAL");
      const mixedResults = searchTemplates("CoMmErCiAl");

      expect(lowerResults).toEqual(upperResults);
      expect(lowerResults).toEqual(mixedResults);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchTemplates("xyz123nonexistent");
      expect(results).toEqual([]);
    });

    it("should return all templates for empty query", () => {
      const results = searchTemplates("");
      const allTemplates = getPolicyTemplates();
      expect(results.length).toBe(allTemplates.length);
    });
  });

  describe("getPolicyCategories", () => {
    it("should return all policy categories", () => {
      const categories = getPolicyCategories();
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(6);
    });

    it("should have required fields for each category", () => {
      const categories = getPolicyCategories();
      categories.forEach((category) => {
        expect(category).toHaveProperty("id");
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("description");
        expect(category).toHaveProperty("icon");
      });
    });

    it("should include all expected categories", () => {
      const categories = getPolicyCategories();
      const categoryIds = categories.map((c) => c.id);

      expect(categoryIds).toContain("data-sharing");
      expect(categoryIds).toContain("access-control");
      expect(categoryIds).toContain("compliance");
      expect(categoryIds).toContain("usage-restriction");
      expect(categoryIds).toContain("time-based");
      expect(categoryIds).toContain("location-based");
    });
  });

  describe("Template Content Validation", () => {
    it("should have unrestricted-use template", () => {
      const template = getTemplateById("unrestricted-use");
      expect(template?.name).toBe("Unrestricted Use");
      expect(template?.category).toBe("data-sharing");
      expect(template?.permissions.length).toBeGreaterThan(0);
    });

    it("should have gdpr-compliant template with constraints", () => {
      const template = getTemplateById("gdpr-compliant");
      expect(template?.name).toBe("GDPR Compliant");
      expect(template?.category).toBe("compliance");
      const hasConstraints = template?.permissions.some(
        (p) => p.constraints && p.constraints.length > 0
      );
      expect(hasConstraints).toBe(true);
    });

    it("should have time-limited-access template", () => {
      const template = getTemplateById("time-limited-access");
      expect(template?.name).toBe("Time-Limited Access");
      expect(template?.category).toBe("time-based");
    });

    it("should have commercial-use template", () => {
      const template = getTemplateById("commercial-use");
      expect(template?.name).toBe("Commercial Use Allowed");
      expect(template?.category).toBe("data-sharing");
    });

    it("all templates should have unique IDs", () => {
      const templates = getPolicyTemplates();
      const ids = templates.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("all template permissions should have actions", () => {
      const templates = getPolicyTemplates();
      templates.forEach((template) => {
        template.permissions.forEach((permission) => {
          expect(permission.action).toBeDefined();
          expect(typeof permission.action).toBe("string");
          expect(permission.action.length).toBeGreaterThan(0);
        });
      });
    });

    it("all template constraints should have valid operators", () => {
      const validOperators = [
        "eq",
        "neq",
        "gt",
        "geq",
        "lt",
        "leq",
        "in",
        "hasPart",
        "isA",
        "isAllOf",
        "isAnyOf",
        "isNoneOf",
      ];

      const templates = getPolicyTemplates();
      templates.forEach((template) => {
        template.permissions.forEach((permission) => {
          permission.constraints?.forEach((constraint) => {
            expect(validOperators).toContain(constraint.operator);
          });
        });
      });
    });
  });
});
