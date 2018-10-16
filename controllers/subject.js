import mongoose from "mongoose";
import Subjects from "../models/Subjects";

mongoose.Promise = global.Promise;

export default {
  async createSubject(req, res) {
    const { className, name } = req.body;

    try {
      const subject = new Subjects({
        class: className,
        name
      });
      const newSubject = await subject.save();
        return res.status(201).send({
          success: true,
          message: `Subject ${newSubject.name} succesfully added to class${newSubject.className}; `
        })
    }
    catch(error) {
      return res.status(500).send({
        success: false,
        message: 'Server Error ',
        error
      })
    }
  },

  async getAllSubjects(req, res) {
    try {
      const promise = Subject.find();
      const subjects = await promise;
      return res.status(200).send({
        success: true,
        subjects
      })
    }
    catch(error) {
      return res.status(500).send({
        success: false,
        error
      })
    }
  },

  async getSubjectByClass(req, res) {
    try {
      const promise = Subjects.find({
        class: req.params.class
      }).exec();
      const subjects =  await promise;
      if (subjects) {
        return res.status(200).send({
          success: true,
          subjects
        })
      }
      return res.status(404).send({
        success: false,
        message: 'Class not found'
      })
    }
    catch(error) {
      return res.status(500).send({
        success: false,
        message:  'Internal Server Error',
        error
      })
    }
  }
};
