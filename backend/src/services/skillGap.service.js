/**
 * Skill Gap Analysis Service
 * Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence
 */

const {
  ROLE_TAXONOMY,
  normalizeSkill,
  getRoleTaxonomy,
  getAllTaxonomyRoles
} = require('../constants/skillTaxonomy');

class SkillGapService {
  /**
   * Analyze student's skill gap against a specified target industry role
   * @param {Array<string>} studentSkills Array of raw skill strings from student profile
   * @param {string} targetRole Target role title to benchmark against
   * @returns {object} Analysis result
   */
  static analyze(studentSkills = [], targetRole) {
    if (!targetRole || typeof targetRole !== 'string') {
      const error = new Error('Target role is required');
      error.statusCode = 400;
      throw error;
    }

    const role = getRoleTaxonomy(targetRole);
    if (!role) {
      const validRoles = Object.keys(ROLE_TAXONOMY).join(', ');
      const error = new Error(`Invalid target role '${targetRole}'. Supported roles: ${validRoles}`);
      error.statusCode = 400;
      throw error;
    }

    // Normalize student skills for robust case-insensitive comparison
    const normalizedStudentSkills = new Set();
    if (Array.isArray(studentSkills)) {
      studentSkills.forEach((skill) => {
        if (skill && typeof skill === 'string') {
          normalizedStudentSkills.add(normalizeSkill(skill).toLowerCase());
        }
      });
    }

    const matchedSkills = [];
    const missingSkills = [];
    const recommendations = [];

    // Evaluate each required skill in the role's taxonomy
    role.requiredSkills.forEach((canonicalSkill) => {
      const normalizedReq = canonicalSkill.toLowerCase();
      if (normalizedStudentSkills.has(normalizedReq)) {
        matchedSkills.push(canonicalSkill);
      } else {
        missingSkills.push(canonicalSkill);
        const tip = role.recommendations[canonicalSkill];
        if (tip) {
          recommendations.push(tip);
        }
      }
    });

    const totalRequired = role.requiredSkills.length;
    const readinessScore = totalRequired > 0
      ? Math.round((matchedSkills.length / totalRequired) * 100)
      : 0;

    // Career readiness status classification
    let status = 'Early Foundation';
    if (readinessScore >= 80) {
      status = 'Job Ready';
    } else if (readinessScore >= 50) {
      status = 'Progressing Well';
    }

    // If student has 100% matched skills, supply advanced career advice
    if (missingSkills.length === 0) {
      recommendations.push(
        `Exceptional profile! You have acquired 100% of the core competencies for ${role.title}. Build production-grade capstone projects and prepare for technical interviews.`
      );
    }

    return {
      targetRole: role.title,
      description: role.description,
      readinessScore,
      status,
      totalRequired,
      matchedCount: matchedSkills.length,
      missingCount: missingSkills.length,
      matchedSkills,
      missingSkills,
      recommendations,
      suggestedProjects: role.suggestedProjects || []
    };
  }

  /**
   * Retrieve list of supported taxonomy roles and metadata
   */
  static getSupportedRoles() {
    return getAllTaxonomyRoles();
  }
}

module.exports = SkillGapService;
