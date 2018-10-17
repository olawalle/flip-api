import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
  title: { type: String },
  authorId: { type: String },
  topicId: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const Notes = mongoose.model('Notes', notesSchema);
export default Notes;
