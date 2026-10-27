/**
 * domUtils.js — DevConnect Auth
 *
 * Topics: DOM Introduction, querySelector/querySelectorAll/getElementById,
 *         DOM Manipulation (styles, create/remove elements, DOM Traversal),
 *         Event Handling, Template Literals, Arrow Functions, Array Methods
 */

// ── DOM Selection Helpers ──

/**
 * Select a single element. Wraps querySelector.
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {Element|null}
 */
const qs = (selector, context = document) => context.querySelector(selector);

/**
 * Select multiple elements as a real Array (not NodeList).
 * Topics: querySelectorAll, Array.from (array creation)
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {Element[]}
 */
const qsAll = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/**
 * Select by ID.
 * @param {string} id
 * @returns {Element|null}
 */
const byId = (id) => document.getElementById(id);

// ── Element Creation ──

/**
 * Create a DOM element with attributes and optional text.
 * Topics: createElement, setAttribute, textContent, DOM manipulation
 * @param {string} tag
 * @param {Object} [attrs={}]
 * @param {string} [text='']
 * @returns {Element}
 */
const createElement = (tag, attrs = {}, text = '') => {
  const el = document.createElement(tag);

  // for...in loop to set attributes (topic: for...in, Objects)
  for (const key in attrs) {
    if (key === 'className') {
      el.className = attrs[key];
    } else {
      el.setAttribute(key, attrs[key]);
    }
  }

  if (text) el.textContent = text;
  return el;
};

// ── Error Display ──

/**
 * Show a field-level error message.
 * Topics: DOM traversal, textContent, classList, template literals
 * @param {string} fieldId
 * @param {string} message
 */
const showFieldError = (fieldId, message) => {
  const input = byId(fieldId);
  const errorEl = byId(`${fieldId}-error`);

  if (input) {
    input.classList.add('is-error');
    input.classList.remove('is-success');
  }

  if (errorEl) {
    errorEl.textContent = message ? `⚠ ${message}` : '';
  }
};

/**
 * Clear a field-level error.
 * @param {string} fieldId
 */
const clearFieldError = (fieldId) => {
  const input   = byId(fieldId);
  const errorEl = byId(`${fieldId}-error`);

  if (input) {
    input.classList.remove('is-error');
  }

  if (errorEl) {
    errorEl.textContent = '';
  }
};

/**
 * Mark a field as valid (green border).
 * @param {string} fieldId
 */
const markFieldValid = (fieldId) => {
  const input = byId(fieldId);
  if (input) {
    input.classList.remove('is-error');
    input.classList.add('is-success');
  }
  clearFieldError(fieldId);
};

/**
 * Display multiple field errors at once.
 * Topics: Object.entries (for...of on entries), Array iteration
 * @param {Object} errors - { fieldId: message }
 */
const showFormErrors = (errors) => {
  // Use for...of on Object.entries (topic: for...of, destructuring)
  for (const [fieldId, message] of Object.entries(errors)) {
    showFieldError(fieldId, message);
  }
};

/**
 * Clear all errors for given field IDs.
 * Topics: Array.forEach (HOF)
 * @param {string[]} fieldIds
 */
const clearAllErrors = (fieldIds) => {
  fieldIds.forEach((id) => clearFieldError(id));
};

// ── Alert Box (form-level) ──

/**
 * Show or hide a form-level alert box.
 * Topics: DOM manipulation, classList, textContent
 * @param {string} alertId - element ID
 * @param {string} message
 * @param {'error'|'success'} type
 */
const showAlert = (alertId, message, type = 'error') => {
  const el = byId(alertId);
  if (!el) return;

  el.className = `alert-box alert-${type}`;
  el.innerHTML = `<span>${type === 'error' ? '✕' : '✓'}</span><span>${message}</span>`;
  el.style.display = 'flex';
};

const hideAlert = (alertId) => {
  const el = byId(alertId);
  if (el) el.style.display = 'none';
};

// ── Button Loading State ──

