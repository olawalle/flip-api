import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  class: { type: String },
  name: { type: String },
  textBooks: { type: Array },
  topic: { type: Array }
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject
