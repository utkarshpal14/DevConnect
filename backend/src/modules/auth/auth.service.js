const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const config = require('../../config/env');

class AuthService {
  /**
   * Register a new user
   * @param {Object} registerData
   * @returns {Promise<{userId: string}>}
   */
  async register({ fullName, email, password, role }) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await authRepository.createUser({
      fullName,
      email,
      passwordHash,
      role
    });

    return {
      userId: newUser._id.toString()
    };
  }

  /**
   * Login user and issue JWT token
   * @param {Object} loginData
   * @returns {Promise<{token: string, user: Object}>}
   */
  async login({ email, password }) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('User account is disabled');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  /**
   * Get current authenticated user details
   * @param {string} userId
   * @returns {Promise<{user: Object}>}
   */
  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
}

module.exports = new AuthService();
