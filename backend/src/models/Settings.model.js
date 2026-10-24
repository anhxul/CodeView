const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'system'],
      default: 'dark',
    },
    defaultLanguage: {
      type: String,
      default: 'javascript',
    },
    editor: {
      fontSize: { type: Number, default: 14 },
      tabSize: { type: Number, default: 2 },
      wordWrap: { type: Boolean, default: true },
      minimap: { type: Boolean, default: true },
      editorTheme: {
        type: String,
        enum: ['vs-dark', 'light', 'hc-black'],
        default: 'vs-dark',
      },
    },
    notifications: {
      emailOnReviewComplete: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);