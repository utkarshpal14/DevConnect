const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true
    },
    issueDate: {
      type: Date
    },
    certificateUrl: {
      type: String,
      trim: true
    }
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    techStack: [
      {
        type: String,
        trim: true
      }
    ],
    githubUrl: {
      type: String,
      trim: true
    },
    liveUrl: {
      type: String,
      trim: true
    }
  },
  { _id: true }
);

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
      trim: true
    },
    achievementDate: {
      type: Date
    }
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      trim: true
    },
    degree: {
      type: String,
      trim: true
    },
    branch: {
      type: String,
      trim: true
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    graduationYear: {
      type: Number
    }
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference ID is required'],
      unique: true,
      index: true
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [120, 'Headline cannot exceed 120 characters']
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    profileImageUrl: {
      type: String,
      trim: true
    },
    resumeUrl: {
      type: String,
      trim: true
    },
    githubUrl: {
      type: String,
      trim: true
    },
    linkedinUrl: {
      type: String,
      trim: true
    },
    portfolioUrl: {
      type: String,
      trim: true
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    certifications: [certificationSchema],
    projects: [projectSchema],
    achievements: [achievementSchema],
    education: {
      type: educationSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema, 'student_profiles');

module.exports = StudentProfile;
