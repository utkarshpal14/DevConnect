/**
 * authService.js — DevConnect Auth
 *
 * Topics: Async/Await, Fetch API, REST API Consumption, JSON Handling,
 *         Promises, Promise Chaining, Callbacks, Error Handling,
 *         Objects, Destructuring, Template Literals, Arrow Functions
 */

// ── Configuration ──
// Base API URL — uses const (ES6)
const API_BASE_URL = 'http://localhost:5000/api/v1';

// ── Generic Request Helper ──

/**
 * Make a JSON API request using Fetch.
 * Topics: Async/Await, Fetch API, JSON handling, Error handling,
 *         Promises, template literals, Object destructuring
 *
 * @param {string} endpoint
 * @param {string} method
 * @param {Object|null} body
 * @param {string|null} token
 * @returns {Promise<Object>} resolved response data
 */
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  // Build headers object (Objects topic)
  const headers = {
    'Content-Type': 'application/json'
  };

  // Conditionally add Authorization header (conditional topic)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // template literal
  }

  // Build fetch options using spread operator (ES6 spread)
  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) })  // JSON.stringify + spread
  };

  // Fetch API call wrapped in async/await
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // Parse JSON response (JSON.parse implicitly via .json())
  const data = await response.json();

  // If HTTP error, throw with server's message (error handling topic)
  if (!response.ok) {
    const error = new Error(data.message || `HTTP Error ${response.status}`);
    error.status = response.status;
    error.data   = data;
    throw error;
  }

  return data;
};

// ── Auth API Functions ──

/**
 * Register a new user.
 * Topics: Async/Await, Fetch, Object parameters, Destructuring
 *
 * @param {{ fullName, email, password, role }} userData
 * @returns {Promise<Object>}
 */
const registerUser = async (userData) => {
  // Object destructuring (ES6 topic)
  const { fullName, email, password, role } = userData;

  // Build payload explicitly (clean object construction)
  const payload = { fullName, email, password, role };

  return await apiRequest('/auth/register', 'POST', payload);
};

/**
 * Login a user.
 * Topics: Promises, async/await, JSON, default parameters
 *
 * @param {{ email, password }} credentials
 * @returns {Promise<Object>}
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;
  return await apiRequest('/auth/login', 'POST', { email, password });
};

/**
 * Get the current authenticated user.
 * Topics: Fetch with Authorization header, Promises
 *
 * @param {string} token
 * @returns {Promise<Object>}
 */
const getCurrentUser = async (token) => {
  return await apiRequest('/auth/me', 'GET', null, token);
};

// ── Promise Chaining Example (alternative style — topic coverage) ──

/**
 * Register using Promise chaining (.then / .catch) syntax.
 * Demonstrates Promises and Promise Chaining explicitly.
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
const registerUserWithPromise = (userData) => {
  const { fullName, email, password, role } = userData;

  return fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, role })
  })
    .then((response) => response.json())                   // Promise chain step 1
    .then((data) => {                                       // Promise chain step 2
      if (!data.success) throw new Error(data.message);
      return data;
    })
    .catch((err) => {                                       // Error handling in chain
      throw err;
    });
};

/**
 * Login using callback-style wrapping of Promises.
 * Topics: Callbacks — wrapping async in a callback pattern
 * @param {Object} credentials
 * @param {Function} onSuccess - callback
 * @param {Function} onError - callback
 */
const loginUserWithCallback = (credentials, onSuccess, onError) => {
  loginUser(credentials)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err));
};

// ── Response Normalizer ──

/**
 * Normalize API error into a user-friendly message.
 * Topics: switch, conditionals, type conversion
 * @param {Error} err
 * @returns {string}
 */
const getErrorMessage = (err) => {
  // Type check on status (type conversion topic)
  const status = Number(err.status);

  switch (status) {
    case 400: return err.message || 'Invalid input. Please check your details.';
    case 401: return 'Incorrect email or password.';
    case 409: return 'An account with this email already exists.';
    case 422: return 'Validation failed. Please review the form.';
    case 500: return 'Server error. Please try again later.';
    default:
      return err.message || 'Something went wrong. Please try again.';
  }
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  registerUserWithPromise,
  loginUserWithCallback,
  getErrorMessage
};
