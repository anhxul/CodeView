const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      default: 'medium',
    },
    line: { type: Number, default: null },
    suggestion: { type: String, default: '' },
  },
  { _id: false }
);

const reviewResultSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    summary: { type: String, default: '' },
    bugs: { type: [issueSchema], default: [] },
    securityIssues: { type: [issueSchema], default: [] },
    performanceIssues: { type: [issueSchema], default: [] },
    readabilityIssues: { type: [issueSchema], default: [] },
    maintainability: {
      score: { type: Number, min: 0, max: 100, default: 0 },
      analysis: { type: String, default: '' },
    },
    bestPractices: { type: [String], default: [] },
    refactoredCode: { type: String, default: '' },
    alternativeApproach: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      code: { type: String, default: '' },
    },
    interviewQuestions: {
      type: [
        {
          question: { type: String },
          answer: { type: String },
        },
      ],
      default: [],
    },
    learningResources: {
      type: [
        {
          title: { type: String },
          url: { type: String },
          type: { type: String },
        },
      ],
      default: [],
    },
    complexity: {
      time: { type: String, default: 'N/A' },
      space: { type: String, default: 'N/A' },
      explanation: { type: String, default: '' },
    },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Untitled Review',
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Code is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      lowercase: true,
    },
    source: {
      type: String,
      enum: ['editor', 'github'],
      default: 'editor',
    },
    githubMeta: {
      repoUrl: { type: String, default: '' },
      filePath: { type: String, default: '' },
    },
    result: {
      type: reviewResultSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    error: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ language: 1 });

module.exports = mongoose.model('Review', reviewSchema);