/**
 * Set button into loading state (disables it and shows spinner).
 * Topics: DOM manipulation, template literals, createElement
 * @param {string} btnId
 * @param {string} [loadingText='Please wait...']
 */
const setButtonLoading = (btnId, loadingText = 'Please wait...') => {
  const btn = byId(btnId);
  if (!btn) return;

  btn.disabled = true;
  // Template literal for innerHTML
  btn.innerHTML = `<span class="btn-spinner"></span>${loadingText}`;
  btn.dataset.originalText = btn.dataset.originalText || loadingText;
};

/**
 * Restore button to normal state.
 * @param {string} btnId
 * @param {string} text
 */
const setButtonReady = (btnId, text) => {
  const btn = byId(btnId);
  if (!btn) return;
  btn.disabled = false;
  btn.innerHTML = text;
};

// ── Toast Notifications ──

// Toast container — created once and reused
let toastContainer = null;

const getToastContainer = () => {
  if (!toastContainer) {
    toastContainer = createElement('div', { className: 'toast-container', id: 'toast-container' });
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

/**
 * Show a toast notification.
 * Topics: createElement, appendChild, setTimeout (async), removeChild
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration - ms
 */
const showToast = (message, type = 'info', duration = 4000) => {
  const container = getToastContainer();

  // Create toast element
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = createElement('div', { className: `toast toast-${type}` });
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;

  container.appendChild(toast);

  // Auto-remove after duration (callback + setTimeout — topic: callbacks, async JS)
  const removeToast = () => {
    toast.style.animation = 'toastOut 0.3s ease both';
    // Wait for animation then remove from DOM (DOM removal topic)
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  };

  setTimeout(removeToast, duration);
};

// ── Shake Animation ──

/**
 * Apply shake animation to an element (feedback on error).
 * Topics: classList, setTimeout, DOM traversal
 * @param {string|Element} target - selector string or element
 */
const shakeElement = (target) => {
  const el = typeof target === 'string' ? qs(target) : target;
  if (!el) return;

  el.classList.add('shake');
  // Remove class after animation completes
  el.addEventListener('animationend', () => {
    el.classList.remove('shake');
  }, { once: true });
};

// ── Password Visibility Toggle ──

/**
 * Toggle password visibility for an input.
 * Topics: DOM manipulation, conditional, dataset, event handling
 * @param {string} inputId
 * @param {string} btnId
 */
const togglePasswordVisibility = (inputId, btnId) => {
  const input = byId(inputId);
  const btn   = byId(btnId);
  if (!input || !btn) return;

  const isHidden = input.type === 'password';
  input.type     = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? '🙈' : '👁';
  btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
};

// ── Strength Bar Update ──

/**
 * Update the password strength bar in the DOM.
 * Topics: DOM style manipulation, template literals
 * @param {string} barId
 * @param {string} labelId
 * @param {{ percent: number, color: string, label: string }} meta
 */
const updateStrengthBar = (barId, labelId, { percent, color, label }) => {
  const bar   = byId(barId);
  const lbl   = byId(labelId);

  if (bar) {
    bar.style.width      = `${percent}%`;
    bar.style.background = color;
  }
  if (lbl) {
    lbl.textContent  = label;
    lbl.style.color  = color;
  }
};

// ── Redirect Helper ──

/**
 * Redirect with a short delay (lets toast show first).
 * Topics: setTimeout, template literals
 * @param {string} url
 * @param {number} delay - ms
 */
const redirectTo = (url, delay = 1200) => {
  setTimeout(() => {
    window.location.href = url;
  }, delay);
};

export {
  qs,
  qsAll,
  byId,
  createElement,
  showFieldError,
  clearFieldError,
  markFieldValid,
  showFormErrors,
  clearAllErrors,
  showAlert,
  hideAlert,
  setButtonLoading,
  setButtonReady,
  showToast,
  shakeElement,
  togglePasswordVisibility,
  updateStrengthBar,
  redirectTo
};
