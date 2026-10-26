/**
 * Candidate Matching Service
 * Milestone 6: AI Candidate Match Scoring Engine & Recruiter Review
 */

const { normalizeSkill } = require('../constants/skillTaxonomy');
const AIMatchResult = require('../models/AIMatchResult');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');

class CandidateMatchingService {
  /**
   * Calculate match score between candidate skills and job requirements
   * Formula: Match Score = (Matched Skills / Required Skills) * 100
   * 
   * @param {Array<string>} candidateSkills Array of skills from student profile
   * @param {Array<string>} requiredSkills Array of skills required by job
   * @returns {object} { matchScore, matchedSkills, missingSkills }
   */
  static calculateScore(candidateSkills = [], requiredSkills = []) {
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return {
        matchScore: 100,
        matchedSkills: Array.isArray(candidateSkills) ? candidateSkills.map((s) => normalizeSkill(s)) : [],
        missingSkills: []
      };
    }

    // Build a set of normalized candidate skills for case-insensitive and alias matching
    const normalizedCandidateSkills = new Set();
    if (Array.isArray(candidateSkills)) {
      candidateSkills.forEach((skill) => {
        if (skill && typeof skill === 'string' && skill.trim()) {
          const canonical = normalizeSkill(skill.trim());
          normalizedCandidateSkills.add(canonical.toLowerCase());
        }
      });
    }

    const matchedSkills = [];
    const missingSkills = [];

    // Compare each required skill against candidate's skill set
    requiredSkills.forEach((reqSkill) => {
      if (reqSkill && typeof reqSkill === 'string' && reqSkill.trim()) {
        const canonicalReq = normalizeSkill(reqSkill.trim());
        if (normalizedCandidateSkills.has(canonicalReq.toLowerCase())) {
          matchedSkills.push(canonicalReq);
        } else {
          missingSkills.push(canonicalReq);
        }
      }
    });

    const totalRequired = requiredSkills.length;
    const matchScore = totalRequired === 0 ? 100 : Math.round((matchedSkills.length / totalRequired) * 100);

    return {
      matchScore: Math.min(100, Math.max(0, matchScore)),
      matchedSkills,
      missingSkills
    };
  }

  /**
   * Evaluate candidate against a job, persist the result, and return evaluation details
   * 
   * @param {string} studentId StudentProfile _id or User _id
   * @param {string} jobId Job _id
   * @returns {Promise<object>} Match evaluation data
   */
  static async evaluateAndPersist(studentId, jobId) {
    if (!studentId || !jobId) {
      const error = new Error('Both studentId and jobId are required');
      error.statusCode = 400;
      throw error;
    }

    // Find StudentProfile by either profile _id or userId
    let studentProfile = await StudentProfile.findById(studentId);
    if (!studentProfile) {
      studentProfile = await StudentProfile.findOne({ userId: studentId });
    }

    if (!studentProfile) {
      const error = new Error('Student profile not found');
      error.statusCode = 404;
      throw error;
    }

    // Find Job
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      throw error;
    }

    // Compute candidate match score
    const { matchScore, matchedSkills, missingSkills } = this.calculateScore(
      studentProfile.skills,
      job.requiredSkills
    );

    // Persist or update evaluation in ai_match_results collection
    const matchResult = await AIMatchResult.findOneAndUpdate(
      { studentId: studentProfile._id, jobId: job._id },
      {
        matchScore,
        matchedSkills,
        missingSkills,
        generatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      matchScore: matchResult.matchScore,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      jobId: job._id,
      studentId: studentProfile._id,
      jobTitle: job.title,
      generatedAt: matchResult.generatedAt
    };
  }

  /**
   * Get all persisted match results for a specific job
   * 
   * @param {string} jobId 
   * @returns {Promise<Array<object>>}
   */
  static async getJobMatchResults(jobId) {
    return AIMatchResult.find({ jobId }).populate({
      path: 'studentId',
      select: 'userId headline bio skills',
      populate: { path: 'userId', select: 'name email' }
    });
  }
}

module.exports = CandidateMatchingService;
