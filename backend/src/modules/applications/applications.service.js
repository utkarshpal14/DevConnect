const mongoose = require('mongoose');
const Application = require('../../models/Application');
const StudentProfile = require('../../models/StudentProfile');
const Job = require('../../models/Job');
const RecruiterProfile = require('../../models/RecruiterProfile');

class ApplicationsService {
  async getStudentProfileId(userId) {
    let profile = await StudentProfile.findOne({ userId }).select('_id');
    if (!profile) {
      profile = await StudentProfile.create({
        userId,
        skills: [],
        projects: [],
        certifications: [],
        achievements: []
      });
    }
    return profile._id;
  }

  async getRecruiterProfileId(userId) {
    const profile = await RecruiterProfile.findOne({ userId }).select('_id');
    if (!profile) {
      const error = new Error('Recruiter profile not found');
      error.statusCode = 404;
      throw error;
    }
    return profile._id;
  }

  async applyForJob(userId, jobId) {
    if (!mongoose.isValidObjectId(jobId)) {
      const error = new Error('Invalid job ID');
      error.statusCode = 400;
      throw error;
    }

    const [studentId, job] = await Promise.all([
      this.getStudentProfileId(userId),
      Job.findOne({ _id: jobId, status: 'Open' }).select('_id')
    ]);
    if (!job) {
      const error = new Error('Open job not found');
      error.statusCode = 404;
      throw error;
    }

    const existing = await Application.findOne({ studentId, jobId });
    if (existing) {
      const error = new Error('You have already applied for this job');
      error.statusCode = 409;
      throw error;
    }

    return new Application({ studentId, jobId }).save();
  }

  async withdrawApplication(userId, applicationId) {
    const studentId = await this.getStudentProfileId(userId);
    const application = await Application.findOneAndUpdate(
      { _id: applicationId, studentId, status: { $ne: 'Withdrawn' } },
      { status: 'Withdrawn' },
      { new: true, runValidators: true }
    );
    if (!application) {
      const error = new Error('Application not found or already withdrawn');
      error.statusCode = 404;
      throw error;
    }
    return application;
  }

  async getMyApplications(userId) {
    const studentId = await this.getStudentProfileId(userId);
    return Application.find({ studentId })
      .populate('jobId', 'title description location employmentType status recruiterId')
      .sort({ appliedAt: -1 });
  }

  async getJobApplicants(userId, jobId) {
    const recruiterId = await this.getRecruiterProfileId(userId);
    const job = await Job.findOne({ _id: jobId, recruiterId }).select('_id');
    if (!job) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      throw error;
    }
    return Application.find({ jobId })
      .populate('studentId', 'userId headline skills resumeUrl')
      .sort({ appliedAt: -1 });
  }

  async updateStatus(userId, applicationId, status) {
    const recruiterId = await this.getRecruiterProfileId(userId);
    const application = await Application.findById(applicationId).populate('jobId', 'recruiterId');
    if (!application || application.jobId.recruiterId.toString() !== recruiterId.toString()) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }
    application.status = status;
    await application.save();
    return application;
  }
}

module.exports = new ApplicationsService();
