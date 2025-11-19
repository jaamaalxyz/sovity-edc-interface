/**
 * Accessibility Utility Functions
 * Helpers for focus management, ARIA, and keyboard navigation
 */

/**
 * Generate a unique ID for accessibility purposes
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  );
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // If Tab key is pressed
  if (event.key === "Tab") {
    // If Shift+Tab on first element, focus last
    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable?.focus();
    }
    // If Tab on last element, focus first
    else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable?.focus();
    }
  }
}

/**
 * Focus the first focusable element in a container
 */
export function focusFirstElement(container: HTMLElement): void {
  const focusableElements = getFocusableElements(container);
  focusableElements[0]?.focus();
}

/**
 * Announce a message to screen readers using a live region
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if an element is currently visible (for skip links)
 */
export function isElementVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Keyboard navigation helper
 */
export const KEYBOARD_KEYS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
} as const;

/**
 * Check if a keyboard event is an activation key (Enter or Space)
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE;
}

/**
 * ARIA live region priorities
 */
export const ARIA_LIVE = {
  OFF: "off",
  POLITE: "polite",
  ASSERTIVE: "assertive",
} as const;

/**
 * ARIA roles
 */
export const ARIA_ROLES = {
  DIALOG: "dialog",
  ALERTDIALOG: "alertdialog",
  STATUS: "status",
  ALERT: "alert",
  NAVIGATION: "navigation",
  MAIN: "main",
  REGION: "region",
  BUTTON: "button",
} as const;
