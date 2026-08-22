const studentsService = require('./students.service');
const { successResponse } = require('../../utils/response.util');

class StudentsController {
  /**
   * GET /api/v1/students/profile
   */
  async getProfile(req, res, next) {
    try {
      const profile = await studentsService.getProfile(req.user._id);
      return successResponse(res, 200, 'Student profile retrieved successfully', profile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/students/profile
   * PUT /api/v1/students/profile
   */
  async createOrUpdateProfile(req, res, next) {
    try {
      const profile = await studentsService.createOrUpdateProfile(req.user._id, req.body);
      const isCreate = req.method === 'POST';
      return successResponse(
        res,
        isCreate ? 201 : 200,
        isCreate ? 'Student profile created successfully' : 'Student profile updated successfully',
        profile
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/students/resume
   */
  async uploadResume(req, res, next) {
    try {
      const result = await studentsService.uploadResume(req.user._id, req.file);
      return successResponse(res, 200, 'Resume uploaded successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/students/skills
   */
  async addSkill(req, res, next) {
    try {
      const result = await studentsService.addSkill(req.user._id, req.body.skill);
      return successResponse(res, 200, 'Skill added successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/students/skills/:skillName
   */
  async deleteSkill(req, res, next) {
    try {
      const skillName = decodeURIComponent(req.params.skillName);
      const result = await studentsService.deleteSkill(req.user._id, skillName);
      return successResponse(res, 200, 'Skill removed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/students/projects
   */
  async addProject(req, res, next) {
    try {
      const result = await studentsService.addProject(req.user._id, req.body);
      return successResponse(res, 201, 'Project added successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/students/projects/:projectId
   */
  async updateProject(req, res, next) {
    try {
      const result = await studentsService.updateProject(req.user._id, req.params.projectId, req.body);
      return successResponse(res, 200, 'Project updated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/students/projects/:projectId
   */
  async deleteProject(req, res, next) {
    try {
      const result = await studentsService.deleteProject(req.user._id, req.params.projectId);
      return successResponse(res, 200, 'Project removed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/students/certifications
   */
  async addCertification(req, res, next) {
    try {
      const result = await studentsService.addCertification(req.user._id, req.body);
      return successResponse(res, 201, 'Certification added successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/students/certifications/:certId
   */
  async deleteCertification(req, res, next) {
    try {
      const result = await studentsService.deleteCertification(req.user._id, req.params.certId);
      return successResponse(res, 200, 'Certification removed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/students/achievements
   */
  async addAchievement(req, res, next) {
    try {
      const result = await studentsService.addAchievement(req.user._id, req.body);
      return successResponse(res, 201, 'Achievement added successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/students/achievements/:achievementId
   */
  async deleteAchievement(req, res, next) {
    try {
      const result = await studentsService.deleteAchievement(req.user._id, req.params.achievementId);
      return successResponse(res, 200, 'Achievement removed successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentsController();
