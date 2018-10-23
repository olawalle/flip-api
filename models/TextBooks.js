import mongoose from 'mongoose';

const textBookSchema = new mongoose.Schema({
  title: { type: String },
  subject: { type: String },
  author: { type: String },
  url: { type: String },
  class: { type: String },
  isPublished: { type: Boolean },
  isFree: { type: Boolean },
  thumbnailUrl: { type: String }
});

const TextBook = mongoose.model('TextBook', textBookSchema);
export default TextBook;
