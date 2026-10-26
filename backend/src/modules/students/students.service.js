const studentsRepository = require('./students.repository');

class StudentsService {
  /**
   * Get student profile by user ID (creates default profile if none exists)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    let profile = await studentsRepository.findByUserId(userId);
    if (!profile) {
      profile = await studentsRepository.createProfile({ userId, skills: [], projects: [], certifications: [], achievements: [] });
      profile = await studentsRepository.findByUserId(userId);
    }
    return profile;
  }

  /**
   * Create or update student profile
   * @param {string} userId
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  async createOrUpdateProfile(userId, profileData) {
    const existing = await studentsRepository.findRawByUserId(userId);

    const updatePayload = {
      ...(profileData.headline !== undefined && { headline: profileData.headline }),
      ...(profileData.bio !== undefined && { bio: profileData.bio }),
      ...(profileData.profileImageUrl !== undefined && { profileImageUrl: profileData.profileImageUrl }),
      ...(profileData.resumeUrl !== undefined && { resumeUrl: profileData.resumeUrl }),
      ...(profileData.githubUrl !== undefined && { githubUrl: profileData.githubUrl }),
      ...(profileData.linkedinUrl !== undefined && { linkedinUrl: profileData.linkedinUrl }),
      ...(profileData.portfolioUrl !== undefined && { portfolioUrl: profileData.portfolioUrl }),
      ...(profileData.skills !== undefined && { skills: profileData.skills }),
      ...(profileData.education !== undefined && { education: profileData.education })
    };

    if (existing) {
      return studentsRepository.updateByUserId(userId, updatePayload);
    }

    return studentsRepository.createProfile({
      userId,
      ...updatePayload
    });
  }

  /**
   * Upload and link resume to student profile
   * @param {string} userId
   * @param {Object} file
   * @returns {Promise<{resumeUrl: string}>}
   */
  async uploadResume(userId, file) {
    if (!file) {
      const error = new Error('Resume file is required');
      error.statusCode = 400;
      throw error;
    }

    const resumeUrl = `/uploads/resumes/${file.filename}`;
    await this.createOrUpdateProfile(userId, { resumeUrl });

    return {
      resumeUrl
    };
  }

  /**
   * Add a skill to student profile
   * @param {string} userId
   * @param {string} skill
   * @returns {Promise<Object>}
   */
  async addSkill(userId, skill) {
    // Ensure profile exists
    await this.getProfile(userId);
    const updated = await studentsRepository.addSkill(userId, skill.trim());
    return {
      skills: updated ? updated.skills : []
    };
  }

  /**
   * Remove a skill from student profile
   * @param {string} userId
   * @param {string} skill
   * @returns {Promise<Object>}
   */
  async deleteSkill(userId, skill) {
    const updated = await studentsRepository.removeSkill(userId, skill.trim());
    return {
      skills: updated ? updated.skills : []
    };
  }

  /**
   * Add a project to student profile
   * @param {string} userId
   * @param {Object} projectData
   * @returns {Promise<Object>}
   */
  async addProject(userId, projectData) {
    await this.getProfile(userId);
    const updated = await studentsRepository.addProject(userId, projectData);
    return {
      projects: updated ? updated.projects : []
    };
  }

  /**
   * Update an existing project on student profile
   * @param {string} userId
   * @param {string} projectId
   * @param {Object} projectData
   * @returns {Promise<Object>}
   */
  async updateProject(userId, projectId, projectData) {
    const updated = await studentsRepository.updateProject(userId, projectId, projectData);
    if (!updated) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    return {
      projects: updated.projects
    };
  }

  /**
   * Delete a project from student profile
   * @param {string} userId
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async deleteProject(userId, projectId) {
    const updated = await studentsRepository.deleteProject(userId, projectId);
    return {
      projects: updated ? updated.projects : []
    };
  }

  /**
   * Add a certification to student profile
   * @param {string} userId
   * @param {Object} certData
   * @returns {Promise<Object>}
   */
  async addCertification(userId, certData) {
    await this.getProfile(userId);
    const updated = await studentsRepository.addCertification(userId, certData);
    return {
      certifications: updated ? updated.certifications : []
    };
  }

  /**
   * Delete a certification from student profile
   * @param {string} userId
   * @param {string} certId
   * @returns {Promise<Object>}
   */
  async deleteCertification(userId, certId) {
    const updated = await studentsRepository.deleteCertification(userId, certId);
    return {
      certifications: updated ? updated.certifications : []
    };
  }

  /**
   * Add an achievement to student profile
   * @param {string} userId
   * @param {Object} achievementData
   * @returns {Promise<Object>}
   */
  async addAchievement(userId, achievementData) {
    await this.getProfile(userId);
    const updated = await studentsRepository.addAchievement(userId, achievementData);
    return {
      achievements: updated ? updated.achievements : []
    };
  }

  /**
   * Delete an achievement from student profile
   * @param {string} userId
   * @param {string} achievementId
   * @returns {Promise<Object>}
   */
  async deleteAchievement(userId, achievementId) {
    const updated = await studentsRepository.deleteAchievement(userId, achievementId);
    return {
      achievements: updated ? updated.achievements : []
    };
  }
}

module.exports = new StudentsService();
