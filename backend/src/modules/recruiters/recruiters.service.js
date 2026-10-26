const RecruiterProfile = require('../../models/RecruiterProfile');

class RecruitersService {
  async getProfile(userId) {
    return RecruiterProfile.findOne({ userId }).populate('userId', 'fullName email role isActive');
  }

  async createOrUpdateProfile(userId, profileData) {
    return RecruiterProfile.findOneAndUpdate(
      { userId },
      { userId, ...profileData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('userId', 'fullName email role isActive');
  }
}

module.exports = new RecruitersService();
