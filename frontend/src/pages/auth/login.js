/**
 * login.js — DevConnect Authentication
 *
 * Topics Covered:
 *  - Event Handling (submit, input, click, keyboard events, preventDefault, event object)
 *  - DOM Selection (getElementById, querySelector, querySelectorAll)
 *  - Form Validation & User Input Handling
 *  - Higher Order Functions (forEach, filter)
 *  - Async/Await, Fetch REST API consumption, JSON Handling
 *  - LocalStorage & SessionStorage browser data management
 *  - ES6 Features (Destructuring, Spread, Template Literals, Arrow Functions)
 *  - Dynamic DOM updates & animations
 */

import { loginUser, getErrorMessage } from './authService.js';
import { validateLoginForm, validateEmail } from './validator.js';
import {
  byId,
  qs,
  showFieldError,
  clearFieldError,
  showFormErrors,
  clearAllErrors,
  showAlert,
  hideAlert,
  setButtonLoading,
  setButtonReady,
  showToast,
  shakeElement,
  togglePasswordVisibility,
  redirectTo
} from './domUtils.js';
import {
  saveToken,
  saveUser,
  getAuthData,
  saveFormDraft,
  getFormDraft,
  clearFormDraft
} from './storage.js';

// ── DOM Element References ──
const form           = byId('login-form');
const emailInput     = byId('email');
const passwordInput  = byId('password');
const rememberCheck  = byId('remember-me');
const submitBtn      = byId('submit-btn');
const togglePwBtn    = byId('toggle-password');
const alertBoxId     = 'form-alert';

const FORM_FIELDS = ['email', 'password'];

// ── Check if already logged in ──
// Topics: Conditional, LocalStorage, Arrow function
const checkExistingSession = () => {
  const { isAuth, user } = getAuthData();
  if (isAuth && user) {
    showToast(`Welcome back, ${user.fullName}!`, 'info', 2000);
  }
};

// ── Restore saved draft (SessionStorage Topic) ──
const restoreDraft = () => {
  const draft = getFormDraft('login');
  if (draft) {
    // Object destructuring (ES6)
    const { email, remember } = draft;
    if (email) emailInput.value = email;
    if (typeof remember === 'boolean') rememberCheck.checked = remember;
  }
};

// ── Real-time Input Validation Listeners ──
// Topics: Event Handling (input, blur), Arrow Functions, DOM Traversal
const setupInputListeners = () => {
  // Array iteration using forEach (Higher Order Function)
  FORM_FIELDS.forEach((fieldId) => {
    const input = byId(fieldId);
    if (!input) return;

    // 'input' event: clear error dynamically as user types
    input.addEventListener('input', (event) => {
      // Event object inspection
      const target = event.target;
      clearFieldError(target.id);
      hideAlert(alertBoxId);

      // Save draft on the fly to sessionStorage
      saveFormDraft('login', {
        email: emailInput.value.trim(),
        remember: rememberCheck.checked
      });
    });

    // 'blur' event: validate field when focus leaves
    input.addEventListener('blur', (event) => {
      const field = event.target.id;
      if (field === 'email' && emailInput.value.trim()) {
        const result = validateEmail(emailInput.value);
        if (!result.valid) {
          showFieldError('email', result.error);
        }
      }
    });
  });

  // Password visibility toggle click event
  if (togglePwBtn) {
    togglePwBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default button behavior
      togglePasswordVisibility('password', 'toggle-password');
    });
  }

  // Keyboard accessibility: Enter key on form triggers submission
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
      // Keyboard event handling
    }
  });
};

// ── Form Submission Handler ──
// Topics: Async/Await, Form Handling, preventDefault, Error Handling, Promises
const handleFormSubmit = async (event) => {
  // Prevent browser's native full page reload
  event.preventDefault();

  // Hide previous alerts and clear errors
  hideAlert(alertBoxId);
  clearAllErrors(FORM_FIELDS);

  // Extract values using ES6 object literal
  const formData = {
    email: emailInput.value.trim(),
    password: passwordInput.value
  };

  // Step 1: Client-side Validation (Validator Module)
  const validation = validateLoginForm(formData);

  if (!validation.valid) {
    // Display all field errors dynamically
    showFormErrors(validation.errors);
    shakeElement('.auth-card');
    showToast('Please fix the errors below.', 'error', 3000);
    return;
  }

  // Step 2: Set Loading State (DOM Manipulation)
  setButtonLoading('submit-btn', 'Signing in...');

  try {
    // Step 3: REST API Consumption via Fetch (Async/Await + JSON)
    const response = await loginUser(formData);

    // Step 4: Handle Successful Authentication
    const { token, user } = response.data;
    const remember = rememberCheck.checked;

    // Store token and user data in browser storage
    saveToken(token, remember);
    saveUser(user);
    clearFormDraft('login');

    // Show Success UI
    showToast(`Signed in successfully! Welcome, ${user.fullName}.`, 'success', 2000);
    showAlert(alertBoxId, 'Sign in successful! Redirecting...', 'success');

    // Determine redirect destination based on role (Conditionals / Routing)
    let redirectUrl = '../../index.html';
    if (user.role === 'student') {
      redirectUrl = '../student/Dashboard.html';
    } else if (user.role === 'recruiter') {
      redirectUrl = '../recruiter/Dashboard.html';
    }

    // Redirect after brief visual confirmation
    redirectTo(redirectUrl, 1500);

  } catch (error) {
    // Step 5: Handle API / Network Errors
    const message = getErrorMessage(error);
    showAlert(alertBoxId, message, 'error');
    shakeElement('.auth-card');
    showToast(message, 'error', 4000);

    // If unauthorized (401), highlight password field
    if (error.status === 401) {
      showFieldError('password', 'Invalid credentials');
    }
  } finally {
    // Restore button state
    setButtonReady('submit-btn', 'Sign In');
  }
};

// ── Initialization (DOM Content Loaded) ──
document.addEventListener('DOMContentLoaded', () => {
  checkExistingSession();
  restoreDraft();
  setupInputListeners();

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});
