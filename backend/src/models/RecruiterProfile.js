const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference ID is required'],
      unique: true,
      index: true
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters']
    },
    companyWebsite: {
      type: String,
      trim: true
    },
    companyDescription: {
      type: String,
      trim: true,
      maxlength: [2000, 'Company description cannot exceed 2000 characters']
    },
    companyLogoUrl: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters']
    }
  },
  {
    timestamps: true,
    collection: 'recruiter_profiles',
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
