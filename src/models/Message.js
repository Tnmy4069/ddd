import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  room: {
    type: String,
    default: 'general'
  },
  type: {
    type: String,
    enum: ['text', 'system', 'announcement'],
    default: 'text'
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes for better performance
MessageSchema.index({ room: 1, createdAt: -1 });
MessageSchema.index({ user: 1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
