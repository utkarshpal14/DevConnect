const mongoose = require('mongoose');

const aiMatchResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: [true, 'Student profile reference is required'],
      index: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
      index: true
    },
    matchScore: {
      type: Number,
      required: [true, 'Match score is required'],
      min: [0, 'Match score cannot be less than 0'],
      max: [100, 'Match score cannot exceed 100']
    },
    matchedSkills: [
      {
        type: String,
        trim: true
      }
    ],
    missingSkills: [
      {
        type: String,
        trim: true
      }
    ],
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'ai_match_results',
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound unique index ensuring one latest evaluation record per student and job
aiMatchResultSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

const AIMatchResult = mongoose.model('AIMatchResult', aiMatchResultSchema);

module.exports = AIMatchResult;
