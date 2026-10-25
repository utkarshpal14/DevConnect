/**
 * Resume Parser Controller
 * Handles POST /api/v1/ai/parse-resume
 */

const ResumeParserService = require('../services/resumeParser.service');
const { successResponse, errorResponse } = require('../utils/response.util');

class ResumeParserController {
  /**
   * POST /api/v1/ai/parse-resume
   * Ingest and parse an uploaded PDF resume for the authenticated student
   */
  static async parseResume(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(res, 400, 'Resume file is required. Please attach a valid PDF document.');
      }

      const parsedData = await ResumeParserService.parseResume(req.file);

      return successResponse(res, 200, 'Resume parsed successfully', parsedData);
    } catch (error) {
      if (error.statusCode) {
        return errorResponse(res, error.statusCode, error.message);
      }
      return next(error);
    }
  }
}

module.exports = ResumeParserController;
