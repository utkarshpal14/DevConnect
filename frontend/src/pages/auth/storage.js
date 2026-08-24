/**
 * storage.js — DevConnect Auth
 *
 * Topics: Local Storage, Session Storage, Browser Data Management,
 *         Objects, JSON, Arrow Functions, const/let
 */

// ── Constants (const for fixed keys) ──
const TOKEN_KEY = 'devconnect_token';
const USER_KEY  = 'devconnect_user';

// ── Token Management (localStorage for persistence) ──

/**
 * Save JWT token to localStorage.
 * @param {string} token
 * @param {boolean} remember - if false, use sessionStorage instead
 */
const saveToken = (token, remember = true) => {
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve token — checks localStorage first, then sessionStorage.
 * Demonstrates: conditional logic, template literals
 * @returns {string|null}
 */
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
};

/** Remove token from both storages */
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// ── User Object Management ──

/**
 * Save user object as JSON string.
 * Topics: JSON.stringify, Objects, Nested Objects
 * @param {Object} user
 */
const saveUser = (user) => {
  // Object destructuring to pick only what we need
  const { _id, fullName, email, role } = user;
  const safeUser = { _id, fullName, email, role };
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
};

/**
 * Retrieve user object from storage.
 * Topics: JSON.parse, try/catch, conditional
 * @returns {Object|null}
 */
const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse user from storage:', e);
    return null;
  }
};

/** Clear user from storage */
const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

// ── Auth State Helpers ──

/** Check if user is currently authenticated */
const isAuthenticated = () => Boolean(getToken());

/**
 * Full logout — clears both token and user data.
 * Demonstrates: function calling other functions (scope/closures)
 */
const logout = () => {
  clearToken();
  clearUser();
};

/**
 * Get all stored auth data at once.
 * Topics: Object shorthand, destructuring, spread
 */
const getAuthData = () => {
  const token = getToken();
  const user  = getUser();
  return { token, user, isAuth: Boolean(token) };
};

// ── Session Storage Demo (topic coverage) ──
/**
 * Save a temporary form draft to sessionStorage.
 * Cleared when browser tab closes.
 * @param {string} formName
 * @param {Object} data
 */
const saveFormDraft = (formName, data) => {
  sessionStorage.setItem(`draft_${formName}`, JSON.stringify(data));
};

const getFormDraft = (formName) => {
  const raw = sessionStorage.getItem(`draft_${formName}`);
  return raw ? JSON.parse(raw) : null;
};

const clearFormDraft = (formName) => {
  sessionStorage.removeItem(`draft_${formName}`);
};

// ── Export all as a named object (ES6 module pattern) ──
export {
  saveToken,
  getToken,
  clearToken,
  saveUser,
  getUser,
  clearUser,
  isAuthenticated,
  logout,
  getAuthData,
  saveFormDraft,
  getFormDraft,
  clearFormDraft
};
