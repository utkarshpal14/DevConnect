const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruiterProfile',
      required: [true, 'Recruiter reference ID is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [5000, 'Job description cannot exceed 5000 characters']
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['Internship', 'Full-Time', 'Part-Time', 'Contract']
    },
    location: { type: String, required: true, trim: true, maxlength: 150 },
    requiredSkills: [{ type: String, required: true, trim: true }],
    experienceLevel: { type: String, trim: true },
    salaryRange: { type: String, trim: true },
    applicationDeadline: { type: Date },
    status: { type: String, enum: ['Open', 'Closed', 'Draft'], default: 'Open', index: true }
  },
  { timestamps: true, collection: 'jobs' }
);

jobSchema.index({ requiredSkills: 1 });

module.exports = mongoose.model('Job', jobSchema);
