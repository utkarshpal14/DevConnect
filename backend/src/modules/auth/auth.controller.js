const authService = require('./auth.service');
const { successResponse } = require('../../utils/response.util');

class AuthController {
  /**
   * Handle user registration
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const { fullName, email, password, role } = req.body;
      const result = await authService.register({ fullName, email, password, role });
      return successResponse(res, 201, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle user login
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return successResponse(res, 200, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle get current user profile
   * GET /api/v1/auth/me
   */
  async getMe(req, res, next) {
    try {
      const result = await authService.getCurrentUser(req.user._id);
      return successResponse(res, 200, 'User profile retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
