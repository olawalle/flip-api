import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  fullname: { type: String },
  phone: { type: Number, unique: true },
  isAdmin: { type: Boolean, default: false },
  password: { type: String, required: true },
  class: { type: String },
  subjects: { type: Array },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  email: String
});

const SALT_WORK_FACTOR = 10;

userSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', userSchema);
export default User;
