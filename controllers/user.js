import mongoose from 'mongoose';
// import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';
import Flip from '../models/Flip'
import Subject from '../models/Subjects';

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
      phone, name, email
    } = req.body;

    let promise = null
    // check if user is signing up with phone or email
    if (phone) {
      promise = User.findOne({
        phone: phone.trim().toLowerCase()
      }).exec();
    } else if (email) {
      promise = User.findOne({
        email: email.trim().toLowerCase()
      }).exec();
    }

    promise.then((isPhone) => {
      if (isPhone) {
        return res.status(409).send({
          error: 'user with that phone number/email already exists'
        });
      }

      const user = new User(
        // phone: parseInt(phone, 10),
        req.body
      );
      user.save().then((newUser) => {
        const token = jwt.sign(
          {
            id: newUser._id,
            name: newUser.name,
            level: newUser.level,
            isAdmin: newUser.isAdmin,
          },
          process.env.SECRET
        );
        return res.status(201).send({
          message: `Welcome ${name}`,
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


  async signin(req, res) {
    const { phone, password, email } = req.body;

    try {

      let user = null
      phone ? user = await User.findOne({
        phone
      }) : user = await User.findOne({
        email
      })

      if (!user) {
        return res.status(404).send({
          error: 'Phone number/email is wrong is incorrect'
        });
      }

      if (password && !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
          error: 'Incorrect password'
        });
      }

      if (user) {
        
        const token = jwt.sign(
          {
            id: user._id,
            name: user.name,
            isAdmin: user.isAdmin,
          },
          process.env.SECRET
        );

        const allSubjects = await Subject.find().exec()
        
        Flip.find().exec()
        .then(flips => {
          let resp = []
          user.subjects.forEach((subject, i) => {
            resp[i] = {
              subject: allSubjects.find(subj => JSON.stringify(subj._id) === JSON.stringify(subject)).name,
              flips: []
            }
          })

          flips.forEach((flip) => {
            let foundIndex = null
            resp.find((subject, j) => {
              subject.subject === flip.subject ? foundIndex = j : foundIndex = null
              return subject.subject === flip.subject
            }) && resp[foundIndex].flips.push(flip)
          })
          
          res.status(201).send({
            success: true,
            user,
            token,
            flips: resp 
          });
        })
      }

    } catch (err) {
      res.status(500).send({
        err,
        success: false,
        message: 'Internal Server Error'
      })
    }
  },

  async currentUser(req, res) {
    try {
      const user = await User.findById(req.decoded.id).exec()
      if (user) {
        const allSubjects = await Subject.find().exec()
        
        Flip.find().exec()
        .then(flips => {
          let resp = []
          user.subjects.forEach((subject, i) => {
            resp[i] = {
              subject: allSubjects.find(subj => JSON.stringify(subj._id) === JSON.stringify(subject)).name,
              flips: []
            }
          })

          flips.forEach((flip) => {
            let foundIndex = null
            resp.find((subject, j) => {
              subject.subject === flip.subject ? foundIndex = j : foundIndex = null
              return subject.subject === flip.subject
            }) && resp[foundIndex].flips.push(flip)
          })
          
          res.status(201).send({
            success: true,
            user,
            flips: resp 
          });
        })
      }
    } catch (err) {
      res.status(500).send({
        err,
        success: false,
        message: 'Internal Server Error'
      })
    }
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
      const promise = User.findById(req.params.id, 'phone fullname class subjects').exec();
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
      User.findByIdAndUpdate(req.decoded.id, {
        // $push: { subjects: { $each: subjects } }
        $set: {
          subjects: req.body.subjects
        }
      }).exec();
      return res.status(200).send({
        success: true,
        message: 'subject successfully added'
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


  async getUserFlips(req, res) {
    try {
      const user = await User.findById(req.decoded.id).exec();

      Flip.find().exec()
      .then(flips => {
        let resp = []
        user.subjects.forEach((subject, i) => {
          resp[i] = {
            subject: subject.name,
            flips: []
          }
        })

        flips.forEach((flip) => {
          let foundIndex = null
          resp.find((subject, j) => {
            subject.subject === flip.subject ? foundIndex = j : foundIndex = null
            return subject.subject === flip.subject
          }) && resp[foundIndex].flips.push(flip)
        })

        res.status(200).send({
          success: true,
          flips: resp 
        });
      })
    } catch (error) {
      res.status(500).send({
        message: 'Server Error',
        error
      });
    }
  },

  bookmarkFlip(req, res) {
    const { flipId } = req.body
    try {
      let user = User.findOne(req.decoded.id)
      if (!user.bookmarks.includes(flipId)) {
        User.findByIdAndUpdate(req.decoded.id,
          {$push: {bookmarks: req.body.flipId}},
          function(err, doc) {
            if(err) {
              res.status(500).send({
                message: 'An error occured',
                err
              });
            } else {
              //do stuff
              res.status(201).send({
                success: true,
                message: 'Bookmark successfully added'
              })
            }
          }
        )
      } else {
        res.status(400).send({
          message: 'Flip already bookmarked',
          error
        });
      }
    } catch (err) {
      res.status(500).send({
        message: 'Server Error',
        error
      });
    }
  }

  // async updateUsers(req, res) {
  //   const { fullname }
  // }

};
