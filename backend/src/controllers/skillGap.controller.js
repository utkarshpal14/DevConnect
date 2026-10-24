/**
 * Skill Gap Controller
 * Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence
 */

const SkillGapService = require('../services/skillGap.service');
const StudentProfile = require('../models/StudentProfile');

class SkillGapController {
  /**
   * POST /api/v1/ai/skill-gap
   * Analyze student's skill profile against a target role
   */
  static async analyzeSkillGap(req, res, next) {
    try {
      const { targetRole } = req.body;

      if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Target role is required in the request body'
        });
      }

      // Fetch current student profile
      const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
      const currentSkills = studentProfile ? studentProfile.skills : [];

      // Perform skill gap analysis
      const analysis = SkillGapService.analyze(currentSkills, targetRole.trim());

      return res.status(200).json({
        success: true,
        message: `Skill gap analysis completed successfully for role '${analysis.targetRole}'`,
        data: analysis
      });
    } catch (error) {
      if (error.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      return next(error);
    }
  }

  /**
   * GET /api/v1/ai/skill-gap/roles
   * Return supported career role taxonomies
   */
  static async getSupportedRoles(req, res, next) {
    try {
      const roles = SkillGapService.getSupportedRoles();
      return res.status(200).json({
        success: true,
        data: roles
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = SkillGapController;
