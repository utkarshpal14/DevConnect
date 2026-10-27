const StudentProfile = require('../../models/StudentProfile');

class StudentsRepository {
  /**
   * Find student profile by associated User ID
   * @param {string} userId
   * @returns {Promise<StudentProfile|null>}
   */
  async findByUserId(userId) {
    return StudentProfile.findOne({ userId }).populate('userId', 'fullName email role isActive');
  }

  /**
   * Find raw student profile document without population
   * @param {string} userId
   * @returns {Promise<StudentProfile|null>}
   */
  async findRawByUserId(userId) {
    return StudentProfile.findOne({ userId });
  }

  /**
   * Create a new student profile document
   * @param {Object} profileData
   * @returns {Promise<StudentProfile>}
   */
  async createProfile(profileData) {
    const profile = new StudentProfile(profileData);
    return profile.save();
  }

  /**
   * Update student profile by User ID
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<StudentProfile|null>}
   */
  async updateByUserId(userId, updateData) {
    return StudentProfile.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true
    }).populate('userId', 'fullName email role isActive');
  }

  /**
   * Add a skill to student profile (deduplicated)
   * @param {string} userId
   * @param {string} skill
   * @returns {Promise<StudentProfile|null>}
   */
  async addSkill(userId, skill) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $addToSet: { skills: skill } },
      { new: true, runValidators: true }
    );
  }

  /**
   * Remove a skill from student profile
   * @param {string} userId
   * @param {string} skill
   * @returns {Promise<StudentProfile|null>}
   */
  async removeSkill(userId, skill) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $pull: { skills: skill } },
      { new: true }
    );
  }

  /**
   * Add a project subdocument
   * @param {string} userId
   * @param {Object} projectData
   * @returns {Promise<StudentProfile|null>}
   */
  async addProject(userId, projectData) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $push: { projects: projectData } },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update a project subdocument
   * @param {string} userId
   * @param {string} projectId
   * @param {Object} projectData
   * @returns {Promise<StudentProfile|null>}
   */
  async updateProject(userId, projectId, projectData) {
    const updateFields = {};
    for (const [key, value] of Object.entries(projectData)) {
      updateFields[`projects.$.${key}`] = value;
    }

    return StudentProfile.findOneAndUpdate(
      { userId, 'projects._id': projectId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete a project subdocument
   * @param {string} userId
   * @param {string} projectId
   * @returns {Promise<StudentProfile|null>}
   */
  async deleteProject(userId, projectId) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );
  }

  /**
   * Add a certification subdocument
   * @param {string} userId
   * @param {Object} certData
   * @returns {Promise<StudentProfile|null>}
   */
  async addCertification(userId, certData) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $push: { certifications: certData } },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete a certification subdocument
   * @param {string} userId
   * @param {string} certId
   * @returns {Promise<StudentProfile|null>}
   */
  async deleteCertification(userId, certId) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $pull: { certifications: { _id: certId } } },
      { new: true }
    );
  }

  /**
   * Add an achievement subdocument
   * @param {string} userId
   * @param {Object} achievementData
   * @returns {Promise<StudentProfile|null>}
   */
  async addAchievement(userId, achievementData) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $push: { achievements: achievementData } },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete an achievement subdocument
   * @param {string} userId
   * @param {string} achievementId
   * @returns {Promise<StudentProfile|null>}
   */
  async deleteAchievement(userId, achievementId) {
    return StudentProfile.findOneAndUpdate(
      { userId },
      { $pull: { achievements: { _id: achievementId } } },
      { new: true }
    );
  }
}

module.exports = new StudentsRepository();
