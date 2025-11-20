"use client";

import { useState } from "react";
import { FiCheck, FiSearch } from "react-icons/fi";

import {
  getPolicyCategories,
  getPolicyTemplates,
  type PolicyCategory,
  type PolicyTemplate,
  searchTemplates,
} from "@/lib/policy-templates";

import Button from "./Button";
import Card from "./Card";
import Input from "./Input";

interface PolicyTemplateSelectorProps {
  onSelectTemplate: (template: PolicyTemplate) => void;
  onCancel: () => void;
}

export default function PolicyTemplateSelector({
  onSelectTemplate,
  onCancel,
}: PolicyTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    PolicyCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PolicyTemplate | null>(null);

  const categories = getPolicyCategories();
  const allTemplates = getPolicyTemplates();

  // Filter templates based on category and search
  const filteredTemplates =
    searchQuery.trim() !== ""
      ? searchTemplates(searchQuery)
      : selectedCategory === "all"
        ? allTemplates
        : allTemplates.filter(
            (template) => template.category === selectedCategory
          );

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Templates
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-h-[500px] space-y-3 overflow-y-auto p-2">
        {filteredTemplates.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No templates found. Try a different search or category.
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer px-3 py-2 transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">
                      {template.icon}
                    </span>
                    <h3 className="font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    {selectedTemplate?.id === template.id && (
                      <FiCheck
                        className="size-5 text-blue-600"
                        aria-label="Selected"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {template.description}
                  </p>

                  {/* Permissions Preview */}
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-gray-700">
                      Permissions:
                    </p>
                    {template.permissions.map((permission, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-xs text-gray-500">•</span>
                        <div className="flex-1">
                          <p className="text-xs text-gray-700">
                            <strong>{permission.action}</strong> -{" "}
                            {permission.description}
                          </p>
                          {permission.constraints &&
                            permission.constraints.length > 0 && (
                              <ul className="ml-4 mt-1 space-y-1">
                                {permission.constraints.map(
                                  (constraint, cIndex) => (
                                    <li
                                      key={cIndex}
                                      className="text-xs text-gray-500"
                                    >
                                      {constraint.description}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Use Cases */}
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700">
                      View Use Cases
                    </summary>
                    <ul className="ml-4 mt-2 list-disc space-y-1">
                      {template.useCases.map((useCase, index) => (
                        <li key={index} className="text-xs text-gray-600">
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSelectTemplate}
          disabled={!selectedTemplate}
        >
          Use Template
        </Button>
      </div>
    </div>
  );
}
