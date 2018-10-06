import mongoose from "mongoose";
import Subjects from "../models/Subjects";

mongoose.Promise = global.Promise;

export default {
  createSubject(req, res) {
    const { className, name } = req.body;

    const subject = new Subjects({
      className,
      classId: req.params.classId,
      name
    });
    subject.save().then((newSubject) => {
      return res.status(201).send({
        success: true,
        message: `Subject ${newSubject.name} succesfully added to class${newSubject.className}; `
      })
    })
  },

  async getAllSubjects(req, res) {
    try {
      const promise = Subject.find({
        classId: req.param.classId
      });
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

  async getSubjectDetails(req, res) {

  }
};
