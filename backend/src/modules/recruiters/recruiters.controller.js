const recruitersService = require('./recruiters.service');
const { successResponse } = require('../../utils/response.util');

class RecruitersController {
  async getProfile(req, res, next) {
    try {
      const profile = await recruitersService.getProfile(req.user._id);
      return successResponse(res, 200, 'Recruiter profile retrieved successfully', profile || {});
    } catch (error) {
      next(error);
    }
  }

  async createOrUpdateProfile(req, res, next) {
    try {
      const profile = await recruitersService.createOrUpdateProfile(req.user._id, req.body);
      const statusCode = req.method === 'POST' ? 201 : 200;
      const message = req.method === 'POST'
        ? 'Recruiter profile created successfully'
        : 'Recruiter profile updated successfully';
      return successResponse(res, statusCode, message, profile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecruitersController();
