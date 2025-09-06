import mongoose from 'mongoose';

const ChatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  model: {
    type: String,
    default: 'gemini-1.5-flash'
  }
}, {
  timestamps: true
});

// Create indexes for better performance
ChatHistorySchema.index({ user: 1, createdAt: -1 });
ChatHistorySchema.index({ user: 1, isActive: 1 });

export default mongoose.models.ChatHistory || mongoose.model('ChatHistory', ChatHistorySchema);
