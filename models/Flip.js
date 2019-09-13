import mongoose from 'mongoose';

const flipSchema = new mongoose.Schema({
  title: { type: String },
  text: { type: String },
  paid: { type: Boolean },
  banner: { type: String },
  subject: { type: String },
  description: { type: String },
  longDesc: { type: String },
  level: { type: String },
  // id: { type: String }
});

const Flip = mongoose.model('Flip', flipSchema);
export default Flip;
