const mongoose = require('mongoose');
const Job = require('../../models/Job');
const RecruiterProfile = require('../../models/RecruiterProfile');

const jobFields = ['title', 'description', 'requiredSkills', 'location', 'employmentType', 'experienceLevel', 'salaryRange', 'applicationDeadline', 'status'];

class JobsService {
  async getRecruiterProfileId(userId) {
    const profile = await RecruiterProfile.findOne({ userId }).select('_id');
    if (!profile) {
      const error = new Error('Recruiter profile not found');
      error.statusCode = 404;
      throw error;
    }
    return profile._id;
  }

  async createJob(userId, jobData) {
    const recruiterId = await this.getRecruiterProfileId(userId);
    return new Job({ recruiterId, ...jobData }).save();
  }

  async listJobs({ page = 1, limit = 10, search, location, employmentType }) {
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const filter = { status: 'Open' };

    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { requiredSkills: { $regex: search, $options: 'i' } }
    ];
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (employmentType) filter.employmentType = employmentType;

    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('recruiterId', 'companyName companyWebsite location').sort({ createdAt: -1 }).skip((parsedPage - 1) * parsedLimit).limit(parsedLimit),
      Job.countDocuments(filter)
    ]);

    return { jobs, pagination: { page: parsedPage, limit: parsedLimit, total, pages: Math.ceil(total / parsedLimit) } };
  }

  async getJob(jobId) {
    if (!mongoose.isValidObjectId(jobId)) return null;
    return Job.findById(jobId).populate('recruiterId', 'companyName companyWebsite location');
  }

  async updateJob(userId, jobId, jobData) {
    const recruiterId = await this.getRecruiterProfileId(userId);
    const updateData = Object.fromEntries(Object.entries(jobData).filter(([key]) => jobFields.includes(key)));
    return Job.findOneAndUpdate({ _id: jobId, recruiterId }, updateData, { new: true, runValidators: true });
  }

  async deleteJob(userId, jobId) {
    const recruiterId = await this.getRecruiterProfileId(userId);
    return Job.findOneAndDelete({ _id: jobId, recruiterId });
  }

  async closeJob(userId, jobId) {
    const recruiterId = await this.getRecruiterProfileId(userId);
    return Job.findOneAndUpdate({ _id: jobId, recruiterId }, { status: 'Closed' }, { new: true, runValidators: true });
  }
}

module.exports = new JobsService();
