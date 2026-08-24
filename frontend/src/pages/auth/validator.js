/**
 * validator.js — DevConnect Auth
 *
 * Topics: Functions, Arrow Functions, Parameters, Return Values,
 *         Arrays, Array Methods (filter, map, every, some),
 *         Higher Order Functions, Objects, Conditionals,
 *         Loops (for...of), ES6 (template literals, destructuring, default params)
 */

// ── Data: Validation Rules as Objects ──

// Array of password strength rules (objects with properties and methods)
const passwordRules = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (pw) => pw.length >= 8
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (pw) => /[A-Z]/.test(pw)
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (pw) => /[a-z]/.test(pw)
  },
  {
    id: 'number',
    label: 'One number',
    test: (pw) => /[0-9]/.test(pw)
  }
];

// Valid roles array
const VALID_ROLES = ['student', 'recruiter'];

// ── Validators ──

/**
 * Validate full name.
 * Topics: conditional, string methods, return values
 * @param {string} name
 * @returns {{ valid: boolean, error: string }}
 */
const validateName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, error: 'Full name is required' };
  if (trimmed.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (trimmed.length > 60) return { valid: false, error: 'Name must not exceed 60 characters' };
  return { valid: true, error: '' };
};

/**
 * Validate email address.
 * Topics: regex, conditional
 * @param {string} email
 * @returns {{ valid: boolean, error: string }}
 */
const validateEmail = (email) => {
  const trimmed = email.trim();
  if (!trimmed) return { valid: false, error: 'Email is required' };

  // Regex for basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email address' };
  }

  return { valid: true, error: '' };
};

/**
 * Validate password against all rules using Higher Order Functions.
 * Topics: for...of loop, Array.every, Array.filter, Array.map, HOF
 * @param {string} password
 * @param {boolean} strict - if false, only check presence
 * @returns {{ valid: boolean, error: string, strength: number, passedRules: string[] }}
 */
const validatePassword = (password, strict = true) => {
  if (!password) return { valid: false, error: 'Password is required', strength: 0, passedRules: [] };

  // Use for...of loop to iterate rules (topic: loops)
  const passedRules = [];
  for (const rule of passwordRules) {
    if (rule.test(password)) {
      passedRules.push(rule.id);
    }
  }

  // Strength = number of passed rules (0 to 4)
  const strength = passedRules.length;

  if (!strict) {
    return { valid: Boolean(password), error: '', strength, passedRules };
  }

  // All rules must pass: Array.every (HOF)
  const allPassed = passwordRules.every((rule) => rule.test(password));

  if (!allPassed) {
    // Get failed rules using filter (HOF) + map (HOF)
    const failedLabels = passwordRules
      .filter((rule) => !rule.test(password))
      .map((rule) => rule.label);

    return {
      valid: false,
      error: `Password needs: ${failedLabels[0]}`,
      strength,
      passedRules
    };
  }

  return { valid: true, error: '', strength, passedRules };
};

/**
 * Validate password confirmation.
 * @param {string} password
 * @param {string} confirm
 * @returns {{ valid: boolean, error: string }}
 */
const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return { valid: false, error: 'Please confirm your password' };
  if (password !== confirm) return { valid: false, error: 'Passwords do not match' };
  return { valid: true, error: '' };
};

/**
 * Validate role selection.
 * Topics: Array.includes, conditional, const arrays
 * @param {string} role
 * @returns {{ valid: boolean, error: string }}
 */
const validateRole = (role) => {
  if (!role) return { valid: false, error: 'Please select a role' };
  if (!VALID_ROLES.includes(role)) {
    return { valid: false, error: `Role must be one of: ${VALID_ROLES.join(', ')}` };
  }
  return { valid: true, error: '' };
};

/**
 * Validate the entire register form at once.
 * Topics: Object destructuring, spread, reduce (HOF), for...in loop on objects
 * @param {{ fullName, email, password, confirmPassword, role }} formData
 * @returns {{ valid: boolean, errors: Object }}
 */
const validateRegisterForm = ({ fullName, email, password, confirmPassword, role }) => {
  // Build errors object using for...in style iteration over a rules map
  const fieldValidators = {
    fullName: () => validateName(fullName),
    email:    () => validateEmail(email),
    password: () => validatePassword(password),
    confirmPassword: () => validateConfirmPassword(password, confirmPassword),
    role:     () => validateRole(role)
  };

  // Use reduce (HOF) to collect all errors
  const errors = Object.keys(fieldValidators).reduce((acc, field) => {
    const result = fieldValidators[field]();
    if (!result.valid) {
      acc[field] = result.error;
    }
    return acc;
  }, {});

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate login form.
 * @param {{ email, password }} formData
 * @returns {{ valid: boolean, errors: Object }}
 */
const validateLoginForm = ({ email, password }) => {
  const errors = {};
  const emailResult = validateEmail(email);
  const passResult  = validatePassword(password, false); // not strict on login

  if (!emailResult.valid) errors.email = emailResult.error;
  if (!passResult.valid)  errors.password = passResult.error;

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Compute password strength metadata for UI display.
 * Topics: switch statement (type conversion/conditionals), objects, template literals
 * @param {number} strength - 0 to 4
 * @returns {{ label: string, color: string, percent: number }}
 */
const getStrengthMeta = (strength) => {
  switch (true) {
    case (strength === 0):
      return { label: 'Enter a password',   color: '#484f58', percent: 0 };
    case (strength === 1):
      return { label: 'Very weak',           color: '#f85149', percent: 25 };
    case (strength === 2):
      return { label: 'Weak',                color: '#d29922', percent: 50 };
    case (strength === 3):
      return { label: 'Good',                color: '#58a6ff', percent: 75 };
    case (strength === 4):
      return { label: 'Strong ✓',            color: '#3fb950', percent: 100 };
    default:
      return { label: '',                    color: '#484f58', percent: 0 };
  }
};

export {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRole,
  validateRegisterForm,
  validateLoginForm,
  getStrengthMeta,
  passwordRules,
  VALID_ROLES
};
