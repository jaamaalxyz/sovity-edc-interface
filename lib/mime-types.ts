/**
 * MIME Types Constants
 * Curated list of common MIME types for EDC assets
 * Reference: https://www.iana.org/assignments/media-types/media-types.xhtml
 */

export interface MimeTypeOption {
  value: string;
  label: string;
  category: string;
}

/**
 * Grouped MIME types by category for better UX
 */
export const MIME_TYPE_CATEGORIES = {
  DATA: "Data Formats",
  DOCUMENTS: "Documents",
  SPREADSHEETS: "Spreadsheets",
  IMAGES: "Images",
  ARCHIVES: "Archives",
  BINARY: "Binary",
  OTHER: "Other",
} as const;

/**
 * Common MIME types organized by category
 */
export const MIME_TYPES: MimeTypeOption[] = [
  // Data Formats
  {
    value: "application/json",
    label: "JSON (application/json)",
    category: MIME_TYPE_CATEGORIES.DATA,
  },
  {
    value: "application/xml",
    label: "XML (application/xml)",
    category: MIME_TYPE_CATEGORIES.DATA,
  },
  {
    value: "text/csv",
    label: "CSV (text/csv)",
    category: MIME_TYPE_CATEGORIES.DATA,
  },
  {
    value: "text/plain",
    label: "Plain Text (text/plain)",
    category: MIME_TYPE_CATEGORIES.DATA,
  },
  {
    value: "application/ld+json",
    label: "JSON-LD (application/ld+json)",
    category: MIME_TYPE_CATEGORIES.DATA,
  },

  // Documents
  {
    value: "application/pdf",
    label: "PDF (application/pdf)",
    category: MIME_TYPE_CATEGORIES.DOCUMENTS,
  },
  {
    value: "text/html",
    label: "HTML (text/html)",
    category: MIME_TYPE_CATEGORIES.DOCUMENTS,
  },
  {
    value: "text/markdown",
    label: "Markdown (text/markdown)",
    category: MIME_TYPE_CATEGORIES.DOCUMENTS,
  },

  // Spreadsheets
  {
    value: "application/vnd.ms-excel",
    label: "Excel (.xls)",
    category: MIME_TYPE_CATEGORIES.SPREADSHEETS,
  },
  {
    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    label: "Excel (.xlsx)",
    category: MIME_TYPE_CATEGORIES.SPREADSHEETS,
  },
  {
    value: "application/vnd.oasis.opendocument.spreadsheet",
    label: "OpenDocument Spreadsheet (.ods)",
    category: MIME_TYPE_CATEGORIES.SPREADSHEETS,
  },

  // Images
  {
    value: "image/jpeg",
    label: "JPEG Image (image/jpeg)",
    category: MIME_TYPE_CATEGORIES.IMAGES,
  },
  {
    value: "image/png",
    label: "PNG Image (image/png)",
    category: MIME_TYPE_CATEGORIES.IMAGES,
  },
  {
    value: "image/svg+xml",
    label: "SVG Image (image/svg+xml)",
    category: MIME_TYPE_CATEGORIES.IMAGES,
  },
  {
    value: "image/gif",
    label: "GIF Image (image/gif)",
    category: MIME_TYPE_CATEGORIES.IMAGES,
  },

  // Archives
  {
    value: "application/zip",
    label: "ZIP Archive (application/zip)",
    category: MIME_TYPE_CATEGORIES.ARCHIVES,
  },
  {
    value: "application/gzip",
    label: "GZIP Archive (application/gzip)",
    category: MIME_TYPE_CATEGORIES.ARCHIVES,
  },
  {
    value: "application/x-tar",
    label: "TAR Archive (application/x-tar)",
    category: MIME_TYPE_CATEGORIES.ARCHIVES,
  },

  // Binary
  {
    value: "application/octet-stream",
    label: "Binary Data (application/octet-stream)",
    category: MIME_TYPE_CATEGORIES.BINARY,
  },
];

/**
 * Default MIME type for new assets
 */
export const DEFAULT_MIME_TYPE = "application/json";

/**
 * Custom MIME type option value
 */
export const CUSTOM_MIME_TYPE_VALUE = "__custom__";

/**
 * Get MIME types grouped by category
 */
export function getMimeTypesByCategory() {
  const grouped = new Map<string, MimeTypeOption[]>();

  MIME_TYPES.forEach((mimeType) => {
    const existing = grouped.get(mimeType.category) || [];
    grouped.set(mimeType.category, [...existing, mimeType]);
  });

  return grouped;
}

/**
 * Validate MIME type format
 * Format: type/subtype (e.g., application/json)
 */
export function isValidMimeTypeFormat(mimeType: string): boolean {
  const mimeTypeRegex = /^[a-z]+\/[a-z0-9\-\+\.]+$/i;
  return mimeTypeRegex.test(mimeType);
}

/**
 * Get label for a MIME type value
 */
export function getMimeTypeLabel(value: string): string {
  const mimeType = MIME_TYPES.find((mt) => mt.value === value);
  return mimeType?.label || value;
}
