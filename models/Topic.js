import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  author: { type: String },
  subject: { type: String },
  class: { type: String },
  subjectId: { type: String },
  article: { title: String, content: String },
  title: { type: String },
  isFree: { type: Boolean },
  video: {
    title: { type: String, trim: true },
    url: { type: String }
  },
  isPublished: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const Topic = mongoose.model('Topic', topicSchema);
export default Topic
