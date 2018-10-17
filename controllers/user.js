import mongoose from 'mongoose';
// import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

mongoose.Promise = global.Promise;

export default {
  /**
   * signup a new user
   * @param {any} req user request object
   * @param {any} res servers response
   * @return {void}
   */
  signup(req, res) {
    const {
      phone, fullname, password, subjects
    } = req.body;
    const promise = User.findOne({
      phone: phone.trim().toLowerCase()
    }).exec();

    promise.then((isPhone) => {
      if (isPhone) {
        return res.status(409).send({
          error: 'user with that phone already exist'
        });
      }

      const user = new User({
        phone: parseInt(phone, 10),
        fullname,
        class: req.body.class,
        password,
        subjects: subjects || []
      });
      user.save().then((newUser) => {
        const token = jwt.sign(
          {
            id: newUser._id,
            name: newUser.fullname,
            class: newUser.class,
            isAdmin: newUser.isAdmin,
          },
          process.env.SECRET
        );
        return res.status(201).send({
          message: `Welcome ${fullname} - ${phone}`,
          token
        });
      })
        .catch((error) => {
          res.status(500).send(error.message);
        });
    });
  },
  /**
   * signin a new user
   * @param {any} req user request object
   * @param {any} res servers response
   * @return {void}
   */
  signin(req, res) {
    const { phone, password } = req.body;
    const promise = User.findOne({
      phone
    }).exec();
    promise.then((user) => {
      if (!user) {
        return res.status(404).send({
          error: 'Phone number is incorrect'
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
          error: 'Incorrect password'
        });
      }
      if (user) {
        const token = jwt.sign(
          {
            id: user._id,
            name: user.fullname,
            class: user.class,
            isAdmin: user.isAdmin,
          },
          process.env.SECRET
        );
        return res.status(201).send({
          token,
          message: `Welcome back ${user.fullname}`
        });
      }
    })
      .catch(error => res.status(500).send({
        error,
        success: false,
        message: 'Internal Server Error'
      }));
  },

  async createAdmin(req, res) {
    const { email, password, fullname } = req.body;
    try {
      const admin = await User.findOne({
        email,
        isAdmin: true
      });
      if (!admin) {
        const newAdmin = new User({
          email,
          fullname,
          password,
          isAdmin: true
        });
        const createdAdmin = await newAdmin.save();
        const token = jwt.sign({
          email: createdAdmin.email,
          id: createdAdmin._id,
          isAdmin: createdAdmin.isAdmin
        }, process.env.SECRET);
        return res.status(201).send({
          success: true,
          token,
          message: `Admin with email: ${createdAdmin.email} successfully created`
        });
      }
      return res.status(409).send({
        success: false,
        message: 'Admin with that email already exists'
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        error,
        message: 'Internal Server Error'
      });
    }
  },

  getUsers(req, res) {
    const promise = User.find().exec();
    promise.then(users => res.status(200).send({
      success: true,
      users
    }))
      .catch(err => res.status(500).send({
        success: false,
        error: err
      }));
  },

  async getOneUser(req, res) {
    try {
      const promise = User.findById(req.params.id, 'phone fullname class').exec();
      const user = await promise;
      if (user) {
        return res.status(200).send({
          success: true,
          user
        });
      }
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error
      });
    }
  },

  async addUserSubject(req, res) {
    try {
      const { subjects } = req.body;
      /* eslint-ignore-next-line */
      const user = await User.findById(req.decoded.id).exec();
      if (!user) {
        return res.status(404).send({
          message: 'user does not exist'
        });
      }
      const update = await User.findByIdAndUpdate(req.decoded.id, {
        $push: { subjects: { $each: subjects } }
      }).exec();
      return res.status(200).send({
        success: true,
        message: 'subject successfully added',
        user
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Server Error',
        error
      });
    }
  },

  async loginAdmin(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        email,
        isAdmin: true
      });
      if (user) {
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(409).send({
            success: false,
            message: 'Password is incorrect'
          });
        }
        const token = jwt.sign({
          email: user.email,
          id: user._id,
          isAdmin: user.isAdmin
        }, process.env.SECRET);
        return res.status(200).send({
          success: true,
          message: `welcome back ${user.email}`,
          token
        });
      }
      return res.status(404).send({
        success: false,
        message: 'Admin does not exist'
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Internal Server Error'
      });
    }
  },

  async getUserSubjects(req, res) {
    try {
      const user = await User.findById(req.decoded.id).exec();
      return res.status(200).send({
        success: true,
        message: 'subject successfully added',
        subjects: user.subjects
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Server Error',
        error
      });
    }
  },

  // async updateUsers(req, res) {
  //   const { fullname }
  // }

};
