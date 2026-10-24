/**
 * Candidate Matching Controller
 * Milestone 6: AI Candidate Match Scoring Engine & Recruiter Review
 */

const CandidateMatchingService = require('../services/candidateMatching.service');
const Job = require('../models/Job');
const RecruiterProfile = require('../models/RecruiterProfile');

class CandidateMatchingController {
  /**
   * POST /api/v1/ai/match-candidate
   * Evaluate a student applicant against a job's skill requirements
   */
  static async matchCandidate(req, res, next) {
    try {
      const { studentId, jobId } = req.body;

      if (!studentId || !jobId) {
        return res.status(400).json({
          success: false,
          message: 'studentId and jobId are both required in the request body'
        });
      }

      // Verify that the job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Verify recruiter authorization (recruiter must own the job unless admin)
      if (req.user.role === 'recruiter') {
        const recruiterProfile = await RecruiterProfile.findOne({ userId: req.user._id });
        if (!recruiterProfile || job.recruiterId.toString() !== recruiterProfile._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: You can only evaluate applicants for jobs posted by your profile'
          });
        }
      }

      // Evaluate candidate match and persist in ai_match_results
      const result = await CandidateMatchingService.evaluateAndPersist(studentId, jobId);

      return res.status(200).json({
        success: true,
        message: 'Candidate match evaluation completed successfully',
        data: {
          matchScore: result.matchScore,
          matchedSkills: result.matchedSkills,
          missingSkills: result.missingSkills,
          jobId: result.jobId,
          studentId: result.studentId,
          jobTitle: result.jobTitle,
          generatedAt: result.generatedAt
        }
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return next(error);
    }
  }

  /**
   * GET /api/v1/ai/match-candidate/job/:jobId
   * Retrieve all saved candidate match results for a job
   */
  static async getJobMatchResults(req, res, next) {
    try {
      const { jobId } = req.params;

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (req.user.role === 'recruiter') {
        const recruiterProfile = await RecruiterProfile.findOne({ userId: req.user._id });
        if (!recruiterProfile || job.recruiterId.toString() !== recruiterProfile._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: You can only view match results for jobs posted by your profile'
          });
        }
      }

      const results = await CandidateMatchingService.getJobMatchResults(jobId);

      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CandidateMatchingController;
