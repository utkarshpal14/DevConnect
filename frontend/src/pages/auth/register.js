/**
 * register.js — DevConnect Authentication
 *
 * Topics Covered:
 *  - Event Handling (submit, input, change, click, event object, preventDefault)
 *  - Higher Order Functions (forEach, map, filter, every, reduce)
 *  - Password Strength Calculation & Real-time DOM Style Updates
 *  - Form Validation & User Feedback
 *  - Async/Await, Fetch REST API Integration, JSON Parsing
 *  - LocalStorage / SessionStorage Draft Management
 *  - ES6 (Template Literals, Destructuring, Spread, Rest, Default Parameters)
 *  - DOM Traversal & Element Styling
 */

import { registerUser, getErrorMessage } from './authService.js';
import {
  validateRegisterForm,
  validatePassword,
  getStrengthMeta,
  VALID_ROLES
} from './validator.js';
import {
  byId,
  qs,
  qsAll,
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
} from './domUtils.js';
import { saveFormDraft, getFormDraft, clearFormDraft } from './storage.js';

// ── DOM Element References ──
const form               = byId('register-form');
const fullNameInput      = byId('fullName');
const emailInput         = byId('email');
const passwordInput      = byId('password');
const confirmPwInput     = byId('confirmPassword');
const roleInputs         = qsAll('input[name="role"]');
const submitBtn          = byId('submit-btn');
const togglePwBtn        = byId('toggle-password');
const toggleConfirmPwBtn = byId('toggle-confirm-password');
const alertBoxId         = 'form-alert';

const FORM_FIELDS = ['fullName', 'email', 'password', 'confirmPassword', 'role'];

// ── Helper to Get Selected Role (Array.find - HOF topic) ──
const getSelectedRole = () => {
  const selected = roleInputs.find((radio) => radio.checked);
  return selected ? selected.value : '';
};

// ── Real-time Password Strength Handler ──
// Topics: Event Handling (input), HOFs, DOM Style manipulation
const handlePasswordInput = () => {
  const password = passwordInput.value;
  const { strength } = validatePassword(password, false);
  const meta = getStrengthMeta(strength);

  // Update visual meter bar in DOM
  updateStrengthBar('strength-bar-fill', 'strength-label', meta);

  // Validate confirm password match if already entered
  if (confirmPwInput.value) {
    if (confirmPwInput.value !== password) {
      showFieldError('confirmPassword', 'Passwords do not match');
    } else {
      markFieldValid('confirmPassword');
    }
  }
};

// ── Restore saved form draft from SessionStorage ──
const restoreDraft = () => {
  const draft = getFormDraft('register');
  if (draft) {
    const { fullName, email, role } = draft;
    if (fullName) fullNameInput.value = fullName;
    if (email) emailInput.value = email;
    if (role) {
      roleInputs.forEach((radio) => {
        radio.checked = radio.value === role;
      });
    }
  }
};

// ── Save form draft to SessionStorage ──
const persistDraft = () => {
  saveFormDraft('register', {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    role: getSelectedRole()
  });
};

// ── Setup Event Listeners ──
const setupListeners = () => {
  // Real-time input listeners across all fields using forEach (HOF)
  [fullNameInput, emailInput, confirmPwInput].forEach((input) => {
    if (!input) return;

    input.addEventListener('input', (e) => {
      clearFieldError(e.target.id);
      hideAlert(alertBoxId);
      persistDraft();
    });
  });

  // Password-specific input listener
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      clearFieldError('password');
      hideAlert(alertBoxId);
      handlePasswordInput();
    });
  }

  // Confirm password input listener
  if (confirmPwInput) {
    confirmPwInput.addEventListener('input', () => {
      clearFieldError('confirmPassword');
      if (confirmPwInput.value && confirmPwInput.value === passwordInput.value) {
        markFieldValid('confirmPassword');
      }
    });
  }

  // Role radio buttons change event
  roleInputs.forEach((radio) => {
    radio.addEventListener('change', () => {
      clearFieldError('role');
      hideAlert(alertBoxId);
      persistDraft();
    });
  });

  // Toggle password visibility buttons
  if (togglePwBtn) {
    togglePwBtn.addEventListener('click', (e) => {
      e.preventDefault();
      togglePasswordVisibility('password', 'toggle-password');
    });
  }

  if (toggleConfirmPwBtn) {
    toggleConfirmPwBtn.addEventListener('click', (e) => {
      e.preventDefault();
      togglePasswordVisibility('confirmPassword', 'toggle-confirm-password');
    });
  }
};

// ── Form Submission Handler ──
// Topics: Async/Await, Form Handling, Error Handling, Fetch REST API
const handleRegisterSubmit = async (event) => {
  event.preventDefault();

  hideAlert(alertBoxId);
  clearAllErrors(FORM_FIELDS);

  // Extract Form Data using ES6 Object construction
  const formData = {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    confirmPassword: confirmPwInput.value,
    role: getSelectedRole()
  };

  // Step 1: Complete Client-side Validation
  const validation = validateRegisterForm(formData);

  if (!validation.valid) {
    showFormErrors(validation.errors);
    shakeElement('.auth-card');
    showToast('Please fix the highlighted fields.', 'error', 3000);
    return;
  }

  // Step 2: Set Loading State on Submit Button
  setButtonLoading('submit-btn', 'Creating Account...');

  try {
    // Step 3: REST API Consumption via Fetch (Async/Await)
    const response = await registerUser(formData);

    // Step 4: Handle Success
    clearFormDraft('register');
    showAlert(alertBoxId, 'Account created successfully! Redirecting to login...', 'success');
    showToast('Registration successful! Please sign in.', 'success', 2500);

    // Redirect to login page after brief confirmation
    redirectTo('./login.html', 1500);

  } catch (error) {
    // Step 5: Handle API Errors (Duplicate email 409, validation 400/422)
    const message = getErrorMessage(error);
    showAlert(alertBoxId, message, 'error');
    shakeElement('.auth-card');
    showToast(message, 'error', 4000);

    if (error.status === 409) {
      showFieldError('email', 'This email is already registered.');
    }
  } finally {
    setButtonReady('submit-btn', 'Create Account');
  }
};

// ── Initialization on DOM Loaded ──
document.addEventListener('DOMContentLoaded', () => {
  restoreDraft();
  setupListeners();

  if (form) {
    form.addEventListener('submit', handleRegisterSubmit);
  }
});
